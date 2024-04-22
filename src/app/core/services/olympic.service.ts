import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { IOlympic } from '../models/Olympic.model';
import { Injectable } from '@angular/core';
import { ICountryStatData, ILineChartData, ISeriesData } from '../models/Data.model';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // Properties of the service, principaly subject representing data for the component 
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<IOlympic[]>([]);
  private dataPieChartGraph$ = new BehaviorSubject<ISeriesData[]>([]);
  private dataLineChartGraph$ = new BehaviorSubject<ILineChartData[]>([]);
  private countryStatData$ = new BehaviorSubject<ICountryStatData[]>([]);
  private numberOfOlympicsGame$ = new BehaviorSubject<number>(0);
  private numberOfCountries$ = new BehaviorSubject<number>(0);
  private countryList$ = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {}

  // Public methods 

  /**
   * The function get data about the olympic games for each country and process it.
   * We execute one time the function for setting all subject with computed data.
   * 
   * We use take(1) for completing the observable after using the value.
   */
  loadInitialData() {
     this.http.get<IOlympic[]>(this.olympicUrl).pipe(
      take(1),
      catchError((error: Error) => {
        console.error('Error fetching Olympics data:', error.message);
        this.olympics$.error('An error occured');
        return [];
      })
    )
    .subscribe(olympicsData => {
      this.olympics$.next(olympicsData);
      this._processOlympicsDataForPieChart(olympicsData);
      this._processOlympicsDataForLineChart(olympicsData);
      this._processOlympicsDataForGlobalStats(olympicsData);
    });
  }

  /**
   * Method to obtain 'raw' data from the Olympic Games as an observable
   * @returns The observable of type IOlympic[]
   */
  public getOlympics(): Observable<IOlympic[]> {
    return this.olympics$.asObservable();
  }

  /**
   * Method to obtain Olympic Games data formatted for the pie chart as an observable
   * @returns The observable of type ISeriesData[]
   */ 
  public getDataForPieChart(): Observable<ISeriesData[]>{
    return this.dataPieChartGraph$.asObservable();
  }

  /**
   * Method to obtain Olympic Games data formatted for the line chart
   * @param countryName the country we want the data
   * @returns The observable of type ILineChartData[]
   */
  public getDataForLineChart(countryName: string): Observable<ILineChartData[]>{
    return this.dataLineChartGraph$.pipe(map(datas => datas.filter(data => data.name=== countryName )));
  }

  /**
   * Method to obtain Olympic Games stat data
   * @param countryName the country we want the data
   * @returns The observable of type ICountryStatData[]
   */
  public getCountryStatData(countryName: string): Observable<ICountryStatData[]>{
    return this.countryStatData$.pipe(map(datas => datas.filter(data => data.country=== countryName )  ));
  }

  /**
   * Method to obtain the number of Olympic Game process
   * @returns The observable of type number
   */
  public getNumberOfOlympicsGame(): Observable<number>{
    return this.numberOfOlympicsGame$.asObservable();
  }

  /**
   * Method to obtain the number of country 
   * @returns The observable of type number
   */
  public getNumberOfCountry(): Observable<number>{
    return this.numberOfCountries$.asObservable();
  }

  /**
   * Method to obtain the list of countries 
   * @returns The observable of type string[]
   */
  public getCountryList(): Observable<string[]>{
    return this.countryList$.asObservable();
  }

  // Private methods

  /**
   * Method for computing the input data for the pie chart.
   * We want to compute for each country the number of medals from all the Olympic Game.
   * We set the result into the corresponding subject.
   * @param olympics Input data about olympic games for all the countries
   */
  private _processOlympicsDataForPieChart(olympics: IOlympic[]){
    let dataArray: ISeriesData[] = [];
    try {
      for(let olympic of olympics){
        const countryName = olympic.country;
        let totalMedal = 0;
        for(let participation of olympic.participations){
          totalMedal += participation.medalsCount;
        }
        dataArray.push({name: countryName, value: totalMedal});
      }
      this.dataPieChartGraph$.next(dataArray);

    } catch (error) {
      console.error(`An error occurred during the execution of the function: ${JSON.stringify(error)}`);
    } 
  } 

  /**
   * Method for computing the input data for the line chart.
   * We want to compute for each country the number of medals earned for each olympic game participation.
   * We set the result into the corresponding subject.
   * @param olympics Input data about olympic games for all the countries
   */
  private _processOlympicsDataForLineChart(olympics: IOlympic[]){
    let lineChartDataArray: ILineChartData[] = [];

    try {
      for(let olympic of olympics){
        const countryName = olympic.country;
  
        const lineChartData: ILineChartData = {
          name: countryName,
          series: []
        }
  
        for(let participation of olympic.participations){
          lineChartData.series.push({name: participation.year.toString(), value: participation.medalsCount});
        }
  
        lineChartDataArray.push(lineChartData);
      }
  
      this.dataLineChartGraph$.next(lineChartDataArray);

    } catch (error) {
      console.error(`An error occurred during the execution of the function: ${JSON.stringify(error)}`);
    }
    
  }

  /**
   * Method for computing the input data for the info boxes.
   * We want to compute for each country the number of participation, the number of medals and the number of athletes.
   * We also want to compute the total number of Olympic Game and the number of countries.
   * For the number of Olympic Game, we use a Set for adding for each country the different year of participating. We can get all the edition this way.
   * We set the result into the corresponding subjects.
   * @param olympics Input data about olympic games for all the countries
   */
  private _processOlympicsDataForGlobalStats(olympics: IOlympic[]){
    try {
      let countryStatDataArray: ICountryStatData[]= [];
      let olympicGamesYear: Set<number> = new Set();
      let countryListArray: string[] = [];

      for(let olympic of olympics){
        const countryName = olympic.country;

        countryListArray.push(countryName);
        
        let totalAthlete = 0;
        let totalMedal = 0;
        for(let participation of olympic.participations){
          olympicGamesYear.add(participation.year);
          totalAthlete += participation.athleteCount;
          totalMedal += participation.medalsCount;
        }

        const countryStatData: ICountryStatData = {
          country: countryName,
          totalAthlete: totalAthlete,
          totalMedal: totalMedal,
          totalParticipation: olympic.participations.length
        }

        countryStatDataArray.push(countryStatData);
      }

      this.numberOfOlympicsGame$.next(olympicGamesYear.size);
      this.numberOfCountries$.next(countryStatDataArray.length);
      this.countryStatData$.next(countryStatDataArray);
      this.countryList$.next(countryListArray);

    } catch (error) {
      console.error(`An error occurred during the execution of the function: ${JSON.stringify(error)}`);
    }
  }
}



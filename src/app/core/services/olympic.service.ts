import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { IOlympic } from '../models/Olympic.model';
import { Injectable } from '@angular/core';
import { ICountryStatData, ILineChartData, ISeriesData } from '../models/Data.model';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<IOlympic[]>([]);
  private dataPieChartGraph$ = new BehaviorSubject<ISeriesData[]>([]);
  private dataLineChartGraph$ = new BehaviorSubject<ILineChartData[]>([]);
  private countryStatData$ = new BehaviorSubject<ICountryStatData[]>([]);
  private numberOfOlympicsGame$ = new BehaviorSubject<number>(0);
  private numberOfCountries$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  // Public methods 

  loadInitialData() {
     this.http.get<IOlympic[]>(this.olympicUrl).pipe(
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

  // Méthode pour récupérer les données des Jeux Olympiques
  public getOlympics(): Observable<IOlympic[]> {
    return this.olympics$.asObservable();
  }

  public getDataForPieChart(): Observable<ISeriesData[]>{
    return this.dataPieChartGraph$.asObservable();
  }

  public getDataForLineChart(countryName: string): Observable<ILineChartData[]>{
    return this.dataLineChartGraph$.pipe(map(datas => datas.filter(data => data.name=== countryName )));
  }

  public getCountryStatData(countryName: string): Observable<ICountryStatData[]>{
    return this.countryStatData$.pipe(map(datas => datas.filter(data => data.country=== countryName )  ));
  }

  public getNumberOfOlympicsGame(): Observable<number>{
    return this.numberOfOlympicsGame$.asObservable();
  }

  public getNumberOfCountry(): Observable<number>{
    return this.numberOfCountries$.asObservable();
  }

  // Private methods

  private _processOlympicsDataForPieChart(olympics: IOlympic[]){
    let res: ISeriesData[] = [];
    try {
      for(let olympic of olympics){
        const countryName = olympic.country;
        let totalMedal = 0;
        for(let participation of olympic.participations){
          totalMedal += participation.medalsCount;
        }
        res.push({name: countryName, value: totalMedal});
      }
      this.dataPieChartGraph$.next(res);

    } catch (error) {
      console.error(`An error occurred during the execution of the function: ${JSON.stringify(error)}`);
    } 
  } 

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
  
      console.log(lineChartDataArray);
      this.dataLineChartGraph$.next(lineChartDataArray);

    } catch (error) {
      console.error(`An error occurred during the execution of the function: ${JSON.stringify(error)}`);
    }
    
  }

  private _processOlympicsDataForGlobalStats(olympics: IOlympic[]){
    try {
      let countryStatDataArray: ICountryStatData[]= [];
      let olympicGamesYear: Set<number> = new Set();

      for(let olympic of olympics){
        const countryName = olympic.country;

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

      console.log(countryStatDataArray);
      this.numberOfOlympicsGame$.next(olympicGamesYear.size);
      this.numberOfCountries$.next(countryStatDataArray.length);
      this.countryStatData$.next(countryStatDataArray);

    } catch (error) {
      console.error(`An error occurred during the execution of the function: ${JSON.stringify(error)}`);
    }
  }
}



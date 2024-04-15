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

  constructor(private http: HttpClient) {}

  loadInitialData() {
     this.http.get<IOlympic[]>(this.olympicUrl).pipe(
      tap(() => {
        console.log("Into the loadInitialData");
        console.log(this.olympics$);
      }),
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
      this.dataPieChartGraph$.next(res);// = res;
    } catch (error) {
      console.error(`An error occurred during the execution of the function: ${JSON.stringify(error)}`);
    } 
  } 

  private _processOlympicsDataForLineChart(olympics: IOlympic[]){
    let lineChartDataArray: ILineChartData[] = [];
    let countryStatDataArray: ICountryStatData[]= [];

    for(let olympic of olympics){
      const countryName = olympic.country;

      const lineChartData: ILineChartData = {
        name: countryName,
        series: []
      }
      
      let totalAthlete = 0;
      let totalMedal = 0;
      for(let participation of olympic.participations){
        totalAthlete += participation.athleteCount;
        totalMedal += participation.medalsCount;
        lineChartData.series.push({name: participation.year.toString(), value: participation.medalsCount});
      }

      const countryStatData: ICountryStatData = {
        country: countryName,
        totalAthlete: totalAthlete,
        totalMedal: totalMedal,
        totalParticipation: olympic.participations.length
      }

      lineChartDataArray.push(lineChartData);
      countryStatDataArray.push(countryStatData);
    }

    this.dataLineChartGraph$.next(lineChartDataArray);
    this.countryStatData$.next(countryStatDataArray);
  }

}



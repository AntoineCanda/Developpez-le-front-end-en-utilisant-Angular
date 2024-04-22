import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, pipe, take } from 'rxjs';
import { ICountryStatData, ILineChartData } from 'src/app/core/models/Data.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  // Observable for the country data
  lineChartData$!: Observable<ILineChartData[]>;
  countryStatData$!: Observable<ICountryStatData[]>;
  countryList$!: Observable<string[]>;

  countryList!: string[];

  // Graph options
  xAxisLabel="Dates";
  yAxisLabel="Number of medals";
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  timeline: boolean = true;
  
  countryName: string = "";

  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router) { }
  
  // public Method
  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['country'];
    this.lineChartData$ = this.olympicService.getDataForLineChart(this.countryName);
    this.countryStatData$ = this.olympicService.getCountryStatData(this.countryName);
    this.countryList$ = this.olympicService.getCountryList();

    this.countryList$.subscribe(countryList => {
      pipe(take(1),
      catchError((error: Error) => {
        console.error('Error fetching Olympics data:', error.message);
        this.countryList = [];
        return [];
      }))
      this.countryList = countryList;
    });

  }
  
  goToHomePage(): void {
    this.router.navigate(['/']);
  }
 
}

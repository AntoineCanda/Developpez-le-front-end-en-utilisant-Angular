import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ICountryStatData, ILineChartData } from 'src/app/core/models/Data.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  
  lineChartData$!: Observable<ILineChartData[]>;
  countryStatData$!: Observable<ICountryStatData[]>;

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
    private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.countryName = this.route.snapshot.params['country'];
    this.lineChartData$ = this.olympicService.getDataForLineChart(this.countryName);
    this.countryStatData$ = this.olympicService.getCountryStatData(this.countryName);
  }
  
 
}

import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription, lastValueFrom, map, mergeMap, of, reduce, take, tap } from 'rxjs';
import { ICountryStatData, ILineChartData } from 'src/app/core/models/Data.model';
import { IOlympic } from 'src/app/core/models/Olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  
  lineChartData$!: Observable<ILineChartData[]>;
  countryStatData$!: Observable<ICountryStatData[]>;

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number,number] = [500,500];

  xAxisLabel="Year of olympic Game";
  yAxisLabel="Number of medals";
  
  constructor(private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router) { }
  
  ngOnInit(): void {
    const countryName = this.route.snapshot.params['country'];
    this.lineChartData$ = this.olympicService.getDataForLineChart(countryName);
    this.countryStatData$ = this.olympicService.getCountryStatData(countryName);
  }
  
 
}

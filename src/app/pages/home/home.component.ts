import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ISeriesData } from 'src/app/core/models/Data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
 
  dataPieChart$!: Observable<ISeriesData[]>;
  dataPieChart!: ISeriesData[];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number,number] = [500,500];

  xAxisLabel="Year of olympic Game";
  yAxisLabel="Number of medals";
  
  constructor(private olympicService: OlympicService) {
  }
 
 
  
  ngOnInit(): void {
    this.dataPieChart$ = this.olympicService.getDataForPieChart();
  }

 

}


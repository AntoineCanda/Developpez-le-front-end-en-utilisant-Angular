import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ISeriesData } from 'src/app/core/models/Data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
 
  dataPieChart$!: Observable<ISeriesData[]>;
  numberOfOlympicGames$!: Observable<number>;
  numberOfCountries$!: Observable<number>;

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number,number] = [500,500];

  
  constructor(private olympicService: OlympicService) {
  }
 
 
  
  ngOnInit(): void {
    this.dataPieChart$ = this.olympicService.getDataForPieChart();
    this.numberOfCountries$ = this.olympicService.getNumberOfCountry();
    this.numberOfOlympicGames$ = this.olympicService.getNumberOfOlympicsGame();
  }

 

}


import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ISeriesData } from 'src/app/core/models/Data.model';
import { Router } from '@angular/router';

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
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  
  constructor(private olympicService: OlympicService, private router:Router) {
  }
 
 
  
  ngOnInit(): void {
    this.dataPieChart$ = this.olympicService.getDataForPieChart();
    this.numberOfCountries$ = this.olympicService.getNumberOfCountry();
    this.numberOfOlympicGames$ = this.olympicService.getNumberOfOlympicsGame();
  }

  tooltipText(event: any): string {
    return `${event.data.label}<br/> 🏅 ${event.data.value}`;
  }

  goToDetailsPageOfCountry(event: any): void {
    this.router.navigateByUrl(`/details/${event.name}`);
  }
}


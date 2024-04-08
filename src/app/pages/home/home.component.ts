import { Component, OnInit } from '@angular/core';
import { Observable, map, mergeMap, of, reduce } from 'rxjs';
import { IOlympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IParticipation } from 'src/app/core/models/Participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<IOlympic[]> = of([]);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
  }


  public getNumberOfMedalByCountry(): Observable<{ name: string, value: number }[]> {
    return this.olympics$.pipe(
      // Utilisez mergeMap pour décomposer les participations de chaque pays en un seul flux
      mergeMap((olympics: IOlympic[]) => olympics),
      // Utilisez map pour transformer chaque participation en un objet avec le nom du pays et le nombre de médailles
      map((olympic: IOlympic) => {
        const totalMedals = olympic.participations.reduce((total: number, participation: IParticipation) => {
          return total + participation.medalsCount;
        }, 0);
        return { name: olympic.country, value: totalMedals };
      }),
      // Utilisez reduce pour agréger les résultats en un seul tableau
      reduce((acc: { name: string, value: number }[], curr: { name: string, value: number }) => {
        acc.push(curr);
        return acc;
      }, [])
    );
  }
}

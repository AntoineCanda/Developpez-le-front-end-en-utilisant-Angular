import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IOlympic } from '../models/Olympic';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<IOlympic[]>([]);

  constructor(private http: HttpClient) {}

  loadInitialData():  Observable<void | IOlympic[]> {
    return this.http.get<IOlympic[]>(this.olympicUrl).pipe(
      tap((olympics) => this.olympics$.next(olympics)),
      catchError((error: HttpErrorResponse) => {
        // Gestion des erreurs
        console.error('Error fetching Olympics data:', error.message);
        // Laisser le sujet dans un état "complet" avec une liste vide
        this.olympics$.next([]);
        // Retourner une nouvelle observable émettant l'erreur
        return new Observable<void>((observer) => {
          observer.error(error);
        });
      })
    );
  }

  // Méthode pour récupérer les données des Jeux Olympiques
  getOlympics(): Observable<IOlympic[]> {
    return this.olympics$.asObservable();
  }

}



import { catchError, map } from 'rxjs/operators';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';

import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import { CustomResponse } from './interface/custom-response';
import { BehaviorSubject, Observable, of, startWith } from 'rxjs';
import { Chart } from 'chart.js';
import { Category } from './enum/category.enum';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LVS_Frontend';
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private filterSubject = new BehaviorSubject<string>(''); //Google rxjs
  private dataSubject = new BehaviorSubject<CustomResponse>(null); //Google rxjs
  filterStatus$ = this.filterSubject.asObservable();

  isActive = false;

  constructor(private serverService: ServerService) { }

  //Konvertiere Category_XX in Category XX
  getCategoryString(category: Category): string {
    switch (category) {
      case Category.ELECTRONIC_DEVICES:
        return "Elektronik";
      case Category.GROCERIES:
        return "Lebensmittel";
      case Category.HOUSEHOLD_ITEMS:
        return "Haushaltsgegenstände";
      case Category.HYGIENE_ITEMS:
        return "Hygieneartikel";
      case Category.SEASON_ITEMS:
        return "Saisonartikel";
      default:
        return "";
    }
  }

  filterItems(category: Category): void {
    this.appState$ = this.serverService.filter$(category, this.dataSubject.value) // Nimm gespeicherte Daten v. request ==> Die sollen nicht gefiltert werden
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        return {dataState: DataState.LOADED, appData: response} //Response rein, weil sie Category.ALL enthält
      }),
      startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR, error})
      })
    );
  }



  saveItem(itemForm: NgForm): void {
    
    this.appState$ = this.serverService.save$(itemForm.value) // Nimm gespeicherte Daten v. request ==> Die sollen nicht gefiltert werden
    .pipe(
      map(response => {
        this.dataSubject.next( // Neues Item Objekt hinzufügen
          {...response, data:{ items: [response.data.item, ... this.dataSubject.value.data.items]}}
        );
        document.getElementById('add-item-submit');
        return {dataState: DataState.LOADED, appData: this.dataSubject.value} //Response rein, weil sie Category.ALL enthält
      }),
      startWith({dataState: DataState.LOADED, appData: this.dataSubject.value}),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR, error})
      })
    );
  }

  addClass(id: string){
    let element = document.getElementById(id);
    element.classList.add('show');
  }

  removeClass(id: string){
    let element = document.getElementById(id);
    element.classList.remove('show');
  }

  

  ngOnInit(): void {
    this.appState$ = this.serverService.items$ //Es werden AppStates zurückgegeben
      .pipe(            // Pipe -> Verkettung mehrerer Operationen

        map(response => { // map -> Führt eine Callback-Function aus, nachdem der response gekommen ist
          this.dataSubject.next(response); // Response speichern
          return { dataState: DataState.LOADED, appData: response } //Response bekommen -> daten geladen (Asynchron)
        }),
        startWith({ dataState: DataState.LOADING }), // Wenn noch nicht geladen -> Gib Loading State
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error: error }) //Error State
        })
      );

      
      let categoriesChart = new Chart("item-categories", {
        type: "pie",
        data: {
          labels: [
            "Lebensmittel",
            "Elektronikartikel",
            "Hygieneartikel",
            "Saisonartikel",
            "Haushaltsartikel"
          ],
          datasets: [{
            label: "Anteile der Warenkategorien",
            data: [300, 20, 150, 50, 100],
            backgroundColor: [
              'rgb(252, 41, 71)',
              'rgb(113, 73, 198)',
              'rgb(247, 219, 106)',
              'rgb(122, 168, 116)',
              'rgb(216, 100, 169)'
            ]
          }]
        }
      });

  
      	new Chart("categories-value", {
        type: "pie",
        data: {
          labels: [
            "Lebensmittel",
            "Elektronikartikel",
            "Hygieneartikel",
            "Saisonartikel",
            "Haushaltsartikel"
          ],
          datasets: [{
            label: "Anteile der Warenkategorien",
            data: [100, 220, 150, 100, 100],
            backgroundColor: [
              'rgb(252, 41, 71)',
              'rgb(113, 73, 198)',
              'rgb(247, 219, 106)',
              'rgb(122, 168, 116)',
              'rgb(216, 100, 169)'
            ]
          }]
        }
      }); 
  }
}

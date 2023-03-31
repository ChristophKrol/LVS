import { CatPriceSum } from './interface/catpricesum';
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
import { Item } from './interface/item';

import * as $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /**
   * Wichtige Variablen
   */
  title = 'LVS_Frontend';

  appState$: Observable<AppState<CustomResponse>>;

  readonly DataState = DataState;

  private dataSubject = new BehaviorSubject<CustomResponse>(null); //Google rxjs
  private categoryGroupedDataSubject = new BehaviorSubject<CustomResponse>(null); //Google rxjs
  private priceSumDataSubject = new BehaviorSubject<CustomResponse>(null); //Google rxjs

  private receivedResponse;

  isActive = false;

  chosenCategory = null;

  itemInput = 0;
  itemOutput = 0;

  currentItem = null; // zum löschen eines Items

  itemsStored = 0;

  itemValue = 0;

  /**
   * -----------------------------------------------------------
   */
  constructor(private serverService: ServerService) { }

  /**
   * Hilfsfunktion: Konvertiere Categeory zum String
   * @param category zu konvertierende Category
   * @returns String Repräsentation der Category
   */

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

  /**
   * Hilfsfunktion: Konvertiere String zur Category
   * @param categoryString String zum konvertieren
   * @returns Category
   */
  convertToCategory(categoryString: string): Category {
    switch (categoryString) {
      case "ELECTRONIC_DEVICES":
        return Category.ELECTRONIC_DEVICES;
      case "GROCERIES":
        return Category.GROCERIES;
      case "HOUSEHOLD_ITEMS":
        return Category.HOUSEHOLD_ITEMS;
      case "HYGIENE_ITEMS":
        return Category.HYGIENE_ITEMS;
      case "SEASON_ITEMS":
        return Category.SEASON_ITEMS;
      default:
        return Category.ALL;
    }
  }

  /**
   * Weitere Hilfsfunktionen
   */

  getChosenCategory(category: string): Category {
    return this.convertToCategory(category);
  }


  sout(): void {
    console.log("Test");

  }

  reload(): void {
    location.reload();
  }

  addClass(id: string) {
    let element = document.getElementById(id);
    element.classList.add('show');
  }
  openDeletePopup(id: string, item: Item) {
    this.currentItem = item;
    let element = document.getElementById(id);
    element.classList.add('show');
  }

  removeClass(id: string) {
    let element = document.getElementById(id);
    element.classList.remove('show');
  }

/**
 * Request-Funktionen
 * Interaktionen mit Backend 
 */


  filterItems(event: Event): void {
     // Nimm event, extrahiere Wert und konvertiere in Category 

    this.serverService.items$.subscribe(data =>{
      this.dataSubject = new BehaviorSubject<CustomResponse>(null);
      this.dataSubject.next(data); // daten neu laden 
    })

    let category: Category = this.convertToCategory((event.target as HTMLSelectElement).value);
    this.appState$ = this.serverService.filter$(category, this.dataSubject.value) // Nimm gespeicherte Daten v. request ==> Die sollen nicht gefiltert werden
      .pipe(
        map(response => {
          console.log("Filter-Response");
          console.log(response);
          return { dataState: DataState.LOADED, appData: response } //Response rein, weil sie Category.ALL enthält (eigentlich nicht)
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }


  saveItem(itemForm: NgForm): void {
    this.appState$ = this.serverService.save$(itemForm.value as Item) 
      .pipe(
        map(response => {
          this.dataSubject.next( // Neues Item Objekt hinzufügen
            { ...response, data: { items: [response.data.item, ... this.dataSubject.value.data.items] } }
          );
          document.getElementById('close-new-item').click();
          itemForm.reset();
          location.reload();
          this.itemInput ++;
          return { dataState: DataState.LOADED, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      );
  }

  deleteItem(): void {
    let item = this.currentItem;
    this.appState$ = this.serverService.delete$(item.id) 
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data:
              { items: this.dataSubject.value.data.items.filter(i => i.id !== item.id) }});
          document.getElementById('close-delete-item').click();
          location.reload();
          this.itemOutput ++;
          return { dataState: DataState.LOADED, appData: this.dataSubject.value } 
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      );
  }




  /**
   * Diese Funktion ist die Main()-Methode
   * Beim Starten der App, wird immert diese Funktion ausgeführt
   */
  ngOnInit(): void {  
    /**
     * Get Request für alle Items aus der Datenbank
    */

    this.appState$ = this.serverService.items$ //Es werden AppStates zurückgegeben
      .pipe(            // Pipe -> Verkettung mehrerer Operationen

        map(response => { // map -> Führt eine Callback-Function aus, nachdem der response gekommen ist
          this.dataSubject.next(response); // Response speichern
          this.itemsStored = this.dataSubject.value.data.items.length;
          this.receivedResponse = this.dataSubject.value;  
          return { dataState: DataState.LOADED, appData: response } //Response bekommen -> daten geladen (Asynchron)
        }),
        startWith({ dataState: DataState.LOADING }), // Wenn noch nicht geladen -> Gib Loading State
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error: error }) //Error State
        })
      ); 
    
      this.serverService.catGrouped$.subscribe(data =>{
        this.categoryGroupedDataSubject.next(data); // daten neu laden 

        let categoriesChart = new Chart("item-categories", {
          type: "pie",
          data: {
            labels: [
              "Elektronikartikel",
              "Lebensmittel",
              "Saisonartikel",
              "Hygieneartikel",
              "Haushaltsartikel"
            ],
            datasets: [{
              label: "Anteile der Warenkategorien",
              data: [
                this.categoryGroupedDataSubject.value.data.catGroup[0].count, 
                this.categoryGroupedDataSubject.value.data.catGroup[1].count, 
                this.categoryGroupedDataSubject.value.data.catGroup[2].count, 
                this.categoryGroupedDataSubject.value.data.catGroup[3].count, 
                this.categoryGroupedDataSubject.value.data.catGroup[4].count, 
              ],
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


      });
     
      this.serverService.catPriceSum$.subscribe(data =>{
        this.priceSumDataSubject.next(data); // daten neu laden 
        this.itemValue = 
        this.priceSumDataSubject.value.data.catPriceSum[0].price +
        this.priceSumDataSubject.value.data.catPriceSum[1].price +
        this.priceSumDataSubject.value.data.catPriceSum[2].price +
        this.priceSumDataSubject.value.data.catPriceSum[3].price +
        this.priceSumDataSubject.value.data.catPriceSum[4].price; 
      

        let priceChart = new Chart("categories-value", {
          type: "pie",
          data: {
            labels: [
              "Elektronikartikel",
              "Lebensmittel",
              "Saisonartikel",
              "Hygieneartikel",
              "Haushaltsartikel"
            ],
            datasets: [{
              label: "Anteile der Warenkategorien",
              data: [
                this.priceSumDataSubject.value.data.catPriceSum[0].price, 
                this.priceSumDataSubject.value.data.catPriceSum[1].price, 
                this.priceSumDataSubject.value.data.catPriceSum[2].price, 
                this.priceSumDataSubject.value.data.catPriceSum[3].price, 
                this.priceSumDataSubject.value.data.catPriceSum[4].price, 
              ],
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
      });

    $(document).ready(() => {
      
  
  
      
  

    })


 
    

  }
}

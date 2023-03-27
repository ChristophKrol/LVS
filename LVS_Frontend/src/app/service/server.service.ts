import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Category } from '../enum/category.enum';
import { CustomResponse } from '../interface/custom-response';
import { Item } from '../interface/item';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly apiUrl = "any";

  constructor(private http: HttpClient) { }

  //$ -> Observable
  // Get all items
  items$ = <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/item/list`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  // Get one item
  item$ = (id: number) => <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/item/get/${id}`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  // Save Item
  save$ = (item: Item) => <Observable<CustomResponse>>this.http.post<CustomResponse>(`${this.apiUrl}/server/item/save`, item)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  // Delete Item
  delete$ = (id: number) => <Observable<CustomResponse>>this.http.delete<CustomResponse>(`${this.apiUrl}/server/item/delete/${id}`)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );


  //Filter by Category
  filter$ = (category: Category, response: CustomResponse) => new Observable<CustomResponse>(
    subscriber => {
      console.log(response);
      let message: string;
      let filteredItems: Item[] = [];
      if (category === Category.ALL) {
        message = `Items filtered by ${category} category`;
      } else {
        const categoryString = getCategoryString(category);
        filteredItems = response.data.items.filter(item => item.category === category);

        //Ist das gefilterte Array nicht leer? (Gibt es items aus Kategorie XY)
        if (filteredItems.length > 0) {
          message = `Items filtered by ${categoryString} category`;
          response.data.items = filteredItems;
        } else {
          message = `No items found in ${categoryString} category`;
          response.data.items = [];
        }
      }

      subscriber.next({
        ...response,
        message,
        data: { items: filteredItems }
      }); //.next -> Neue Werte schreiben
      subscriber.complete();

      // Hilfsfunktion für Category
      function getCategoryString(category: Category): string {
        switch (category) {
          case Category.ELECTRONIC_DEVICES:
            return "Electronic Devices";
          case Category.GROCERIES:
            return "Groceries";
          case Category.HOUSEHOLD_ITEMS:
            return "Household Items";
          case Category.HYGIENE_ITEMS:
            return "Hygiene Items";
          case Category.SEASON_ITEMS:
            return "Season Items";
          default:
            return "";
        }
      }


    }
  ).pipe(tap(console.log), catchError(this.handleError));



  private handleError(error: HttpErrorResponse): Observable<never> { //Observable<never> --> Observable gibt keinen Wert zurück
    console.log(error);
    return throwError(`An error occurred - Error Code:  ${error.status}`);
  }

}

import { catchError, map } from 'rxjs/operators';
import { DataState } from './enum/data-state.enum';
import { AppState } from './interface/app-state';

import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import { CustomResponse } from './interface/custom-response';
import { Observable, of, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LVS_Frontend';
  appState$: Observable<AppState<CustomResponse>>

  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.appState$ = this.serverService.items$ //Es werden AppStates zurückgegeben
      .pipe(            // Pipe -> Verkettung mehrerer Operationen

        map(response => { // map -> Führt eine Callback-Function aus, nachdem der response gekommen ist

          return { dataState: DataState.LOADED, appData: response } //Response bekommen -> daten geladen (Asynchron)
        }),
        startWith({ dataState: DataState.LOADING }), // Wenn noch nicht geladen -> Gib Loading State
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error: error }) //Error State
        })
      );
  }
}

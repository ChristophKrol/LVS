import { AppState } from './interface/app-state';

import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import { CustomResponse } from './interface/custom-response';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LVS_Frontend';
  appState$: Observable<AppState<CustomResponse>>

  constructor(private serverService: ServerService){}

  ngOnInit(): void {

  }
}

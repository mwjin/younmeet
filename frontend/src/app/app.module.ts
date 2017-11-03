import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SuiModule } from 'ng2-semantic-ui';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomListComponent } from './dashboard/room-list/room-list.component';
import {MeetService} from "./services/meet.service";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  declarations : [
    AppComponent,
    DashboardComponent,
    RoomListComponent
  ],
  imports : [
    BrowserModule,
    RouterModule.forRoot(routes),
    SuiModule
  ],
  providers : [ MeetService ],
  bootstrap : [ AppComponent ]
})
export class AppModule {}

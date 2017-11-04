import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SuiModule } from 'ng2-semantic-ui';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomListComponent } from './dashboard/room-list/room-list.component';
import {MeetService} from "./services/meet.service";
import {RouterModule, Routes} from "@angular/router";
import { CreateRoomComponent } from './create-room/create-room.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RoomDetailComponent } from './room-detail/room-detail.component';
import {AccountService} from "./services/account.service";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'room/create', component: CreateRoomComponent }
];

@NgModule({
  declarations : [
    AppComponent,
    DashboardComponent,
    RoomListComponent,
    CreateRoomComponent,
    RoomDetailComponent
  ],
  imports : [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    SuiModule
  ],
  providers : [ AccountService,
    MeetService ],
  bootstrap : [ AppComponent ]
})
export class AppModule {}

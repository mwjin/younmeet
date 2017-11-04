import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { SuiModule } from 'ng2-semantic-ui';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomListComponent } from './dashboard/room-list/room-list.component';
import { MeetService } from './services/meet.service';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoomComponent } from './create-room/create-room.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RoomDetailComponent } from './room-detail/room-detail.component';
import {AccountService} from "./services/account.service";
import {HttpModule} from "@angular/http";
import {SignupComponent} from "./login/signup/signup.component";

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'room/create', component: CreateRoomComponent },
  { path: 'room/:id', component: RoomDetailComponent },
  { path : 'login', component : LoginComponent },
  { path : 'signup', component : SignupComponent },
];

@NgModule({
  declarations : [ AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    RoomListComponent,
    CreateRoomComponent,
    RoomDetailComponent
  ],
  imports : [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    SuiModule
  ],
  providers : [ AccountService,
    MeetService ],
  bootstrap : [ AppComponent ]
})

export class AppModule {
}

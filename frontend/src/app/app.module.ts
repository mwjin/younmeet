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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomDetailComponent } from './room-detail/room-detail.component';
import { AccountService } from './services/account.service';
import {CookieXSRFStrategy, HttpModule, XSRFStrategy} from '@angular/http';
import { SignupComponent } from './login/signup/signup.component';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './auth-guard/auth.guard';
import {CommonModule} from "@angular/common";

const routes: Routes = [
  { path : '', redirectTo : 'login', pathMatch : 'full' },
  { path : 'dashboard', component : DashboardComponent, canActivate : [ AuthGuard ] },
  { path : 'room/create', component : CreateRoomComponent, canActivate : [ AuthGuard ] },
  { path : 'room/:id', component : RoomDetailComponent, canActivate : [ AuthGuard ] },
  { path : 'login', component : LoginComponent },
  { path : 'signup', component : SignupComponent },
];

export function MyCookieStrategy() {
  return new CookieXSRFStrategy('csrftoken', 'X-CSRFToken');
}

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
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    SuiModule
  ],
  providers : [
    AccountService,
    MeetService,
    AuthenticationService,
    AuthGuard,
    {
      provide: XSRFStrategy,
      useFactory: MyCookieStrategy
    }
  ],
  bootstrap : [ AppComponent ]
})

export class AppModule {
}

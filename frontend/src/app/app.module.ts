import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { SuiModule } from 'ng2-semantic-ui';
import { YounmeetRoutingModule } from './younmeet-routing/younmeet-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomListComponent } from './dashboard/room-list/room-list.component';
import { MeetService } from './services/meet.service';
import { HttpModule } from '@angular/http';
import { AccountService } from './services/account.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './login/signup/signup.component';

@NgModule({
  declarations : [ AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    RoomListComponent ],
  imports : [ BrowserModule,
    SuiModule,
    YounmeetRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers : [ AccountService,
    MeetService ],
  bootstrap : [ AppComponent ]
})

export class AppModule {
}

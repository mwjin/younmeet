import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { SuiModule } from 'ng2-semantic-ui';
import { YounmeetRoutingModule } from './younmeet-routing/younmeet-routing.module';
import { HttpModule } from '@angular/http';
import { AccountService } from './services/account.service';

import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations : [ AppComponent, LoginComponent ],
  imports : [ BrowserModule, SuiModule, YounmeetRoutingModule, HttpModule ],
  providers : [ AccountService,
    { provide : APP_BASE_HREF, useValue : '/' } ],
  bootstrap : [ AppComponent ]
})
export class AppModule {
}

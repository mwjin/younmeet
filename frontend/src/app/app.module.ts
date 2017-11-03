import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { SuiModule } from 'ng2-semantic-ui';

@NgModule({
  declarations : [ AppComponent, LoginComponent ],
  imports : [ BrowserModule, SuiModule ],
  providers : [],
  bootstrap : [ AppComponent ]
})
export class AppModule {
}

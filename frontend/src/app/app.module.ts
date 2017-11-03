import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SuiModule } from 'ng2-semantic-ui';

@NgModule({
  declarations : [
    AppComponent
  ],
  imports : [
    BrowserModule,
    SuiModule
  ],
  providers : [],
  bootstrap : [ AppComponent ]
})
export class AppModule {}

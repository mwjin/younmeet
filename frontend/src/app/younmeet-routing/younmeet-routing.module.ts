import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from '../login/signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const routes: Routes = [
  { path : '', redirectTo : '/login', pathMatch : 'full' },
  { path : 'login', component : LoginComponent },
  { path : 'signup', component : SignupComponent },
  { path : 'dashboard', component : DashboardComponent },
];

@NgModule({
  imports : [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations : [],
  exports : [ RouterModule ]
})
export class YounmeetRoutingModule {}

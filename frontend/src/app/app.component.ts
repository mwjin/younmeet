import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector : 'app-root',
  templateUrl : './app.component.html',
  styleUrls : [ './app.component.css' ]
})
export class AppComponent {
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {}

  public hasCurrentUser(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  logOut(): void {
    this.authenticationService.logOut()
      .then(result => {
        if (result) {
          this.router.navigate([ 'login' ]);
        }
      });
  }
}

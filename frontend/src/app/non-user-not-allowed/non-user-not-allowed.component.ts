import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-non-user-not-allowed',
  templateUrl: './non-user-not-allowed.component.html',
  styleUrls: ['./non-user-not-allowed.component.css']
})
export class NonUserNotAllowedComponent implements OnInit, OnDestroy {
  gotoSignup: boolean;

  constructor(private router: Router,
              private authService: AuthenticationService) {
    this.gotoSignup = false;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  goBack(): void {
    this.router.navigate(['dashboard']);
  }

  goSignUp(): void {
    this.gotoSignup = true;
    this.router.navigate(['signup']);
  }
}

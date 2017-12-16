import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-non-user-not-allowed',
  templateUrl: './non-user-not-allowed.component.html',
  styleUrls: ['./non-user-not-allowed.component.css']
})
export class NonUserNotAllowedComponent implements OnInit {

  constructor(private router: Router,
              private authService: AuthenticationService) {}

  ngOnInit() {
  }

  goBack(): void {
    this.router.navigate(['dashboard']);
  }

  goSignUp(): void {
    this.router.navigate(['signup']);
    this.authService.logOut();
  }
}

import { Component, OnInit } from '@angular/core';
import {Location} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-non-user-not-allowed',
  templateUrl: './non-user-not-allowed.component.html',
  styleUrls: ['./non-user-not-allowed.component.css']
})
export class NonUserNotAllowedComponent implements OnInit {

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }

  goSignUp(): void {
    this.router.navigate(['signup']);
  }
}

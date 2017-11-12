import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector : 'app-login',
  templateUrl : './login.component.html',
  styleUrls : [ './login.component.css' ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private email_username: AbstractControl;
  private password: AbstractControl;

  ngOnInit() {
  }

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      'email/username' : [ '', Validators.required ],
      'password' : [ '', Validators.required ]
    });
    this.email_username = this.loginForm.controls[ 'email/username' ];
    this.password = this.loginForm.controls[ 'password' ];
  }

  tryLogin(): void {
    this.authenticationService.logIn(
      this.email_username.value,
      this.password.value)
      .then(isSignInSuccess => {
        if (isSignInSuccess) {
          let redirectUrl = this.authenticationService.redirectUrl;
          if (redirectUrl) {
            this.router.navigateByUrl(redirectUrl);
          }
          else {
            this.router.navigate(['dashboard']);
          }
        }
      });

  }

  /* TODO
   * Fill in next to method
   *  1. Email/Username is invalid when the input is not empty & does not exist in DB
   *  2. Password is invalid when the input password does not match with the password in DB
   */

  private emailUsernameValidator(control: FormControl): { [ s: string ]: boolean } {
    return { inValidEmailUsername : true };
  }

  private passwordValidator(control: FormControl): { [ s: string]: boolean } {
    return { inValidPassword : true };
  }
}

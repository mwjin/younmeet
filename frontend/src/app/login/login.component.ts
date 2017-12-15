import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector : 'app-login',
  templateUrl : './login.component.html',
  styleUrls : [ './login.component.css' ]
})


export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email_username: AbstractControl;
  password: AbstractControl;

  ngOnInit() {
  }

  constructor(private authenticationService: AuthenticationService,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      'email/username' : [ '', ],
      'password' : [ '', ]
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
          const redirectUrl = this.authenticationService.redirectUrl;
          if (redirectUrl) {
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.router.navigate([ 'dashboard' ]);
          }
        }
      }).catch(() => {
      document.getElementById('loginFail').style.display = 'block';
    });
  }
}

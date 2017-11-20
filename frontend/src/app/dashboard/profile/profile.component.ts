import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from './passwordValidator';
import { Location } from '@angular/common';

@Component({
  selector : 'app-profile',
  templateUrl : './profile.component.html',
  styleUrls : [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
  currentUser: User;
  passwordForm: FormGroup;
  private password: AbstractControl;
  private passwordConfirm: AbstractControl;

  constructor(private accountService: AccountService,
              private location: Location,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.accountService.getUserDetail()
      .then(user => {
        console.log(user);
        this.currentUser = user;
        this.passwordForm = this.formBuilder.group({
          'password' : [ '', Validators.required ],
          'passwordConfirm' : [ '', Validators.required ]
        }, {
          validator : PasswordValidator.matchForm
        });
        this.password = this.passwordForm.controls[ 'password' ];
        this.passwordConfirm = this.passwordForm.controls[ 'passwordConfirm' ];
      });

  }

  changePassword() {
    this.currentUser.password = this.password.value;
    this.accountService.putUser(this.currentUser)
      .then(isSuccessToPut => {
        if (isSuccessToPut) {
          this.location.back();
        }
      });
  }

  goBack(): void {
    this.location.back();
  }

}

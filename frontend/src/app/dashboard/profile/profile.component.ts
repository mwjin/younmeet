import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user';

@Component({
  selector : 'app-profile',
  templateUrl : './profile.component.html',
  styleUrls : [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
  private currentUser: User;
  profilePasswordForm: FormGroup;
  private password: AbstractControl;
  private passwordComfirmation: AbstractControl;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    this.accountService.getUserDetail()
      .then(user => {
        console.log(user);
        this.currentUser = user;
      });
  }

}

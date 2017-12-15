import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { User } from '../../models/user';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from './passwordValidator';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Room } from '../../models/room';
import { MeetService } from '../../services/meet.service';
import { SuiModalService, TemplateModalConfig, ModalTemplate } from 'ng2-semantic-ui';

export interface IContext {
  data: string;
}

@Component({
  selector : 'app-profile',
  templateUrl : './profile.component.html',
  styleUrls : [ './profile.component.css' ]
})
export class ProfileComponent implements OnInit {
  @ViewChild('modalTemplate')
  public modalTemplate: ModalTemplate<IContext, string, string>;

  public currentUser: User;
  public passwordForm: FormGroup;
  public password: AbstractControl;
  public passwordConfirm: AbstractControl;
  public currPassword: string;
  public showDialog: boolean;
  private pastRooms: Room[];


  constructor(private accountService: AccountService,
              private location: Location,
              private formBuilder: FormBuilder,
              private router: Router,
              private meetService: MeetService,
              private modalService: SuiModalService) {
  }

  ngOnInit() {
    this.showDialog = true;
    this.accountService.getUserDetail()
      .then(user => {
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
    this.meetService.getRoomsJoinedPast()
      .then(rooms => {
        this.pastRooms = rooms;
        console.log(rooms);
      });
  }

  changePassword() {
    this.currentUser.password = this.password.value;
    this.accountService.putUser(this.currentUser)
      .then(isSuccessToPut => {
        if (isSuccessToPut) {
          this.router.navigate([ 'dashboard' ]);
        }
      });
  }

  goBack(): void {
    this.router.navigate([ 'dashboard' ]);
  }

  checkCurrentPassword(): void {

    // for null value
    if (!this.currPassword)
      return;
    this.accountService.checkPassword(this.currPassword)
      .then(res => {
        if (res)
          this.showDialog = false;
      });
  }

  showUserInfo(): void {
    document.getElementById('pastappointment').style.display = 'none';
    document.getElementById('userinfo').style.display = 'block';
  }

  showPastRooms(): void {
    document.getElementById('pastappointment').style.display = 'block';
    document.getElementById('userinfo').style.display = 'none';
  }

  public open(dynamicContent: string = 'Example') {
    const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);

    config.closeResult = 'closed!';
    config.context = { data : dynamicContent };

    this.modalService
      .open(config)
      .onApprove(result => {
        this.accountService.deleteUser()
          .then(deleteSuccess => {
            console.log(deleteSuccess);
            if (deleteSuccess) {
              this.router.navigate([ 'login' ]);
            }
          });
      })
      .onDeny(result => { /* deny callback */});
  }
}

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
  public modalPasswordForm: FormGroup;
  public currentPassword: AbstractControl;
  public newPassword: AbstractControl;
  public newPasswordConfirm: AbstractControl;
  private pastRooms: Room[];


  constructor(private accountService: AccountService,
              private location: Location,
              private formBuilder: FormBuilder,
              private router: Router,
              private meetService: MeetService,
              private modalService: SuiModalService) {
  }

  ngOnInit() {
    this.accountService.getUserDetail()
      .then(user => {
        this.currentUser = user;

        // password change form
        this.passwordForm = this.formBuilder.group({
          'currentPassword' : [ '', ],
          'newPassword' : [ '', Validators.required ],
          'newPasswordConfirm' : [ '', Validators.required ]
        }, {
          validator : PasswordValidator.matchForm
        });
        this.currentPassword = this.passwordForm.controls[ 'currentPassword' ];
        this.newPassword = this.passwordForm.controls[ 'newPassword' ];
        this.newPasswordConfirm = this.passwordForm.controls[ 'newPasswordConfirm' ];

        this.modalPasswordForm = this.formBuilder.group({
          'passwordCheck' : [ '', ]
        });

        this.meetService.getRoomsJoinedPast()
          .then(rooms => {
            this.pastRooms = rooms;
          });
      });

  }

  changePassword() {
    this.accountService.checkPassword(this.currentPassword.value)
      .then(checked => {
        if (checked) {
          this.currentUser.password = this.newPassword.value;
          this.accountService.putUser(this.currentUser)
            .then(isSuccessToPut => {
              if (isSuccessToPut) {
                this.router.navigate([ 'dashboard' ]);
              }
            });
        } else {
          this.currentPassword.setErrors({ invalidCurrentPassword : true });
        }
      });
  }

  goBack(): void {
    this.router.navigate([ 'dashboard' ]);
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

    config.size = 'mini';
    config.context = { data : dynamicContent };

    this.modalService
      .open(config)
      .onApprove(() => {
        this.accountService.checkPassword(this.modalPasswordForm.controls[ 'passwordCheck' ].value)
          .then(checked => {
            if (checked) {
              this.accountService.deleteUser()
                .then(deleteSucces => {
                  if (deleteSucces) {
                    this.router.navigate([ 'login' ]);
                  }
                });
            } else {
              this.modalPasswordForm.controls[ 'passwordCheck' ].setErrors({ passwordCheckFailed : true });
            }
          });
      })
      .onDeny(() => { this.modalPasswordForm.controls[ 'passwordCheck' ].setValue('');});
  }
}

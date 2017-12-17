import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountServiceSpy } from '../../services/account.service.spy';
import { AccountService } from '../../services/account.service';
import { AuthenticationServiceSpy } from '../../services/authentication.service.spy';
import { RouterLinkStubDirective } from '../../../testing/router-stubs';
import { AuthenticationService } from '../../services/authentication.service';
import { SignupComponent } from './signup.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Location } from '@angular/common';

@Component({
  template : ``
})
class DashboardComponentMock {}

@Component({
  template : ``
})
class LoginComponentMock {}


describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: AuthenticationServiceSpy;
  let accountServiceSpy: AccountServiceSpy;
  let page: Page;

  class Page {
    errorMessage: HTMLDivElement;

    constructor() {
      this.errorMessage = fixture.debugElement.query(By.css('div#signUpFail')).nativeElement;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        RouterTestingModule.withRoutes([
          { path : 'dashboard', component : DashboardComponentMock },
          { path : 'login', component : LoginComponentMock }
        ]),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations : [
        SignupComponent,
        RouterLinkStubDirective,
        DashboardComponentMock,
        LoginComponentMock
      ],
      providers : [
        FormBuilder,
        { provide : AuthenticationService, useClass : AuthenticationServiceSpy },
        { provide : AccountService, useClass : AccountServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);

    component = fixture.componentInstance;

    authServiceSpy = fixture.debugElement.injector.get(AuthenticationService) as any;
    accountServiceSpy = fixture.debugElement.injector.get(AccountService) as any;
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      page = new Page();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ui error message display style should be none', () => {
    expect(page.errorMessage.style[ 'display' ]).toEqual('none');
  });

  describe('signUp', () => {
    it('should try signing up the user', async(() => {
      let email = component.email.value;
      let username = component.username.value;
      let name = component.name.value;
      let password = component.password.value;
      component.signUp();

      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(accountServiceSpy.postUserSignUp)
            .toHaveBeenCalledWith(username, email, password, name);
        expect(authServiceSpy.logIn)
            .toHaveBeenCalledWith(username, password);
      });
    }));

    beforeEach(() => {
      component.signUpForm.controls[ 'email' ].setValue('test@gmail.com');
      component.signUpForm.controls[ 'username' ].setValue('test');
      component.signUpForm.controls[ 'name' ].setValue('testname');
      component.signUpForm.controls[ 'password' ].setValue('password1');
      component.signUpForm.controls[ 'passwordConfirm' ].setValue('password1');
    });
    it('should try signing up the user and route to dashboard',
      async(inject([ Location ], (location: Location) => {
        component.signUp();
        let username: string = accountServiceSpy.postUserSignUp.calls.argsFor(0)[ 0 ];
        let email: string = accountServiceSpy.postUserSignUp.calls.argsFor(0)[ 1 ];
        let password: string = accountServiceSpy.postUserSignUp.calls.argsFor(0)[ 2 ];
        let name: string = accountServiceSpy.postUserSignUp.calls.argsFor(0)[ 3 ];

        fixture.whenStable().then(() => {
          expect(username).toEqual('test');
          expect(email).toEqual('test@gmail.com');
          expect(password).toEqual('password1');
          expect(name).toEqual('testname');
        });
      })));
  });
});

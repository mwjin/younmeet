import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AccountServiceSpy } from '../../services/account.service.spy';
import { AccountService } from '../../services/account.service';
import { AuthenticationServiceSpy } from '../../services/authentication.service.spy';
import { RouterLinkStubDirective } from '../../../testing/router-stubs';
import { AuthenticationService } from '../../services/authentication.service';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: AuthenticationServiceSpy;
  let accountServiceSpy: AccountServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
        ]),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        SignupComponent,
        RouterLinkStubDirective,
      ],
      providers: [
        { provide: AuthenticationService, useClass: AuthenticationServiceSpy },
        { provide: AccountService, useClass: AccountServiceSpy }
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('signUp', () => {
    it('should try signing up the user', async(() => {
      let email = component.email.value;
      let username = component.username.value;
      let password = component.password.value;
      component.signUp();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(accountServiceSpy.postUserSignUp)
            .toHaveBeenCalledWith(email, username, password);
        expect(authServiceSpy.logIn)
            .toHaveBeenCalledWith(username, password);
      });
    }));
  });
});
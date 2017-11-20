import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {AuthenticationServiceSpy} from "../services/authentication.service.spy";
import {RouterTestingModule} from "@angular/router/testing";
import {Component} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLinkStubDirective} from "../../testing/router-stubs";
import {AuthenticationService} from "../services/authentication.service";

@Component({
  template: ``
})
class SignUpComponentMock {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: AuthenticationServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'signup', component: SignUpComponentMock }
        ]),
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        LoginComponent,
        SignUpComponentMock,
        RouterLinkStubDirective,
      ],
      providers: [
        { provide: AuthenticationService, useClass: AuthenticationServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = fixture.debugElement.injector.get(AuthenticationService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tryLogin', () => {
    it('should try login the user', async(() => {
      let email_username = component.email_username.value;
      let password = component.password.value;
      component.tryLogin();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(authServiceSpy.logIn)
            .toHaveBeenCalledWith(email_username, password);
      });
    }));
  });
});

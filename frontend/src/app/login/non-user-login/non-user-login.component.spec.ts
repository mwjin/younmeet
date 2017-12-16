import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserLoginComponent } from './non-user-login.component';
import { SuiModule } from "ng2-semantic-ui";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthenticationServiceSpy} from "../../services/authentication.service.spy";
import {AuthenticationService} from "../../services/authentication.service";
import {Component} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLinkStubDirective} from "../../../testing/router-stubs";

@Component({
  template : ``
})
class LoginComponentMock {}

@Component({
  template : ``
})
class DashboardComponentMock {}


describe('NonUserLoginComponent', () => {
  let component: NonUserLoginComponent;
  let fixture: ComponentFixture<NonUserLoginComponent>;
  let authServiceSpy: AuthenticationServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponentMock },
          { path: 'login', component: LoginComponentMock }
        ]),
        SuiModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [
        NonUserLoginComponent,
        RouterLinkStubDirective,
        DashboardComponentMock,
        LoginComponentMock
      ],
      providers: [
        FormBuilder,
        { provide: AuthenticationService, useClass: AuthenticationServiceSpy },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonUserLoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = fixture.debugElement.injector.get(AuthenticationService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

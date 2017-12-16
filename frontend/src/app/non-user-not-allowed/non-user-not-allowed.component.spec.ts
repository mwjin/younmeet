import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserNotAllowedComponent } from './non-user-not-allowed.component';
import { SuiModule } from 'ng2-semantic-ui';
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLinkStubDirective} from "../../testing/router-stubs";
import { AuthenticationService } from "../services/authentication.service";
import { AuthenticationServiceSpy } from "../services/authentication.service.spy";
import {Component} from "@angular/core";

@Component({
  template : ``
})
class SignupComponentMock {}

@Component({
  template : ``
})
class DashboardComponentMock {}

describe('NonUserNotAllowedComponent', () => {
  let component: NonUserNotAllowedComponent;
  let fixture: ComponentFixture<NonUserNotAllowedComponent>;
  let authServiceSpy: AuthenticationServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SuiModule,
        RouterTestingModule.withRoutes([
          { path: 'dashboard', component: DashboardComponentMock },
          { path: 'signup', component: SignupComponentMock },
        ]),
      ],
      declarations: [
        NonUserNotAllowedComponent,
        RouterLinkStubDirective,
        SignupComponentMock,
        DashboardComponentMock,
      ],
      providers: [
        {provide: AuthenticationService, useClass: AuthenticationServiceSpy},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonUserNotAllowedComponent);
    authServiceSpy = fixture.debugElement.injector.get(AuthenticationService) as any;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonUserNotAllowedComponent } from './non-user-not-allowed.component';
import { SuiModule } from 'ng2-semantic-ui';
import {RouterTestingModule} from "@angular/router/testing";
import {RouterLinkStubDirective} from "../../testing/router-stubs";
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonUserNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Component} from "@angular/core";
import {SuiModule} from "ng2-semantic-ui";
import {FormsModule} from "@angular/forms";
import {AccountService} from "../../services/account.service";
import {AccountServiceSpy} from "../../services/account.service.spy";
import {RouterLinkStubDirective} from "../../../testing/router-stubs";

@Component({
  template: ``
})
class ProfileComponentMock {}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let accountServiceSpy: AccountServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'profile/', component: ProfileComponentMock }
        ]),
        FormsModule,
        SuiModule
      ],
      declarations: [
        ProfileComponent,
        ProfileComponentMock,
        RouterLinkStubDirective
      ],
      providers: [
        { provide: AccountService, useClass: AccountServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;


    accountServiceSpy = fixture.debugElement.injector.get(AccountServiceSpy) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('try changing password', () => {
    it('password should change accordingly', async(() => {
      let user = component.currentUser
      component.changePassword()
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(accountServiceSpy.putUser)
          .toHaveBeenCalledWith(user);
      });
    }));
  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { AccountServiceSpy } from '../../services/account.service.spy';
import { RouterLinkStubDirective } from '../../../testing/router-stubs';
import { DialogComponent } from './dialog/dialog.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockComponent } from 'ng2-mock-component';
import { MeetService } from '../../services/meet.service';
import { MeetServiceSpy } from '../../services/meet.service.spy';

@Component({
  template : ``
})
class ProfileComponentMock {}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let accountServiceSpy: AccountServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        RouterTestingModule.withRoutes([
          { path : 'profile/', component : ProfileComponentMock }
        ]),
        FormsModule,
        SuiModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      declarations : [
        ProfileComponent,
        ProfileComponentMock,
        RouterLinkStubDirective,
        DialogComponent,
        MockComponent({ selector : 'app-room-list', inputs : [ 'rooms', 'searchText', 'searchOption' ] })
      ],
      providers : [
        { provide : AccountService, useClass : AccountServiceSpy },
        { provide : MeetService, useClass : MeetServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    accountServiceSpy = fixture.debugElement.injector.get(AccountService) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

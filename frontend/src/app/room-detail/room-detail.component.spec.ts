import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailComponent } from './room-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MeetServiceSpy } from '../services/meet.service.spy';
import { MeetService } from '../services/meet.service';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard/dist';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';
import { SuiPopupModule } from 'ng2-semantic-ui';
import { MockComponent } from 'ng2-mock-component';
import { AgmCoreModule } from '@agm/core';
import { AccountServiceSpy } from '../services/account.service.spy';
import { AccountService } from '../services/account.service';

describe('RoomDetailComponent', () => {
  let component: RoomDetailComponent;
  let fixture: ComponentFixture<RoomDetailComponent>;
  let meetServiceSpy: MeetServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [
        RouterTestingModule,
        FormsModule,
        ClipboardModule,
        SuiPopupModule,
        AgmCoreModule
      ],
      declarations : [
        RoomDetailComponent,
      ],
      providers : [
        { provide : MeetService, useClass : MeetServiceSpy },
        { provide : AccountService, useClass : AccountServiceSpy },
        {
          provide : ActivatedRoute, useValue : {
            params : Observable.of({ hash : "asdf" })
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomDetailComponent);
    component = fixture.componentInstance;
    meetServiceSpy = fixture.debugElement.injector.get(MeetService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

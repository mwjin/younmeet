import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { TimeSelectComponent } from './time-select.component';
import { CalendarModule } from 'fullcalendar-ag4';
import { APP_BASE_HREF, Location, PathLocationStrategy } from '@angular/common';
import { LocationStrategy } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { FreetimeService } from '../../services/freetime.service';
import { HttpModule } from '@angular/http';
import { MeetService } from '../../services/meet.service';
import { MeetServiceSpy } from '../../services/meet.service.spy';
import { FreetimeServiceSpy } from '../../services/freetime.service.spy';
import * as $ from 'jquery';
import {GoogleScheduleService} from "../../services/google-schedule.service";
import {GoogleApiModule, GoogleApiService, NG_GAPI_CONFIG, NgGapiClientConfig} from "ng-gapi";

const fakeCalendarEvents: Object[] = [
  {
    start : '2017-11-10T14:00:00Z',
    end : '2017-11-10T14:50:00Z'
  },
  {
    start : '2017-11-11T15:00:00Z',
    end : '2017-11-11T15:50:00Z'
  },
  {
    start : '2017-11-12T16:00:00Z',
    end : '2017-11-12T17:50:00Z'
  },
  {
    start : '2017-11-13T17:00:00Z',
    end : '2017-11-13T18:30:00Z'
  },
];

/* For Google Calendar API */
const gapiClientConfig: NgGapiClientConfig = {
  client_id: '25518841710-ndjknsp4cjuupba6gn0k7t2grth86sji.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: [
    'https://www.googleapis.com/auth/calendar.readonly'
  ].join(' ')
};

describe('TimeSelectComponent', () => {
  let component: TimeSelectComponent;
  let fixture: ComponentFixture<TimeSelectComponent>;
  let meetServiceSpy: MeetServiceSpy;
  let freetimeServiceSpy: FreetimeServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ CalendarModule.forRoot(),
        RouterTestingModule,
        HttpModule,
        GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig,
        }),
      ],
      declarations : [ TimeSelectComponent ],
      providers : [ Location,
        GoogleScheduleService,
        GoogleApiService,
        { provide : FreetimeService, useClass : FreetimeServiceSpy },
        { provide : MeetService, useClass : MeetServiceSpy },
        { provide : LocationStrategy, useClass : PathLocationStrategy },
        { provide : APP_BASE_HREF, useValue : '/' } ]
    }).compileComponents();
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(TimeSelectComponent);
    component = fixture.componentInstance;
    meetServiceSpy = fixture.debugElement.injector.get(MeetService) as any;
    freetimeServiceSpy = fixture.debugElement.injector.get(FreetimeService) as any;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

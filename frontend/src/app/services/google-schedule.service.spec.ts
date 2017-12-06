import { TestBed, inject } from '@angular/core/testing';

import { GoogleScheduleService } from './google-schedule.service';
import { GoogleApiModule, GoogleApiService, NG_GAPI_CONFIG, NgGapiClientConfig } from 'ng-gapi';

/* For Google Calendar API */
const gapiClientConfig: NgGapiClientConfig = {
  client_id: '25518841710-ndjknsp4cjuupba6gn0k7t2grth86sji.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: [
    'https://www.googleapis.com/auth/calendar.readonly'
  ].join(' ')
};

describe('ScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GoogleApiModule.forRoot({
          provide: NG_GAPI_CONFIG,
          useValue: gapiClientConfig,
        }),
      ],
      providers: [GoogleScheduleService, GoogleApiService]
    }).compileComponents();
  });

  it('should be created', inject([GoogleScheduleService], (service: GoogleScheduleService) => {
    expect(service).toBeTruthy();
  }));
});

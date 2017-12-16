import {Injectable, OnDestroy} from '@angular/core';
import { GoogleApiService } from 'ng-gapi';
import { Subscription } from 'rxjs/Subscription';
import { Schedule } from '../models/schedule';
import { Timespan } from '../models/timespan';

@Injectable()
export class GoogleScheduleService implements OnDestroy {
  CLIENT_ID = '25518841710-5n8lt12ndapgo13uina8o36sb97dncol.apps.googleusercontent.com';
  API_KEY = 'AIzaSyCwB4a9uBGMkgK3SoZoHaZyB5eEHYqFjXU';
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  subscriber: Subscription;
  schedules: Schedule[] = [];
  isInit = false;

  private timeSpan: Timespan;

  constructor(private gapiService: GoogleApiService) {
    this.subscriber = this.gapiService.onLoad().subscribe(() => {
      this.handleClientLoad();
    });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  handleClientLoad() {
    gapi.load('client:auth2', this.initClient.bind(this));
  }

  initClient(): void {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    }).then(() => {
      // Default state
      gapi.auth2.getAuthInstance().signOut();

      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninState.bind(this));

    });
  }

  private updateSigninState(isSignedIn): void {
    if (isSignedIn) {
      this.listUpcomingEvents();
    } else {
      this.schedules = [];
      this.isInit = false;
    }
  }

  assignTimeSpan(timeSpan: Timespan): void {
    this.timeSpan = timeSpan;
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  private listUpcomingEvents(): void {
    this.getGoogleCalendarEvents('primary')
      .then(schedules => {
        this.schedules = schedules;
        this.isInit = true;
      });
  }

  /*
  private getGoogleCalendarIdList(): Promise<string[]> {
    return gapi.client.request({
      'path': '/calendar/v3/users/me/calendarList',
      'method': 'GET',
    }).then( response => {
      const events = response.result.items;
      const calendarIdList: string[] = [];

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        calendarIdList.push(event.id);
      }

      return calendarIdList;
    });
  }
  */

  private getGoogleCalendarEvents(calendarId: string): Promise<Schedule[]> {
    return gapi.client.request({
        'path': '/calendar/v3/calendars/calendarId/events',
        'method': 'GET',
        'params':
          {
            'calendarId': calendarId,
            'timeMin': this.timeSpan.start.toISOString(),
            'timeMax': this.timeSpan.end.toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
          },
      }
    ).then( response => {
      const schedules = []
      const events = response.result.items;

      if (events.length > 0) {
        for (let j = 0; j < events.length; j++) {
          const event = events[j];
          let start = event.start.dateTime;
          let end = event.end.dateTime;
          if (!start) {
            start = event.start.date;
          }
          if (!end) {
            end = event.end.date;
          }

          const schedule = new Schedule(event.summary, new Date(start), new Date(end));
          schedules.push(schedule);
        }
      }
      return schedules;
    });
  }

  /**
   *  Sign in the user upon button click.
   */
  signInGoogle(): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  signOutGoogle(): void {
    gapi.auth2.getAuthInstance().signOut();
  }

  getSchedules(): Promise<Schedule[]> {
    return Promise.resolve(this.schedules);
  }
}

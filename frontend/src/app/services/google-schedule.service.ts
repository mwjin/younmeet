import {Injectable, OnDestroy} from '@angular/core';
import { GoogleApiService } from 'ng-gapi';
import { Subscription } from 'rxjs/Subscription';
import { Schedule } from '../models/schedule';

@Injectable()
export class GoogleScheduleService implements OnDestroy {
  CLIENT_ID = '25518841710-ndjknsp4cjuupba6gn0k7t2grth86sji.apps.googleusercontent.com';
  API_KEY = 'AIzaSyDomeH3v19BXwuysY3wFhtoDk_CIyza65A';
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  subscriber: Subscription;
  schedules: Schedule[] = [];
  isInit = false;

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

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  private listUpcomingEvents(): void {
    gapi.client.request({
        'path': '/calendar/v3/calendars/calendarId/events',
        'method': 'GET',
        'params':
          {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 50,
            'orderBy': 'startTime'
          },
      }
    ).then( response => {
      const events = response.result.items;
      console.log('Upcoming events:');

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          let start = event.start.dateTime;
          let end = event.end.dateTime;
          if (!start) {
            start = event.start.date;
          }
          if (!end) {
            end = event.end.date;
          }

          console.log(event.summary + ' (' + start + ' ~ ' + end + ')');
          const schedule = new Schedule(event.summary, new Date(start), new Date(end));
          this.schedules.push(schedule);
        }
      } else {
        console.log('No upcoming events found.');
      }
      this.isInit = true;
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
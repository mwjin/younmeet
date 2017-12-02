import { Injectable } from '@angular/core';
import { GoogleApiService } from 'ng-gapi';

@Injectable()
export class ScheduleService {
  CLIENT_ID = '25518841710-ndjknsp4cjuupba6gn0k7t2grth86sji.apps.googleusercontent.com';
  API_KEY = 'AIzaSyDomeH3v19BXwuysY3wFhtoDk_CIyza65A';
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  constructor(private gapiService: GoogleApiService) {
    gapiService.onLoad().subscribe(() => {
      this.handleClientLoad();
    });
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
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));

      // Handle the initial sign-in state.
      this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  private updateSigninStatus(isSignedIn): void {
    if (isSignedIn) {
      this.listUpcomingEvents();
    } else {
      // TODO
      console.log('Cancel the sync');
    }
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  private listUpcomingEvents(): void {
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then( response => {
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
        }
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
}

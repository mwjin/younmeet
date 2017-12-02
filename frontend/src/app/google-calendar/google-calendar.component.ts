import { Component, OnInit } from '@angular/core';
import { GoogleApiService } from 'ng-gapi';


@Component({
  selector: 'app-google-calendar',
  templateUrl: './google-calendar.component.html',
  styleUrls: ['./google-calendar.component.css']
})
export class GoogleCalendarComponent implements OnInit {

  CLIENT_ID = '25518841710-ndjknsp4cjuupba6gn0k7t2grth86sji.apps.googleusercontent.com';
  API_KEY = 'AIzaSyDomeH3v19BXwuysY3wFhtoDk_CIyza65A';
  DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
  SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  authorizeButton: HTMLElement;
  signoutButton: HTMLElement;

  constructor(private gapiService: GoogleApiService) {
    gapiService.onLoad().subscribe(() => {
      this.handleClientLoad();
    });
  }

  ngOnInit() {
    this.authorizeButton = document.getElementById('authorize-button');
    this.signoutButton = document.getElementById('signout-button');
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
      this.authorizeButton.onclick = this.handleAuthClick;
      this.signoutButton.onclick = this.handleSignoutClick;
    });
  }

  private updateSigninStatus(isSignedIn): void {
    if (isSignedIn) {
      this.authorizeButton.style.display = 'none';
      this.signoutButton.style.display = 'block';
      this.listUpcomingEvents();
    } else {
      this.authorizeButton.style.display = 'block';
      this.signoutButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  handleAuthClick(event): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick(event): void {
    gapi.auth2.getAuthInstance().signOut();
  }

  private appendPre(message): void {
    const pre = document.getElementById('content');
    const textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
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
      this.appendPre('Upcoming events:');

      if (events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i];
          let when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          this.appendPre(event.summary + ' (' + when + ')');
        }
      } else {
        this.appendPre('No upcoming events found.');
      }
    });
  }
}

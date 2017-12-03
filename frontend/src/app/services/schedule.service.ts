import {Injectable, OnDestroy} from '@angular/core';
import { GoogleApiService } from 'ng-gapi';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ScheduleService implements OnDestroy {
  subscriber: Subscription;

  constructor(private gapiService: GoogleApiService) {
  }

  init(): void {
    console.log('A');
    this.subscriber = this.gapiService.onLoad().subscribe(() => {
      this.checkAuth();
    });
  }

  ngOnDestroy() {
    console.log('destroy service')
    this.subscriber.unsubscribe();
  }

  private checkAuth(): void {
    console.log('B');
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));

    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
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

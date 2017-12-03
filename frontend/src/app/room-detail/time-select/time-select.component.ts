import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import { Freetime } from '../../models/freetime';
import { FreetimeService } from '../../services/freetime.service';
import { MeetService } from '../../services/meet.service';
import { Timespan } from '../../models/timespan';
import { Router } from '@angular/router';
import { FreetimeResponseData } from '../../services/freetime-response-data';
import { GoogleScheduleService } from '../../services/google-schedule.service';

@Component({
  selector : 'app-time-select',
  templateUrl : './time-select.component.html',
  styleUrls : [ './time-select.component.css' ],
})

export class TimeSelectComponent implements OnInit, OnDestroy {
  private timeSpan: Timespan;
  public previousFreeTimes: Freetime[];
  public calendarOptions: Object;

  private authorizeButton: HTMLElement;
  private signoutButton: HTMLElement;

  constructor(private location: Location,
              private router: Router,
              private freetimeService: FreetimeService,
              private meetService: MeetService,
              private googleScheduleService: GoogleScheduleService) {
  }

  ngOnInit() {
    // For sync with Google Calendar API
    this.authorizeButton = document.getElementById('authorize-button');
    this.signoutButton = document.getElementById('signout-button');

    this.timeSpan = this.meetService.getTimeSpan();
    console.log('timespan = ' + this.timeSpan.start + ' to ' + this.timeSpan.end);
    if (!this.timeSpan) {
      this.router.navigate(['dashboard']);
    }
    this.timeSpan.end.setDate(this.timeSpan.end.getDate() + 1);

    // Option Set for calendar display
    this.freetimeService.getFreeTimes(this.meetService.getCurrentRoomId())
      .then(freeTimes => {
        this.previousFreeTimes = freeTimes.map(freetimeDate => FreetimeResponseData.responseToFreetime(freetimeDate));
        console.log(this.previousFreeTimes);
        this.calendarOptions = {
          locale: 'ko',
          slotDuration: '00:10:00', // set slot duration
          scrollTime: '09:00:00', // start scroll from 9AM
          height: 650,
          // Do not Modify Below This Comment
          eventOverlap: false,
          visibleRange: {
            'start': this.timeSpan.start.toJSON().split('T')[0]
            , 'end': this.timeSpan.end.toJSON().split('T')[0]
          },
          events: this.previousFreeTimes,
          timezone: 'local',
          defaultView: 'agenda',
          allDaySlot: false,
          editable: true,
          selectable: true,
          selectHelper: true,
          selectOverlap: false,
          select: function (start, end) {
            document.getElementById('deleteButton').style.display = 'none';
            let eventData;
            eventData = {
              title: '',
              start: start,
              end: end
            };
            $('#calendar').fullCalendar('renderEvent', eventData, true);
          },
          unselectAuto: true,
          eventClick: function (calEvent, jsEvent, view) {
            let selected = $('#calendar').fullCalendar('clientEvents', calEvent._id);
            let startTime = selected[0]['start']['_d']
              .toString().split(' ')[4].slice(0, 5);
            let endTime = selected[0]['end']['_d']
              .toString().split(' ')[4].slice(0, 5);
            document.getElementById('deleteButton').style.display = 'block';
            document.getElementById('deleteButton').innerText = `Delete ${startTime} - ${endTime}`;

            localStorage.setItem('deleteButtonId', calEvent._id);
          },
        };
      });

    this.googleButtonInitializer();
  }

  ngOnDestroy() {
    this.googleScheduleService.signOutGoogle();
  }

  googleButtonInitializer(): void {
    if (typeof gapi === 'undefined') {
      // Wait until gapi is defined by GoogleScheduleService.
      setTimeout(() => { this.googleButtonInitializer(); }, 500);
    } else {
      this.changeGoogleButtonState(gapi.auth2.getAuthInstance().isSignedIn.get());
      gapi.auth2.getAuthInstance().isSignedIn.listen(this.changeGoogleButtonState.bind(this));
    }
  }

  private changeGoogleButtonState(isSignedIn): void {
    if (isSignedIn) {
      this.authorizeButton.style.display = 'none';
      this.signoutButton.style.display = 'block';
    } else {
      this.authorizeButton.style.display = 'block';
      this.signoutButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  handleSyncClick(): void {
    this.googleScheduleService.signInGoogle();
    this.googleScheduleService.getSchedules().then(schedules => console.log(schedules));
  }

  /**
   *  Sign out the user upon button click.
   */
  handleCancelClick(): void {
    this.googleScheduleService.signOutGoogle();
  }

  public deleteEvent(): void {
    $('#calendar').fullCalendar('removeEvents', localStorage.getItem('deleteButtonId'));
    document.getElementById('deleteButton').style.display = 'none';
  }

  public deleteAllEvent(): void {
    $('#calendar').fullCalendar('removeEvents');
  }

  public collectFreeTimes(): void {
    // Collect all events and return array of [start_time, end_time] pair
    const freeTimes: Freetime[] = [];
    const selectedAreas = $('#calendar').fullCalendar('clientEvents');
    for (let index in selectedAreas) {
      freeTimes.push(new Freetime(selectedAreas[ index ][ 'start' ][ '_d' ],
        selectedAreas[ index ][ 'end' ][ '_d' ]));
    }
    console.log(JSON.stringify(freeTimes));

    this.freetimeService.postFreeTimes(freeTimes, this.meetService.getCurrentRoomId())
      .then(isSuccessToPost => {
        if (isSuccessToPost) {
          const roomHash = this.meetService.getCurrentRoomHash();
          this.router.navigate(['room', roomHash]);
        }
      });
  }
}



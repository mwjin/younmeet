import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import { Freetime } from '../../models/freetime';
import { FreetimeService } from '../../services/freetime.service';
import { MeetService } from '../../services/meet.service';
import { Timespan } from '../../models/timespan';
import { ActivatedRoute, Router } from '@angular/router';
import { FreetimeResponseData } from '../../services/freetime-response-data';
import { Schedule } from '../../models/schedule';
import { GoogleScheduleService } from '../../services/google-schedule.service';
import { Room } from '../../models/room';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';


@Component({
  selector : 'app-time-select',
  templateUrl : './time-select.component.html',
  styleUrls : [ './time-select.component.css' ],
})
export class TimeSelectComponent implements OnInit, OnDestroy {
  private timeSpan: Timespan;
  public previousFreeTimes: Freetime[];
  public calendarOptions: Object;
  public schedules: Schedule[];

  private syncButton: HTMLElement;
  private cancelButton: HTMLElement;

  private timeViewRanges: string[];
  private viewStart: number;
  private viewEnd: number;
  currentRoom: Room;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private router: Router,
              private freetimeService: FreetimeService,
              private meetService: MeetService,
              private googleScheduleService: GoogleScheduleService) {
  }

  ngOnInit() {
    // For sync with Google Calendar API
    this.syncButton = document.getElementById('authorize-button');
    this.cancelButton = document.getElementById('signout-button');

    // Option Set for calendar display
    this.meetService.getCurrentRoom(this.route)
      .flatMap(room => {
        this.currentRoom = room;
        this.timeSpan = new Timespan(room.timespan.start, room.timespan.end);
        this.timeSpan.end.setDate(this.timeSpan.end.getDate() + 1);
        this.timeViewRanges = [];

        let date: Date = new Date(this.timeSpan.start);
        while (this.compareTwoDateJustDate(date, this.timeSpan.end) <= 0) {
          this.timeViewRanges.push(this.convertDateToMomentString(date));
          date.setDate(date.getDate() + 1);
        }

        if (this.timeViewRanges.length > 3) {
          this.viewStart = 0;
          this.viewEnd = 3;
        } else {
          this.viewStart = 0;
          this.viewEnd = this.timeViewRanges.length - 1;
        }

        return Observable.fromPromise(this.freetimeService.getFreeTimes(room.id));
      })
      .subscribe(freeTimes => {
        this.previousFreeTimes = freeTimes.map(freetimeDate => FreetimeResponseData.responseToFreetime(freetimeDate));
        this.setCalendarOptions();
      });

    this.googleButtonInitializer();
  }

  ngOnDestroy() {
    this.googleScheduleService.signOutGoogle();
  }

  public deleteEvent(): void {
    $('#calendar').fullCalendar('removeEvents', localStorage.getItem('deleteButtonId'));
    document.getElementById('deleteButton').style.display = 'none';
  }

  public deleteAllEvent(): void {
    $('#calendar').fullCalendar('removeEvents',
      function (event) { return event.name !== 'googleSchedule'; });
  }

  public collectFreeTimes(): void {
    // Collect all events and return array of [start_time, end_time] pair
    const freeTimes: Freetime[] = [];
    const selectedAreas = $('#calendar').fullCalendar('clientEvents',
      function (event) { return event.name !== 'googleSchedule'; });
    for (let index in selectedAreas) {
      freeTimes.push(new Freetime(selectedAreas[ index ][ 'start' ][ '_d' ],
        selectedAreas[ index ][ 'end' ][ '_d' ]));
    }

    this.freetimeService.postFreeTimes(freeTimes, this.currentRoom.id)
      .then(isSuccessToPost => {
        if (isSuccessToPost) {
          this.router.navigate([ 'room', this.currentRoom.hashid ]);
        }
      });
  }

  public seePreviousDays(): void {
    // if user can press this button, it means that viewStart >= 3
    if (this.viewEnd - this.viewStart < 3) {
      this.viewStart -= 3;
      this.viewEnd = this.viewStart + 3;
    } else {
      this.viewStart -= 3;
      this.viewEnd -= 3;
    }
    $('#calendar').fullCalendar('option', 'visibleRange', {
      'start' : this.timeViewRanges[ this.viewStart ]
      , 'end' : this.timeViewRanges[ this.viewEnd ]
    });
  }

  public seeNextDays(): void {
    // if user can press this button, it means that viewEnd <= viewRangeLength
    if (this.viewEnd + 3 >= this.timeViewRanges.length) {
      this.viewEnd = this.timeViewRanges.length - 1;
      this.viewStart += 3;
    } else {
      this.viewEnd += 3;
      this.viewStart += 3;
    }
    $('#calendar').fullCalendar('option', 'visibleRange', {
      'start' : this.timeViewRanges[ this.viewStart ]
      , 'end' : this.timeViewRanges[ this.viewEnd ]
    });
  }

  private compareTwoDateJustDate(date1: Date, date2: Date) {
    if (date1.getFullYear() === date2.getFullYear()) {
      if (date1.getMonth() === date2.getMonth()) {
        return date1.getDate() - date2.getDate();
      }
      return date1.getMonth() - date2.getMonth();
    }
    return date1.getFullYear() - date2.getFullYear();
  }

  private convertDateToMomentString(date: Date): string {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();

    let momentString = '';
    momentString += year.toString();
    momentString += '-';
    if (month.toString().length === 1) {
      momentString += '0';
    }
    momentString += month.toString();
    momentString += '-';
    if (day.toString().length === 1) {
      momentString += '0';
    }
    momentString += day.toString();
    return momentString;
  }

  private setCalendarOptions() {
    this.calendarOptions = {
      locale : 'ko',
      slotDuration : '00:10:00', // set slot duration
      scrollTime : '09:00:00', // start scroll from 9AM
      height : 600,
      // Do not Modify Below This Comment
      columnFormat : 'ddd M/D',
      eventOverlap : function (stillEvent, movingEvent) {
        return stillEvent.name === 'googleSchedule';
      },
      eventRender : function (event, element) {
        if (event.name === 'googleSchedule') {
          element.append('from Google Calendar');
        }
      },
      visibleRange : {
        'start' : this.timeViewRanges[ this.viewStart ]
        , 'end' : this.timeViewRanges[ this.viewEnd ]
      },
      events : this.previousFreeTimes,
      timezone : 'local',
      defaultView : 'agenda',
      allDaySlot : false,
      editable : true,
      selectable : true,
      selectHelper : true,
      selectOverlap : function (stillEvent, movingEvent) {
        return stillEvent.name === 'googleSchedule';
      },
      longPressDelay : 10,
      select : function (start, end) {
        document.getElementById('deleteButton').style.display = 'none';
        let eventData;
        eventData = {
          title : '',
          start : start,
          end : end,
          overlap : false,
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true);
      },
      unselectAuto : true,
      eventClick : function (calEvent, jsEvent, view) {
        let selected = $('#calendar').fullCalendar('clientEvents', calEvent._id);
        let startTime = selected[ 0 ][ 'start' ][ '_d' ]
          .toString().split(' ')[ 4 ].slice(0, 5);
        let endTime = selected[ 0 ][ 'end' ][ '_d' ]
          .toString().split(' ')[ 4 ].slice(0, 5);
        document.getElementById('deleteButton').style.display = 'block';
        document.getElementById('deleteButton').innerText = `Delete ${startTime} - ${endTime}`;

        localStorage.setItem('deleteButtonId', calEvent._id);
      },
    };
  }

  /**** The lower part is for Google Calendar API ****/
  googleButtonInitializer(): void {
    if (typeof gapi === 'undefined') {
      // Wait until gapi is defined by GoogleScheduleService.
      setTimeout(() => { this.googleButtonInitializer(); }, 500);
    } else {
      // this.changeGoogleButtonState(gapi.auth2.getAuthInstance().isSignedIn.get());
      this.changeGoogleButtonState(false);
      // gapi.auth2.getAuthInstance().isSignedIn.listen(this.changeGoogleButtonState.bind(this));
    }
  }

  private changeGoogleButtonState(isSynchronized): void {
    if (isSynchronized) {
      this.syncButton.style.display = 'none';
      this.cancelButton.style.display = 'block';
    } else {
      this.syncButton.style.display = 'block';
      this.cancelButton.style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  handleSyncClick(): void {
    if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
      this.googleScheduleService.assignTimeSpan(this.timeSpan);
      this.googleScheduleService.signInGoogle();
    }

    this.getSchedules();
  }

  private getSchedules(): void {
    if (!this.googleScheduleService.isInit) {
      setTimeout(() => { this.getSchedules();}, 500);
    } else {
      this.googleScheduleService.getSchedules().then(schedules => {

        const calendar = $('#calendar');

        for (const schedule of schedules) {
          const event = {
            name : 'googleSchedule',
            title : schedule.title,
            start : schedule.start,
            end : schedule.end,
            color : 'rgb(230, 0, 0)',
            overlap : true,
            editable : false,
          };

          calendar.fullCalendar('renderEvent', event);
        }

      });

      this.changeGoogleButtonState(true);
    }
  }

  /**
   *  Sign out the user upon button click.
   */
  handleCancelClick(): void {
    this.changeGoogleButtonState(false);
    this.schedules = [];
    $('#calendar').fullCalendar('removeEvents',
      function (event) { return event.name === 'googleSchedule';});
  }
}



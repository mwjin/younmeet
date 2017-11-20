import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import { Freetime } from '../../models/freetime';
import { FreetimeService } from '../../services/freetime.service';
import { MeetService } from '../../services/meet.service';
import { Timespan } from '../../models/timespan';
import { Router } from '@angular/router';

@Component({
  selector : 'app-time-select',
  templateUrl : './time-select.component.html',
  styleUrls : [ './time-select.component.css' ]
})

export class TimeSelectComponent implements OnInit {
  private timeSpan: Timespan;
  private previousFreeTimes: Freetime[];
  public calendarOptions: Object;

  constructor(private location: Location,
              private router: Router,
              private freetimeService: FreetimeService,
              private meetService: MeetService,) {
    /*
      TODO:
        Get some appropriate arguments.
          Arguments will be (startTimeSpan: string, endTimeSpan: string, preSetEvents When try to modify)
        Set calendarOptions for user
     */
    /*
     console.log($('#calendar').fullCalendar('option', 'visibleRange'));
     $('#calendar').fullCalendar('option', 'visibleRange', { start : '2017-08-15', end : '2017-08-20' });
     console.log($('#calendar').fullCalendar('option', 'visibleRange'));*/
  }

  ngOnInit() {
    this.timeSpan = this.meetService.timespan;
    if (!this.timeSpan) {
      this.router.navigate([ 'dashboard' ]);
    }

    this.timeSpan.end.setDate(this.timeSpan.end.getDate() + 1);

    // Option Set for calendar display
    this.freetimeService.getFreeTimes(this.meetService.currentRoomId)
      .then(freeTimes => {
        this.previousFreeTimes = freeTimes;
        console.log(this.previousFreeTimes);
        for (let index in this.previousFreeTimes) {
          this.previousFreeTimes[ index ][ 'start' ] = this.previousFreeTimes[ index ][ 'start_time' ];
          this.previousFreeTimes[ index ][ 'end' ] = this.previousFreeTimes[ index ][ 'end_time' ];
        }
        this.calendarOptions = {
          locale : 'ko',
          slotDuration : '00:10:00', // set slot duration
          scrollTime : '09:00:00', // start scroll from 9AM
          height : 650,
          // Do not Modify Below This Comment
          visibleRange : {
            'start' : this.timeSpan.start.toJSON().split('T')[ 0 ]
            , 'end' : this.timeSpan.end.toJSON().split('T')[ 0 ]
          },
          events : [
            this.previousFreeTimes
          ],
          timezone : 'local',
          defaultView : 'agenda',
          allDaySlot : false,
          editable : true,
          selectable : true,
          selectHelper : true,
          select : function (start, end) {
            document.getElementById('deleteButton').style.display = 'none';
            let eventData;
            eventData = {
              title : '',
              start : start,
              end : end
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
      });

    /*
    this.calendarOptions = {
      locale : 'ko',
      slotDuration : '00:10:00', // set slot duration
      scrollTime : '09:00:00', // start scroll from 9AM
      height : 650,
      // Do not Modify Below This Comment
      visibleRange : {
        'start' : this.timeSpan.start.toJSON().split('T')[ 0 ]
        , 'end' : this.timeSpan.end.toJSON().split('T')[ 0 ]
      },
      timezone : 'local',
      defaultView : 'agenda',
      allDaySlot : false,
      editable : true,
      selectable : true,
      selectHelper : true,
      select : function (start, end) {
        document.getElementById('deleteButton').style.display = 'none';
        let eventData;
        eventData = {
          title : '',
          start : start,
          end : end
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
    */
  }

  public deleteEvent(): void {
    $('#calendar').fullCalendar('removeEvents', localStorage.getItem('deleteButtonId'));
    document.getElementById('deleteButton').style.display = 'none';
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

    /*
      After success to connect with backend, replace code as below

      */


    this.freetimeService.postFreeTimes(freeTimes, this.meetService.currentRoomId)
      .then(isSuccessToPost => {
        if (isSuccessToPost) {
          this.location.back();
        }
      });
  }
}



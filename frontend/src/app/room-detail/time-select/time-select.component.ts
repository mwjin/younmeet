import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as $ from 'jquery';
import { Freetime } from '../../models/freetime';

@Component({
  selector : 'app-time-select',
  templateUrl : './time-select.component.html',
  styleUrls : [ './time-select.component.css' ]
})

export class TimeSelectComponent implements OnInit {

  public calendarOptions: Object = {
    // Option Set for calendar display
    locale : 'ko',
    slotDuration : '00:10:00', // set slot duration
    scrollTime : '09:00:00', // start scroll from 9AM
    height : 650,
    visibleRange : {
      /* Calendar Day Range
       Should be differ by arguments of constructor
       */
      start : '2017-11-10',
      end : '2017-11-15'
    },
    // Do not Modify Below This Comment
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

  constructor(private location: Location) {
    /*
      TODO:
        Get some appropriate arguments.
          Arguments will be (startTimeSpan: string, endTimeSpan: string, preSetEvents When try to modify)
        Set calendarOptions for user
     */
  }

  ngOnInit() {
  }

  public deleteEvent(): void {
    $('#calendar').fullCalendar('removeEvents', localStorage.getItem('deleteButtonId'));
    document.getElementById('deleteButton').style.display = 'none';
  }

  public collectedDatas(): Array<Freetime> {
    // Collect all events and return array of [start_time, end_time] pair
    const freeTimes: Array<Freetime> = [];
    const selectedAreas = $('#calendar').fullCalendar('clientEvents');
    for (let index in selectedAreas) {
      freeTimes.push(new Freetime(selectedAreas[ index ][ 'start' ][ '_d' ],
        selectedAreas[ index ][ 'end' ][ '_d' ]));
    }

    for (let freeTime in freeTimes) {
      console.log(freeTimes[ freeTime ].start.toUTCString() + ', '
        + freeTimes[ freeTime ].end.toUTCString());
    }
    this.location.back();
    return freeTimes;
  }
}



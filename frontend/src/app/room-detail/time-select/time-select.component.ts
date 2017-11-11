import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector : 'app-time-select',
  templateUrl : './time-select.component.html',
  styleUrls : [ './time-select.component.css' ]
})
export class TimeSelectComponent implements OnInit {
  calendarOptions: Object = {
    headers : false,
    timezone : 'local',
    selectable : true,
    selectHelper : true,
    select : function (start, end) {
      let eventData;
      eventData = {
        start : start,
        end : end
      };
      $('#calendar').fullCalendar('renderEvent', eventData, true);
      console.log(start[ '_d' ]);
      console.log(end[ '_d' ]);
      console.log(start[ '_d' ].toString().split(' ')[ 4 ]);
    },
    defaultDate : '2017-11-10',
    defaultView : 'agendaWeek', // view type
    allDaySlot : false, // turn off the all day slot
    slotDuration : '00:10:00', // set slot duration
    scrollTime : '09:00:00', // start scroll from 9AM
    editable : true,
    views : {
      name : 'agendaWeek',
      title : 'Select Available Time',
    },
    locale : 'ko',
    themeSystem : 'bootstrap3'
  };

  constructor() {
  }

  ngOnInit() {
  }


}

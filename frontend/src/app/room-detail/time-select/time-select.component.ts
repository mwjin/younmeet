import { Component, OnInit } from '@angular/core';

@Component({
  selector : 'app-time-select',
  templateUrl : './time-select.component.html',
  styleUrls : [ './time-select.component.css' ]
})
export class TimeSelectComponent implements OnInit {


  calendarOptions: Object = {
    header : {
      left : 'prev,next today',
      center : 'title',
      right : 'month,agendaWeek,agendaDay'
    },
    selectable : true,
    selectHelper : true,
    select : function (start, end) {
      let eventData;
      eventData = {
        start : start,
        end : end
      };
      console.log(start[ '_d' ]);
      console.log(end[ '_d' ]);
    },

    defaultDate : '2014-06-12',
    defaultView : 'agendaWeek',
    editable : true,
    events : [
      {
        id : 999,
        title : 'Repeating Event',
        start : '2014-06-09T16:00:00'
      },
      {
        id : 999,
        title : 'Repeating Event',
        start : '2014-06-16T16:00:00'
      },
      {
        title : 'Meeting',
        start : '2014-06-12T10:30:00',
        end : '2014-06-12T12:30:00'
      },
      {
        title : 'Lunch',
        start : '2014-06-12T12:00:00'
      },
      {
        title : 'Birthday Party',
        start : '2014-06-13T07:00:00'
      },
      {
        title : 'Click for Google',
        url : 'http://google.com/',
        start : '2014-06-28'
      }
    ]
  };

  constructor() {

  }

  ngOnInit() {
  }


}

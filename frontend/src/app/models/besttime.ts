import { Partialattendinfo } from './partialattendinfo';
import * as moment from 'moment';

export class Besttime {
  constructor(public start: Date,
              public end: Date,
              public full_attend: String[],
              public partial_attend: Partialattendinfo[]) {}

  getDate(): [ string, string ] {
    let startDateStr = moment(this.start).format('MMMM Do (dddd)');
    let endDateStr = moment(this.end).format('MMMM Do (dddd)');
    return [ startDateStr, endDateStr ];
  }

  getStartTime(): string {
    return moment(this.start).format('h:mm A');
  }

  getEndTime(): string {
    return moment(this.end).format('h:mm A');
  }

  getDuration(): string {
    let duration = moment.duration(moment(this.end).diff(this.start));
    if (duration.minutes() === 0) {
      return '' + duration.hours() + ' hours';
    }
    else {
      return '' + duration.hours() + ' hours, ' + duration.minutes() + ' minutes';
    }
  }
}

import * as moment from 'moment';

export class Timespan {
  constructor(public start: Date = new Date(),
              public end: Date = new Date()) {
    this.start = new Date(start);
    this.end = new Date(end);
  }

  getDate(): [string, string] {
    let startDateStr = moment(this.start).format("MMMM Do (dddd)");
    let endDateStr = moment(this.end).format("MMMM Do (dddd)");
    return [startDateStr, endDateStr];
  }

  getStartTime(): string {
    return moment(this.start).format("h:mm A");
  }

  getEndTime(): string {
    return moment(this.end).format("h:mm A");
  }

  getDuration(): string {
    let duration = moment.duration(moment(this.end).diff(this.start));
    let hours = duration.hours();
    if (duration.minutes() === 0) {
      return '' + hours + (hours === 1? ' hour' : ' hours');
    }
    else {
      return '' + duration.hours() + (hours === 1? ' hour, ' : ' hours, ') + duration.minutes() + ' minutes';
    }
  }
}

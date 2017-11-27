import * as moment from 'moment';

export class Partialattendinfo {
  constructor(public username: string,
              public start: Date,
              public end: Date) {}

  getStartTime(): string {
    return moment(this.start).format('h:mm A');
  }

  getEndTime(): string {
    return moment(this.end).format('h:mm A');
  }
}

import * as moment from 'moment';
import { Timespan } from './timespan';

export class PartialAttendInfo {
  constructor(public username: string,
              public timespan: Timespan) {}


  getStartTime(): string {
    return this.timespan.getStartTime();
  }

  getEndTime(): string {
    return this.timespan.getEndTime();
  }
}

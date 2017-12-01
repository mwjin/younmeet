import { PartialAttendInfo } from './partial-attend-info';
import * as moment from 'moment';
import { Timespan } from './timespan';

export class Besttime {
  constructor(public timespan: Timespan,
              public full_attend: String[],
              public partial_attend: PartialAttendInfo[]) {

  }

  getDate(): [ string, string ] {
    return this.timespan.getDate();
  }

  getStartTime(): string {
    return this.timespan.getStartTime();
  }

  getEndTime(): string {
    return this.timespan.getEndTime();
  }

  getDuration(): string {
    return this.timespan.getDuration();
  }
}

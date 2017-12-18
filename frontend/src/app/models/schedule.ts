import { Timespan } from './timespan';

export class Schedule {
  public title: string;
  public timespan: Timespan;

  constructor(summary: string,
              start: Date,
              end: Date) {
    this.title = summary;
    this.timespan = new Timespan(start, end);
  }

  get start() {
    return this.timespan.start;
  }

  get end() {
    return this.timespan.end;
  }

  getStartTime() {
    return this.timespan.getStartTime();
  }

  getEndTime() {
    return this.timespan.getEndTime();
  }
}

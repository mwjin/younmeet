export class Schedule {
  public summary: string;
  public start: Date;
  public end: Date;

  constructor(summary: string,
              start: Date,
              end: Date) {
    this.summary = summary;
    this.start = start;
    this.end = end;
  }
}

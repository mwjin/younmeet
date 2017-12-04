export class Schedule {
  public title: string;
  public start: Date;
  public end: Date;

  constructor(summary: string,
              start: Date,
              end: Date) {
    this.title = summary;
    this.start = start;
    this.end = end;
  }
}

export class Freetime {
  constructor(public start: Date,
              public end: Date) {
  }

  public toJson(): string {
    return JSON.stringify({
      start : this.start.toJSON(),
      end : this.end.toJSON()
    });
  }
}

import { Freetime } from '../models/freetime';

export class FreetimeResponseData {
  start: Date;
  end: Date;

  static responseToFreetime(response: FreetimeResponseData): Freetime {
    let freetime = new Freetime(
      response.start,
      response.end
    );
    return freetime;
  }
}

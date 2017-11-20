import { Timespan } from '../models/timespan';

export class TimespanResponseData {
  id: number;
  start_time: string;
  end_time: string;
  room_id: number;

  static responseToFreetime(response: TimespanResponseData): Timespan {
    let timespan = new Timespan(
      new Date(response.start_time),
      new Date(response.end_time)
    );
    return timespan;
  }
}

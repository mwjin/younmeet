import { Freetime } from '../models/freetime';

export class FreetimeResponseData {
  id: number;
  start_time: string;
  end_time: string;
  user_id: number;
  room_id: number;

  static responseToFreetime(response: FreetimeResponseData): Freetime {
    let freetime = new Freetime(
      new Date(response.start_time),
      new Date(response.end_time)
    );
    return freetime;
  }
}

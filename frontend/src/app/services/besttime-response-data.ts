import { Besttime } from '../models/besttime';
import { PartialAttendInfo } from '../models/partial-attend-info';
import { Timespan } from '../models/timespan';

export class BesttimeResponseData {
  start_time: string;
  end_time: string;
  full_attend: String[];
  partial_attend: PartialAttendInfoResponseData[];

  static responseToBestTime(response: BesttimeResponseData): Besttime {
    return new Besttime(
      new Timespan(new Date(response.start_time), new Date(response.end_time)),
      response.full_attend,
      response.partial_attend ?
        response.partial_attend.map(res => PartialAttendInfoResponseData.responseToPartialAttend(res)) : []);
  }
}

class PartialAttendInfoResponseData {
  username: string;
  start: string;
  end: string;

  static responseToPartialAttend(response: PartialAttendInfoResponseData): PartialAttendInfo {
    return new PartialAttendInfo(response.username,
      new Timespan(new Date(response.start), new Date(response.end)));
  }
}

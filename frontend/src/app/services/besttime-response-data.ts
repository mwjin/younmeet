import { Besttime } from '../models/besttime';
import { Partialattendinfo } from '../models/partialattendinfo';

export class BesttimeResponseData {
  start_time: string;
  end_time: string;
  full_attend: String[];
  partial_attend: PartialAttendInfoResponseData[];

  static responseToBestTime(response: BesttimeResponseData): Besttime {
    return new Besttime(new Date(response.start_time),
      new Date(response.end_time),
      response.full_attend,
      response.partial_attend.map(partialAttendResponse => PartialAttendInfoResponseData.responseToPartialAttend(partialAttendResponse)));
  }
}

class PartialAttendInfoResponseData {
  username: string;
  start: string;
  end: string;

  static responseToPartialAttend(response: PartialAttendInfoResponseData): Partialattendinfo {
    return new Partialattendinfo(response.username,
      new Date(response.start),
      new Date(response.end));
  }
}

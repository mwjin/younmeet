import { Timespan } from '../models/timespan';

export class CreateRoomForm {
  constructor(public name: string = '',
              public duration: number = 30,
              public minPeople: number = 1,
              public timeSpan: Timespan = new Timespan(),
              public anonymity: boolean = false) {}
}

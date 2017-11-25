import { Timespan } from '../models/timespan';

export class CreateRoomForm {
  constructor(public name: string = '',
              public duration: number = 30,
              public timespan: Timespan = new Timespan(),
              public anonymity: boolean = false) {}
}

import {Timespan} from "./timespan";

export class Room {

  constructor(public name: string = '',
              public duration: number = 0,
              public timespan: Timespan = new Timespan(),
              public anonymity: boolean = false,
              public place: string = '',
              public urgent: boolean = true,
              public id?: number) {

  }
}

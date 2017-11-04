import {Timespan} from "./timespan";
import {User} from "./user";

export class Room {

  users: User[] = [];
  owner: User;
  createdTime: Date;

  constructor(public name: string = '',
              public duration: number = 0,
              public timespan: Timespan = new Timespan(),
              public anonymity: boolean = false,
              public place: string = '',
              public urgent: boolean = true,
              public id?: number) {

  }
}

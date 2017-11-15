import { Timespan } from './timespan';
import { User } from './user';
import { UserInfo } from './user-info';

export class Room {

  users: UserInfo[] = [];
  owner: UserInfo;
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

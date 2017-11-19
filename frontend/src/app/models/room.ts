import { Timespan } from './timespan';
import { User } from './user';
import { UserInfo } from './user-info';

export interface Room {
  name: string;
  duration: number;
  timespan: Timespan;
  anonymity: boolean;
  place: string;
  urgent: boolean;
  createdTime: Date;
  users: UserInfo[];
  owner: UserInfo;
  id?: number;
}

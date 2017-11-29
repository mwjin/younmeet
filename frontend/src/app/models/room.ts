import { Timespan } from './timespan';
import { User } from './user';
import { UserInfo } from './user-info';

export interface Room {
  name: string;
  hashid: string;
  duration: number;
  timespan: Timespan;
  anonymity: boolean;
  place: string;
  latitude: number;
  longitude: number;
  urgent: boolean;
  createdTime: Date;
  users: UserInfo[];
  owner: UserInfo;
  id?: number;
}

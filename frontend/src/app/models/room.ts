import { Timespan } from './timespan';
import { User } from './user';
import { UserInfo } from './user-info';

export interface Room {
  name: string;
  hashid: string;
  duration: number;
  timespan: Timespan;
  bestTimespan: Timespan;
  anonymity: boolean;
  place: string;
  latitude: number;
  longitude: number;
  createdTime: Date;
  memberCount: number;
  owner: UserInfo;
  id?: number;
}

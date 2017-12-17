import { Room } from '../models/room';
import { Timespan } from '../models/timespan';
import { UserInfo } from '../models/user-info';
import { CreateRoomForm } from '../create-room/create-room-form';

export interface RoomResponse {
  id: number;
  hashid: string;
  name: string;
  place: string;
  latitude: number;
  longitude: number;
  anonymity: boolean,
  best_start_time: Date;
  best_end_time: Date;
  min_time_required: number;
  created_time: Date;
  owner: number;
  member_count: number;
  time_span_start: Date;
  time_span_end: Date;
}
/*
export function roomToResponse(room: Room): RoomResponse {
  return {
    id : room.id,
    hashid : room.hashid,
    name : room.name,
    place : room.place,
    latitude : room.latitude,
    longitude : room.longitude,
    anonymity : room.anonymity,
    best_start_time : null,
    best_end_time : null,
    min_time_required : room.duration,
    created_time : room.createdTime,
    owner : room.owner.id,
    members : room.users.map(user => user.id),
    time_span_start : room.timespan.start,
    time_span_end : room.timespan.end
  };
}
*/

export function roomFromResponse(res: RoomResponse): Room {
  return {
    name : res.name,
    hashid : res.hashid,
    duration : res.min_time_required,
    timespan : new Timespan(res.time_span_start, res.time_span_end),
    anonymity : res.anonymity,
    place : res.place,
    latitude : res.latitude,
    longitude : res.longitude,
    createdTime : res.created_time,
    member_count: res.member_count,
    owner : new UserInfo(res.owner),
    id : res.id,
  };
}

export interface RoomCreateRequest {
  name: string;
  place: string;
  min_time_required: number;
  min_members: number;
  time_span_start: Date;
  time_span_end: Date;
  anonymity: boolean;
}

export function roomFormToCreateResponse(roomForm: CreateRoomForm): RoomCreateRequest {
  return {
    name : roomForm.name,
    place : '',
    min_time_required : roomForm.duration,
    min_members : roomForm.minPeople,
    time_span_start : roomForm.timeSpan.start,
    time_span_end : roomForm.timeSpan.end,
    anonymity : roomForm.anonymity
  };
}

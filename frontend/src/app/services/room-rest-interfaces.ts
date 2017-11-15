import {Room} from "../models/room";
import {Timespan} from "../models/timespan";
import {UserInfo} from "../models/user-info";
import { CreateRoomForm } from '../create-room/create-room-form';

export interface RoomResponse {
  id: number;
  name: string;
  place: string;
  best_start_time: Date;
  best_end_time: Date;
  min_time_required: number;
  members?: number[];
  created_time: Date;
  owner: number;
}

export function roomToResponse(room: Room): RoomResponse {
  return {
    id: room.id,
    name: room.name,
    place: room.place,
    best_start_time: room.timespan.start,
    best_end_time: room.timespan.end,
    min_time_required: room.duration,
    members: room.users.map(user => user.id),
    created_time: room.createdTime,
    owner: room.owner.id
  }
}

export function roomFromResponse(res: RoomResponse): Room {
  return {
    name: res.name,
    duration: res.min_time_required,
    timespan: new Timespan(res.best_start_time, res.best_end_time),
    anonymity: false,
    place: res.place,
    urgent: true,
    createdTime: res.created_time,
    users: res.members? res.members.map(id => new UserInfo(id)) : [],
    owner: new UserInfo(res.owner),
    id: res.id,
  };
}

export interface RoomCreateRequest {
  name: string;
  place: string;
  min_time_required: number;
  time_span_min: Date;
  time_span_max: Date;
}

export function roomFormToCreateResponse(
  roomForm: CreateRoomForm): RoomCreateRequest {
  return {
    name: roomForm.name,
    place: "",
    min_time_required: roomForm.duration,
    time_span_min: roomForm.timespan.start,
    time_span_max: roomForm.timespan.end
  }
}

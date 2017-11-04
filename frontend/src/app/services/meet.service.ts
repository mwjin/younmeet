import { Injectable } from '@angular/core';
import {Room} from "../models/room";
import {Timespan} from "../models/timespan";

let ROOMS_CREATED: Room[] = [
  new Room('Room 1', 30, new Timespan(), false, 'Seoul Nat. Univ. 302', true, 1),
  new Room('Room 2', 30, new Timespan(), false, 'Seoul Nat. Univ. Station', true, 2),
  new Room('Room 3', 30, new Timespan(), false, 'Nakseongdae Station', false, 3)
];

let ROOMS_JOINED: Room[] = [
  new Room('Room 4', 60, new Timespan(), false, 'Seoul Nat. Univ. 301', true, 4),
  new Room('Room 5', 60, new Timespan(), false, 'Seoul Nat. Univ. Student Building', true, 5),
  new Room('Room 6', 60, new Timespan(), false, 'Shinlim Station', false, 6)
];

@Injectable()
export class MeetService {

  // Note: this is just a fake service implementation
  // We need a proper backend to test the real thing...
  // This code may be used in the future to mock MeetService.

  rooms: Room[] = [];

  getRoomsCreatedByMe(): Promise<Room[]> {
    return Promise.resolve(ROOMS_CREATED);
  }

  getRoomsJoinedByMe(): Promise<Room[]> {
    return Promise.resolve(ROOMS_JOINED);
  }

  addRoom(room: Room): Promise<Room> {
    room.id = this.rooms.length;
    this.rooms.push(room);
    return Promise.resolve(room);
  }

  deleteRoom(room: Room): Promise<Response> {
    let roomIndex = this.rooms.indexOf(room);
    this.rooms.splice(roomIndex, 1);
    let response = new Response(new Blob(), { "status": 200, "statusText": "Room deleted" });
    return Promise.resolve(response);
  }

}

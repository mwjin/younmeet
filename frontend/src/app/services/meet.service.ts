import { Injectable } from '@angular/core';
import {Room} from "../models/room";

let ROOMS_CREATED: Room[] = [
  new Room('Room 1', 'Seoul Nat. Univ. 302', 1),
  new Room('Room 2', 'Seoul Nat. Univ. Station', 2)
];

let ROOMS_JOINED: Room[] = [
  new Room('Room 3', 'Seoul Nat. Univ. 301', 3),
  new Room('Room 4', 'Seoul Nat. Univ. Student Building', 4)
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

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

  getRoomsCreatedByMe(): Promise<Room[]> {
    return Promise.resolve(ROOMS_CREATED);
  }

  getRoomsJoinedByMe(): Promise<Room[]> {
    return Promise.resolve(ROOMS_JOINED);
  }
}

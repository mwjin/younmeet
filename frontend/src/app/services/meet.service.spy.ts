import { Injectable } from '@angular/core';
import {Room} from "../models/room";
import {Timespan} from "../models/timespan";
import {User} from "../models/user";

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

let TEST_USERS: User[] = [
  new User(1, 'alice', 'alice@snu.ac.kr', 'alice'),
  new User(2, 'bob', 'bob@snu.ac.kr', 'bob'),
  new User(3, 'chris', 'chris@snu.ac.kr', 'chris'),
];

let TEST_AVAILABLE_TIME: Timespan[] = [
  new Timespan(),
  new Timespan(),
  new Timespan()
];

// Fake meet service implementation
@Injectable()
export class MeetServiceSpy {

  rooms: Room[] = [];

  constructor() {
    for (let room of ROOMS_CREATED) {
      room.users = TEST_USERS.slice(0);
      room.owner = TEST_USERS[0];
    }
    for (let room of ROOMS_JOINED) {
      room.users = TEST_USERS.slice(0);
      room.owner = TEST_USERS[0];
    }
  }

  getRoomsCreatedByMe = jasmine.createSpy('getRoomsCreatedByMe').and.callFake(
    () => Promise.resolve(ROOMS_CREATED)
  );

  getRoomsJoinedByMe = jasmine.createSpy('getRoomsJoinedByMe').and.callFake(
    () => Promise.resolve(ROOMS_JOINED)
  );

  getRoomById = jasmine.createSpy('getRoomById').and.callFake((id: number) => {
    let room = ROOMS_CREATED
      .concat(ROOMS_JOINED)
      .filter(room => room.id === id)[0];
    console.log(room);
    return Promise.resolve(room);
  });

  getUsersInRoom = jasmine.createSpy('getUsersInRoom').and.callFake(
    (id: number) => Promise.resolve(TEST_USERS)
  );

  getAvailableTime = jasmine.createSpy('getAvailableTime').and.callFake(
    (roomId: number) => Promise.resolve(TEST_AVAILABLE_TIME)
  );

  addRoom = jasmine.createSpy('addRoom').and.callFake((room: Room) => {
    room.id = this.rooms.length;
    this.rooms.push(room);
    return Promise.resolve(room);
  });

  deleteRoom = jasmine.createSpy('deleteRoom').and.callFake((roomId: number) => {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
    let response = new Response(new Blob(), {'status': 200, 'statusText': 'Room deleted'});
    return Promise.resolve(response);
  });
}

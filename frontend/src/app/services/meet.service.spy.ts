import { Injectable } from '@angular/core';
import { Room } from '../models/room';
import { Timespan } from '../models/timespan';
import { User } from '../models/user';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import "rxjs/add/observable/of"

const ROOMS_CREATED: Room[] = [
  <Room>{
    name : 'Room 1',
    duration : 30,
    timespan : new Timespan(),
    anonymity : false,
    place : 'Seoul Nat. Univ. 302',
    urgent : true,
    createdTime : new Date(),
    id : 1,
    hashid : 'hash1',
    member_count: 1,
  },
  <Room>{
    name : 'Room 2',
    duration : 30,
    timespan : new Timespan(),
    anonymity : false,
    place : 'Seoul Nat. Univ. Station',
    urgent : true,
    createdTime : new Date(),
    id : 2,
    hashid : 'hash2',
    member_count: 2,
  },
  <Room>{
    name : 'Room 3',
    duration : 30,
    timespan : new Timespan(),
    anonymity : false,
    place : 'Nakseongdae Station',
    urgent : true,
    createdTime : new Date(),
    id : 3,
    hashid : 'hash3',
    member_count: 3,
  },
];

let ROOMS_JOINED: Room[] = [
  <Room>{
    name : 'Room 4',
    duration : 60,
    timespan : new Timespan(),
    anonymity : false,
    place : 'Seoul Nat. Univ. 301',
    urgent : true,
    createdTime : new Date(),
    id : 1,
    hashid : 'hash1',
    member_count: 4,
  },
  <Room>{
    name : 'Room 5',
    duration : 60,
    timespan : new Timespan(),
    anonymity : false,
    place : 'Seoul Nat. Univ. Student Building',
    urgent : true,
    createdTime : new Date(),
    id : 2,
    hashid : 'hash2',
    member_count: 5,
  },
  <Room>{
    name : 'Room 6',
    duration : 60,
    timespan : new Timespan(),
    anonymity : false,
    place : 'Shinlim Station',
    urgent : false,
    createdTime : new Date(),
    id : 3,
    hashid : 'hash3',
    member_count: 6,
  },
];

const TEST_USERS: User[] = [
  new User(1, 'alice', 'alice@snu.ac.kr', 'alice'),
  new User(2, 'bob', 'bob@snu.ac.kr', 'bob'),
  new User(3, 'chris', 'chris@snu.ac.kr', 'chris'),
];

const TEST_AVAILABLE_TIME: Timespan[] = [
  new Timespan(),
  new Timespan(),
  new Timespan()
];

const TEST_TIME_SPAN: Timespan = new Timespan(
  new Date('2017-11-10'),
  new Date('2017-11-15')
);

// Fake meet service implementation
@Injectable()
export class MeetServiceSpy {

  rooms: Room[] = [];

  constructor() {
    for (let room of ROOMS_CREATED) {
      room.owner = TEST_USERS[ 0 ];
    }
    for (let room of ROOMS_JOINED) {
      room.owner = TEST_USERS[ 0 ];
    }
  }


  getTimeSpan = jasmine.createSpy('getTimeSpan').and.returnValue(TEST_TIME_SPAN);

  getCurrentRoomId = jasmine.createSpy('getCurrentRoomId').and.returnValue(1);

  getRoomsCreatedByMe = jasmine.createSpy('getRoomsCreatedByMe').and.callFake(
    () => Promise.resolve(ROOMS_CREATED)
  );

  getRoomsJoinedByMe = jasmine.createSpy('getRoomsJoinedByMe').and.callFake(
    () => Promise.resolve(ROOMS_JOINED)
  );

  getRoomById = jasmine.createSpy('getRoomById').and.callFake((id: number) => {
    let room = ROOMS_CREATED
      .concat(ROOMS_JOINED)
      .filter(room => room.id === id)[ 0 ];
    return Promise.resolve(room);
  });

  getRoomByHash = jasmine.createSpy('getRoomByHash').and.callFake((hash: string) => {
    return Promise.resolve(ROOMS_CREATED[ 0 ]);
  });

  setCurrentRoom = jasmine.createSpy('setCurrentRoom');

  getCurrentRoom = jasmine.createSpy('getCurrentRoom').and.callFake((route: ActivatedRoute) => {
    return Observable.of(ROOMS_CREATED[0]);
  });

  getUsersInRoom = jasmine.createSpy('getUsersInRoom').and.callFake(
    (id: number) => Promise.resolve(TEST_USERS)
  );

  getAvailableTime = jasmine.createSpy('getAvailableTime').and.callFake(
    (roomId: number) => Promise.resolve(TEST_AVAILABLE_TIME)
  );

  addRoom = jasmine.createSpy('addRoom').and.callFake((room: Room) => {
    room.id = this.rooms.length;
    room.hashid = 'asdf';
    this.rooms.push(room);
    return Promise.resolve(room);
  });

  deleteRoom = jasmine.createSpy('deleteRoom').and.callFake((roomId: number) => {
    this.rooms = this.rooms.filter(room => room.id !== roomId);
    let response = new Response(new Blob(), { 'status' : 200, 'statusText' : 'Room deleted' });
    return Promise.resolve(response);
  });
}

import { Injectable } from '@angular/core';
import {Room} from "../models/room";
import {Timespan} from "../models/timespan";
import {User} from "../models/user";
import {Headers, Http, RequestOptionsArgs, Response} from "@angular/http";

import 'rxjs/add/operator/toPromise';
import {RoomResponseData} from "./room-response-data";

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

function handleError(error: any) {
  console.error('An error occured: ', error);
  return Promise.reject(error.message || error);
}

@Injectable()
export class MeetService {
  private headers = new Headers({ 'Content-Type' : 'application/json' });

  constructor(private http: Http) {
  }

  private toRoomCreateRequest(room: Room) : string {
    return JSON.stringify({
      name: room.name,
      place: room.place,
      min_time_required: room.duration,
    });
  }

  getRoomsCreatedByMe(): Promise<Room[]> {
    return this.http.get(`api/user/joined-rooms`)
      .toPromise()
      .then(res => res.json() as RoomResponseData[])
      .then(roomDataList => roomDataList.map(
        roomData => RoomResponseData.toRoom(roomData)
      ))
      .catch(handleError);
  }

  getRoomsJoinedByMe(): Promise<Room[]> {
    return this.http.get(`api/user/owned-rooms`)
      .toPromise()
      .then(res => res.json() as RoomResponseData[])
      .then(roomDataList => roomDataList.map(
        roomData => RoomResponseData.toRoom(roomData)
      ))
      .catch(handleError);
  }

  getRoomById(id: number): Promise<Room> {
    return this.http.get(`api/rooms/${id}`)
      .toPromise()
      .then(res => res.json() as RoomResponseData)
      .then(roomData => RoomResponseData.toRoom(roomData))
      .catch(handleError);
  }

  getUsersInRoom(id: number): Promise<User[]> {
    //TODO: Not working
    return this.http.get(`api/rooms/${id}/members`)
      .toPromise()
      .then(res => res.json() as User[])
      .catch(handleError);
  }

  getAvailableTime(roomId: number): Promise<Timespan[]> {
    // Not yet implemented
    // Need REST APIs related to free time
    return Promise.resolve(TEST_AVAILABLE_TIME);
  }

  addRoom(room: Room): Promise<Room> {
    return this.http.post(`api/rooms`, this.toRoomCreateRequest(room), <RequestOptionsArgs>{headers: this.headers})
      .toPromise()
      .then(res => res.json() as RoomResponseData)
      .then(roomData => RoomResponseData.toRoom(roomData))
      .catch(handleError);
  }

  deleteRoom(roomId: number): Promise<Response> {
    return this.http.delete(`api/rooms/${roomId}`)
      .toPromise()
      .catch(handleError);
  }
}

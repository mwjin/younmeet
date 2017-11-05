import { Injectable } from '@angular/core';
import {Room} from "../models/room";
import {Timespan} from "../models/timespan";
import {User} from "../models/user";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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
  console.error(error);
  return Observable.throw(error);
}

class RoomResponseData {
  id: number;
  name: string;
  place: string;
  best_start_time: Date;
  best_end_time: Date;
  min_time_required: number;
  user_ids: number[];
  created_time: Date;
  owner_id: number;

  toRoom(): Room {
    let room = new Room(this.name,
            this.min_time_required,
            new Timespan(this.best_start_time, this.best_end_time),
            false,
            this.place,
            true,
            this.id
          );
    return room;
  }

  static fromRoom(room: Room): RoomResponseData {
    return <RoomResponseData> {
      id: room.id,
      name: room.name,
      place: room.place,
      best_start_time: room.timespan.start,
      best_end_time: room.timespan.end,
      min_time_required: room.duration,
      user_ids: room.users.map(user => user.id),
      created_time: room.createdTime,
      owner_id: room.owner.id
    }
  }
}

@Injectable()
export class MeetService {
  constructor(private http: Http) {
  }

  getRoomsCreatedByMe(id: number): Promise<Room[]> {
    return this.http.get(`/api/user/rooms-created-by/${id}`)
      .map(res => res.json() as RoomResponseData[])
      .map(roomDataList => roomDataList.map(
        roomData => roomData.toRoom()
      ))
      .catch(handleError)
      .toPromise();
  }

  getRoomsJoinedByMe(id: number): Promise<Room[]> {
    return this.http.get(`/api/user/rooms-joined-by/${id}`)
      .map(res => res.json() as RoomResponseData[])
      .map(roomDataList => roomDataList.map(
        roomData => roomData.toRoom()
      ))
      .catch(handleError)
      .toPromise();
  }

  getRoomById(id: number): Promise<Room> {
    return this.http.get(`/api/rooms/${id}`)
      .map(res => res.json() as RoomResponseData)
      .map(roomData => roomData.toRoom())
      .catch(handleError)
      .toPromise();
  }

  getUsersInRoom(id: number): Promise<User[]> {
    return this.http.get(`/api/rooms/${id}/members`)
      .map(res => res.json() as User[])
      .catch(handleError)
      .toPromise();
  }

  getAvailableTime(roomId: number): Promise<Timespan[]> {
    // Not yet implemented
    // Need REST APIs related to free time
    return Promise.resolve(TEST_AVAILABLE_TIME);
  }

  addRoom(room: Room): Promise<Room> {
    return this.http.post(`/api/rooms`, RoomResponseData.fromRoom(room))
      .map(res => res.json() as RoomResponseData)
      .map(roomData => roomData.toRoom())
      .catch(handleError)
      .toPromise();
  }

  deleteRoom(room: Room): Promise<Response> {
    return this.http.delete(`/api/rooms/${room.id}`)
      .catch(handleError)
      .toPromise();
  }



}

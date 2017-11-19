import { Injectable } from '@angular/core';
import { Room } from '../models/room';
import { Timespan } from '../models/timespan';
import { User } from '../models/user';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { RoomResponseData } from './room-response-data';
import { getCSRFHeaders } from '../../util/headers';
import { UserInfo } from '../models/user-info';


function handleError(error: any) {
  console.error('An error occurred: ', error);
  return Promise.reject(error.message || error);
}

let TEST_AVAILABLE_TIME = [
  new Timespan(), new Timespan(), new Timespan()
];

@Injectable()
export class MeetService {
  private headers = new Headers({ 'Content-Type' : 'application/json' });
  public timespan: Timespan;

  constructor(private http: Http) {
  }

  private toRoomCreateRequest(room: Room): string {
    return JSON.stringify({
      name : room.name,
      place : room.place,
      min_time_required : room.duration,
    });
  }

  getRoomsCreatedByMe(): Promise<Room[]> {
    return this.http.get(`api/user/owned-rooms`)
      .toPromise()
      .then(res => res.json() as RoomResponseData[])
      .then(roomDataList => roomDataList.map(
        roomData => RoomResponseData.toRoom(roomData)
      ))
      .catch(handleError);
  }

  getRoomsJoinedByMe(): Promise<Room[]> {
    return this.http.get(`api/user/joined-rooms`)
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
      .then(res => {
        console.log(res);
        return res;
      })
      .then(res => res.json() as RoomResponseData)
      .then(roomData => {
        console.log(roomData);
        return roomData;
      })
      .then(roomData => {
        let room = RoomResponseData.toRoom(roomData);
        this.timespan = new Timespan(new Date(room.timespan.start), new Date(room.timespan.end));
        console.log(this.timespan);
        return room;
      })
      .catch(handleError);
  }

  getUsersInRoom(id: number): Promise<UserInfo[]> {
    return this.http.get(`api/rooms/${id}/members`)
      .toPromise()
      .then(res => res.json() as UserInfo[])
      .catch(handleError);
  }

  getAvailableTime(roomId: number): Promise<Timespan[]> {
    // Not yet implemented
    // Need REST APIs related to free time
    return Promise.resolve(TEST_AVAILABLE_TIME);
  }

  addRoom(room: Room): Promise<Room> {
    return this.http.post(`api/rooms`, this.toRoomCreateRequest(room), <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .then(res => res.json() as RoomResponseData)
      .then(roomData => RoomResponseData.toRoom(roomData))
      .catch(handleError);
  }

  deleteRoom(roomId: number): Promise<Response> {
    return this.http.delete(`api/rooms/${roomId}`, <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .catch(handleError);
  }
}

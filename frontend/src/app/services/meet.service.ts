import { Injectable } from '@angular/core';
import { Room } from '../models/room';
import { Timespan } from '../models/timespan';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { roomFormToCreateResponse, roomFromResponse, RoomResponse, roomToResponse } from './room-rest-interfaces';
import { getCSRFHeaders } from '../../util/headers';
import { UserInfo } from '../models/user-info';
import { CreateRoomForm } from '../create-room/create-room-form';

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

  constructor(private http: Http) {
  }

  getRoomsCreatedByMe(): Promise<Room[]> {
    return this.http.get(`api/user/owned-rooms`)
      .toPromise()
      .then(res => res.json() as RoomResponse[])
      .then(roomDataList => roomDataList.map(
        roomData => roomFromResponse(roomData)
      ))
      .catch(handleError);
  }

  getRoomsJoinedByMe(): Promise<Room[]> {
    return this.http.get(`api/user/joined-rooms`)
      .toPromise()
      .then(res => res.json() as RoomResponse[])
      .then(roomDataList => roomDataList.map(
        roomData => roomFromResponse(roomData)
      ))
      .catch(handleError);
  }

  getRoomById(id: number): Promise<Room> {
    return this.http.get(`api/rooms/${id}`)
      .toPromise()
      .then(res => res.json() as RoomResponse)
      .then(roomData => roomFromResponse(roomData))
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

  addRoom(roomForm: CreateRoomForm): Promise<Room> {
    return this.http.post(
        `api/rooms`,
        roomFormToCreateResponse(roomForm),
        <RequestOptionsArgs>{ headers : getCSRFHeaders() }
      )
      .toPromise()
      .then(res => res.json() as RoomResponse)
      .then(roomData => roomFromResponse(roomData))
      .catch(handleError);
  }

  deleteRoom(roomId: number): Promise<Response> {
    return this.http.delete(`api/rooms/${roomId}`, <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .catch(handleError);
  }
}

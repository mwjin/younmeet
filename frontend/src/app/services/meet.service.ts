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
import { TimespanResponseData } from './timespan-response-data';
import { BesttimeResponseData } from './besttime-response-data';


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
  public currentRoomId: number;

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

  handleRoomResponse(room: Promise<Response>): Promise<Room> {
    return room
      .then(res => res.json() as RoomResponse)
      .then(roomData => {
        let room = roomFromResponse(roomData);
        this.timespan = new Timespan(new Date(room.timespan.start), new Date(room.timespan.end));
        this.currentRoomId = room.id;
        return room;
      })
      .then(roomData => {
        console.log(roomData);
        return roomData;
      })
      .catch(handleError);

  }
  getRoomById(id: number): Promise<Room> {
    return this.handleRoomResponse(
      this.http.get(`api/rooms/${id}`).toPromise()
    );
  }

  getRoomByHash(hash: string): Promise<Room> {
    return this.handleRoomResponse((
      this.http.get(`api/rooms/hash/${hash}`).toPromise()
    ));
  }

  getTimeSpan(): Timespan {
    return this.timespan;
  }

  getCurrentRoomId(): number {
    return this.currentRoomId;
  }

  getUsersInRoom(id: number): Promise<UserInfo[]> {
    return this.http.get(`api/rooms/${id}/members`)
      .toPromise()
      .then(res => res.json() as UserInfo[])
      .catch(handleError);
  }

  getBestTime(id: number): Promise<BesttimeResponseData[]> {
    return this.http.get(`api/rooms/${id}/best-times`)
      .toPromise()
      .then(res => res.json() as BesttimeResponseData[])
      .catch(handleError);
  }

  getAvailableTime(id: number): Promise<TimespanResponseData[]> {
    return this.http.get(`api/rooms/${id}/best-times`)
      .toPromise()
      .then(res => res.json() as TimespanResponseData[])
      .catch(handleError);
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

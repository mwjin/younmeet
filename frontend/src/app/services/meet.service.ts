import { Injectable } from '@angular/core';
import { Room } from '../models/room';
import { Timespan } from '../models/timespan';
import { Headers, Http, RequestOptionsArgs, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';

import { roomFormToCreateResponse, roomFromResponse, RoomResponse, roomToResponse } from './room-rest-interfaces';
import { UserInfo } from '../models/user-info';
import { CreateRoomForm } from '../create-room/create-room-form';
import { TimespanResponseData } from './timespan-response-data';
import { BesttimeResponseData } from './besttime-response-data';
import {getCSRFHeaders} from "../../util/headers";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


const headers = new Headers({'csrftoken': 'X-CSRFToken'});

function handleError(error: any) {
  console.error('An error occurred: ', error);
  return Promise.reject(error.message || error);
}

let TEST_AVAILABLE_TIME = [
  new Timespan(), new Timespan(), new Timespan()
];

@Injectable()
export class MeetService {
  timespan: Timespan;
  currentRoom: Room | null = null;
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
      .then(roomData => roomFromResponse(roomData))
      .catch(handleError);
  }

  getRoomById(id: number, setToCurrent: boolean = false): Promise<Room> {
    return this.handleRoomResponse(
      this.http.get(`api/rooms/${id}`).toPromise()
    ).then(room => {
      if (setToCurrent) this.setCurrentRoom(room);
      return room;
    });
  }

  getRoomByHash(hash: string, setToCurrent: boolean = false): Promise<Room> {
    return this.handleRoomResponse((
      this.http.get(`api/rooms/hash/${hash}`).toPromise()
    ))
      .then(room => {
      if (setToCurrent) this.setCurrentRoom(room);
      return room;
    });
  }

  setCurrentRoom(room: Room) {
    this.currentRoom = room;
  }

  getCurrentRoom(route: ActivatedRoute): Observable<Room> {
    if (this.currentRoom === null) {
      return route.params
        .map(params => params['hash'])
        .flatMap(hash => this.getRoomByHash(hash, true));
    }
    else {
      return Observable.of(this.currentRoom);
    }
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
      { headers: getCSRFHeaders() }
    )
      .toPromise()
      .then(res => res.json() as RoomResponse)
      .then(roomData => roomFromResponse(roomData))
      .catch(handleError);
  }

  putPlace(room_id: number, place: string, latitude: number, longitude: number): Promise<boolean> {
    return this.http.put(
      `api/rooms/${room_id}/place`,
      {'place': place, 'latitude': latitude, 'longitude': longitude},
      { headers : getCSRFHeaders() }
    )
      .toPromise()
      .then(response => response.status === 200)
      .catch(handleError);
  }

  deleteRoom(roomId: number): Promise<Response> {
    return this.http.delete(
      `api/rooms/${roomId}`,
      { headers : getCSRFHeaders() }
    )
      .toPromise()
      .catch(handleError);
  }
}

import {TestBed, inject, async} from '@angular/core/testing';

import { MeetService } from './meet.service';
import {Http, HttpModule, ResponseOptions, XHRBackend, Response} from "@angular/http";
import {MockBackend} from "@angular/http/testing";
import {Room} from "../models/room";
import {Timespan} from "../models/timespan";
import {User} from "../models/user";
import {RoomResponse} from "./room-rest-interfaces";
import {FormsModule} from "@angular/forms";

let TEST_USERS: User[] = [
  new User(1, 'alice', 'alice@snu.ac.kr', 'alice'),
  new User(2, 'bob', 'bob@snu.ac.kr', 'bob'),
  new User(3, 'chris', 'chris@snu.ac.kr', 'chris'),
];

describe('MeetService', () => {
  let meetService: MeetService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        MeetService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  beforeEach(inject([XHRBackend, Http], (mb: MockBackend, http: Http) => {
    mockBackend = mb;
    meetService = new MeetService(http);
  }));

  it('should be initialized properly', () => {
    expect(meetService).toBeTruthy();
  });
  it('mock backend should be initialized properly', () => {
    expect(mockBackend).toBeTruthy();
  });

  function expectUrl(backend: MockBackend, url: string, response: any, status: number = 200) {
    const mockResponse = new ResponseOptions({status: status, body: response});
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe(url);
      c.mockRespond(new Response(mockResponse));
    });
  }

  describe('getRoomsCreatedByMe', () => {
    it('gets rooms created by me', async(() => {
      let mockResponse = <RoomResponse[]> [
        { name: 'Room 1'},
        { name: 'Room 2'},
        { name: 'Room 3'}
      ];
      expectUrl(mockBackend, 'api/user/owned-rooms', mockResponse);
      meetService.getRoomsCreatedByMe().then(res => {
        let resSorted = res.sort((r1, r2) => r1.id - r2.id);
        expect(resSorted.length).toBe(3);
        expect(resSorted[0].name).toBe("Room 1");
        expect(resSorted[1].name).toBe("Room 2");
        expect(resSorted[2].name).toBe("Room 3");
      });
    }));
  });

  describe('getRoomsJoinedByMe', () => {
    it('gets rooms joined by me', async(() => {
      let mockResponse = <RoomResponse[]> [
        { name: 'Room 1'},
        { name: 'Room 2'},
        { name: 'Room 3'}
      ];
      expectUrl(mockBackend, 'api/user/joined-rooms', mockResponse);
      meetService.getRoomsJoinedByMe().then(res => {
        let resSorted = res.sort((r1, r2) => r1.id - r2.id);
        expect(resSorted.length).toBe(3);
        expect(resSorted[0].name).toBe("Room 1");
        expect(resSorted[1].name).toBe("Room 2");
        expect(resSorted[2].name).toBe("Room 3");
      });
    }));
  });

  describe('getRoomById', () => {
    it('gets the room by id', async(() => {
      let mockResponse = <RoomResponse> { name: "Room", id: 42 };
      expectUrl(mockBackend, 'api/rooms/42', mockResponse);
      meetService.getRoomById(42).then(res => {
        expect(res.name).toBe("Room");
        expect(res.id).toBe(42);
      });
    }));
  });

  describe('getUsersInRoom', () => {
    it('gets all the users in specified room', async(() => {
      let mockResponse = TEST_USERS.slice(0);
      expectUrl(mockBackend, 'api/rooms/42/members', mockResponse);
      meetService.getUsersInRoom(42).then(res => {
        expect(res.length).toBe(3);
        expect(res[0].username).toBe('alice');
        expect(res[1].username).toBe('bob');
        expect(res[2].username).toBe('chris');
      });
    }));
  });

  describe('getAvailableTime', () => {
    it('gets the best (top 3) available time for this room', () => {
    });
  });

  describe('addRoom', () => {
    it('creates a new room', async(() => {
      let mockResponse = <RoomResponse> { name: "Room to submit", id: 42 };
      expectUrl(mockBackend, 'api/rooms', mockResponse);
      let room = new Room("Room to submit");
      room.id = 42;
      meetService.addRoom(room).then(res => {
        console.log(res);
        expect(res.name).toBe("Room to submit");
        expect(res.id).toBe(42);
      });
    }));
  });

  describe('deleteRoom', () => {
    it('deletes the room by id', async(() => {
      let mockResponse = {ok: true};
      expectUrl(mockBackend, 'api/rooms/42', mockResponse);
      meetService.deleteRoom(42).then(res => {
        expect(res.status).toBe(200);
        expect(res.ok).toBe(true);
      });
    }));
  });

});

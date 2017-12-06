import { TestBed, inject, async } from '@angular/core/testing';

import { FreetimeService } from './freetime.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, HttpModule, ResponseOptions, XHRBackend, Response } from '@angular/http';
import { Freetime } from '../models/freetime';
import { FreetimeResponseData } from './freetime-response-data';
import {getCSRFHeaders} from "../../util/headers";
import {mockCSRFHeaders} from "../../util/mockHeaders";

const mockFreeTimeResponseData: FreetimeResponseData[] = [
  {
    id : 1,
    start_time : '2017-11-10T00:50:00Z',
    end_time : '2017-11-10T01:50:00Z',
    room_id : 1,
    user_id : 2
  },
  {
    id : 2,
    start_time : '2017-11-11T00:30:00Z',
    end_time : '2017-11-11T01:50:00Z',
    room_id : 1,
    user_id : 2
  },
  {
    id : 3,
    start_time : '2017-11-12T00:20:00Z',
    end_time : '2017-11-12T02:50:00Z',
    room_id : 1,
    user_id : 3
  },
  {
    id : 4,
    start_time : '2017-11-13T03:50:00Z',
    end_time : '2017-11-13T04:50:00Z',
    room_id : 1,
    user_id : 4
  },
];

const mockNewFreeTimes: Freetime[] = [
  new Freetime(new Date('2017-11-10T00:50:00Z'), new Date('2017-11-10T01:50:00Z')),
  new Freetime(new Date('2017-11-11T00:30:00Z'), new Date('2017-11-11T01:50:00Z')),
  new Freetime(new Date('2017-11-12T00:20:00Z'), new Date('2017-11-12T02:50:00Z')),
  new Freetime(new Date('2017-11-13T03:50:00Z'), new Date('2017-11-13T04:50:00Z')),
];

describe('FreetimeService', () => {
  let freetimeService: FreetimeService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [ HttpModule ],
      providers : [
        FreetimeService,
        { provide : XHRBackend, useClass : MockBackend }
        // { provide : getCSRFHeaders, useClass: mockCSRFHeaders}
      ]
    });
  });

  beforeEach(inject([ XHRBackend, Http ], (mb: MockBackend, http: Http) => {
    mockBackend = mb;
    freetimeService = new FreetimeService(http);
  }));

  it('should be initialized properly', () => {
    expect(freetimeService).toBeTruthy();
  });
  it('mock backend should be initialized properly', () => {
    expect(mockBackend).toBeTruthy();
  });

  function expectUrl(backend: MockBackend, url: string, response: any, status: number = 200) {
    const mockResponse = new ResponseOptions({ status : status, body : response });
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe(url);
      c.mockRespond(new Response(mockResponse));
    });
  }

  describe('when get Free times', () => {
    let fakeTimes: FreetimeResponseData[];
    let response: Response;
    beforeEach(() => {
      fakeTimes = mockFreeTimeResponseData;
    });

    it('could get previous free times', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakeTimes }));
      mockBackend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      freetimeService.getFreeTimes(1)
        .then(responseData => {
          expect(responseData.length).toBe(4);
        });
    })));

    it('could not get previous free time with non existing id', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 403 }));
      mockBackend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      freetimeService.getFreeTimes(4)
        .then(freeTimeResponseData => {
          expect(freeTimeResponseData).toBeNull();
        });
    })));
  });

  describe('when post new free times', () => {
    let newFakeTimes: Freetime[];
    let response: Response;

    beforeEach(() => {
      newFakeTimes = mockNewFreeTimes;
    });

    it('could post new free times', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 201, body : newFakeTimes }));
      mockBackend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      freetimeService.postFreeTimes(newFakeTimes, 1)
        .then(result => expect(result).toBeTruthy());
    })));
  });
});

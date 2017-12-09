import {TestBed, inject, async} from '@angular/core/testing';

import { DaumApiService } from './daum-api.service';
import {PlaceResponse, responseToPlace} from "./daum-rest-interfaces";
import {Place} from "../models/place";
import {Http, HttpModule, ResponseOptions, XHRBackend, Response} from "@angular/http";
import {MockBackend, MockConnection} from "@angular/http/testing";

// TODO: Finish TEST!

const mockPlaceResponseData: PlaceResponse[] = [
  {
    address_name : 'address0',
    category_group_code : 'CE7',
    category_group_name : 'Cafe',
    category_name : '음식점 > 카페 > 커피전문점 > 스타벅스',
    distance : '100',
    id: '0',
    phone : '02-880-0000',
    place_name : '스타벅스',
    place_url : 'www.cafe0.com',
    road_address_name : 'road address 0',
    x : '10.000000',
    y : '10.000000',
  },
  {
    address_name : 'address1',
    category_group_code : 'CE7',
    category_group_name : 'Cafe',
    category_name : '음식점 > 카페 > 커피전문점',
    distance : '200',
    id: '1',
    phone : '02-880-0001',
    place_name : '리버벨',
    place_url : 'www.cafe1.com',
    road_address_name : 'road address 1',
    x : '10.000001',
    y : '10.000001',
  },
  {
    address_name : 'address2',
    category_group_code : 'CE7',
    category_group_name : 'Cafe',
    category_name : '음식점 > 카페',
    distance : '300',
    id: '2',
    phone : '02-880-0002',
    place_name : '라라피포',
    place_url : 'www.cafe2.com',
    road_address_name : 'road address 2',
    x : '10.000002',
    y : '10.000002',
  },
  {
    address_name : 'address3',
    category_group_code : 'CE7',
    category_group_name : 'Cafe',
    category_name : '음식점 > 카페 > 테마카페 > 베이커리카페',
    distance : '400',
    id: '3',
    phone : '02-880-0003',
    place_name : '아띠',
    place_url : 'www.cafe3.com',
    road_address_name : 'road address 3',
    x : '10.000003',
    y : '10.000003',
  },
];

describe('DaumApiService', () => {
  let daumAPIService: DaumApiService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [ HttpModule ],
      providers: [
        DaumApiService,
        { provide : XHRBackend, useClass: MockBackend }
      ]
    });
  });

  it('should be created', inject([DaumApiService], (service: DaumApiService) => {
    expect(service).toBeTruthy();
  }));

  beforeEach(inject([ XHRBackend, Http ], (mb: MockBackend, http: Http) => {
    mockBackend = mb;
    daumAPIService = new DaumApiService(http);
  }));


  describe('when get near recommended places', () => {
    let fakePlaces: any;
    let response: Response;
    beforeEach(() => {
      fakePlaces = {'documents': mockPlaceResponseData};
    });

    it('should get near restaurants', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakePlaces }));
      mockBackend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      daumAPIService.getNearRestaurants(10, 10)
        .then(responseData => {
          expect(responseData.length).toBe(4);
        });
    })));

    it('should get near cafes', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakePlaces }));
      mockBackend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      daumAPIService.getNearCafes(10, 10)
        .then(responseData => {
          expect(responseData.length).toBe(4);
        });
    })));

    it('should get near cultural faculties', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakePlaces }));
      mockBackend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      daumAPIService.getNearCulturalFaculties(10, 10)
        .then(responseData => {
          expect(responseData.length).toBe(4);
        });
    })));
  });

  describe('when get queries', () => {
    let fakePlaces: any;
    let response: Response;

    // query responses don't have distance as response
    mockPlaceResponseData.forEach(res => delete res.distance);
    beforeEach(() => {
      fakePlaces = {'documents': mockPlaceResponseData};
    });

    it('should get queries', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakePlaces }));
      mockBackend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      daumAPIService.getQueryPlaces('서울대입구역')
        .then(responseData => {
          expect(responseData.length).toBe(4);
        });
    })));
  });


});

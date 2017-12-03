import { TestBed, inject } from '@angular/core/testing';

import { DaumApiService } from './daum-api.service';
import {PlaceResponse, responseToPlace} from "./daum-rest-interfaces";
import {Place} from "../models/place";
import {Http, HttpModule, XHRBackend} from "@angular/http";
import {MockBackend} from "@angular/http/testing";

// TODO: TEST!

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
  let daumAPIService : DaumApiService;
  let mockBackend : MockBackend;

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

});

import { Injectable } from '@angular/core';
import {Place} from "../models/place";

const fakeNearRestaraunts: Place[] = [
  new Place('하나야', '음식점 > 일식', '10.00000', '10.00000', 'www.google0.com'),
  new Place('텐동요츠야', '음식점 > 일식', '10.000001', '10.000001', 'www.google1.com'),
  new Place('옷살', '음식점 > 아시아음식 > 인도음식', '10.000002', '10.000002', 'www.google2.com'),
  new Place('성민양꼬치', '음식점 > 중식 > 양꼬치', '10.000003', '10.000003', 'www.google3.com'),
];

const fakeNearCafes: Place[] = [
  new Place('스타벅스', '음식점 > 카페 > 커피전문점 > 스타벅스', '10.000000', '10.000000', 'www.cafe0.com'),
  new Place('리버벨', '음식점 > 카페 > 커피전문점', '10.00001', '10.00001', 'www.cafe1.com'),
  new Place('라라피포', '음식점 > 카페', '10.000002', '10.000002', 'www.cafe2.com'),
  new Place('아띠', '음식점 > 카페 > 테마카페 > 베이커리카페', '10.000003', '10.000003', 'www.cafe3.com'),
];

const fakeNearCulturalFaculties: Place[] = [
  new Place('롯데시네마 서울대입구점', '문화,예술 > 영화,영상 > 영화관 > 롯데시네마', '10.000000', '10.000000', 'www.lottecinema.com'),
];

@Injectable()
export class DaumApiServiceSpy {
  getNearRestaurants = jasmine.createSpy('getNearRestaurants').and.callFake(
    () => Promise.resolve(fakeNearRestaraunts));
  getNearCafes = jasmine.createSpy('getNearCafes').and.callFake(
    () => Promise.resolve(fakeNearCafes));
  getNearCurturalFaculties = jasmine.createSpy('getNearCulturalFaculties').and.callFake(
    () => Promise.resolve(fakeNearCulturalFaculties));
}

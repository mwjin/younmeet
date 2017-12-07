import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';
import {responseToPlace} from "./daum-rest-interfaces";
import {Place} from "../models/place";


function handleError(error: any) {
  console.error('Error occured', error);
  return Promise.reject(error.message || error);
}


@Injectable()
export class DaumApiService {
  private API_KEY = '7580e2a44a5e572cbd87ee388f620122';
  // headers cannot have CSRF tokens
  private headers = new Headers({'Authorization': 'KakaoAK ' + this.API_KEY});
  private min_dist = 500;

  constructor(private http: Http) {
  }

  //
  getNearRestaurants(lat: number, long: number): Promise<Place[]> {
    const min_dist = 500;
    const url = `https://dapi.kakao.com/v2/local/search/category.json?query="맛집"&category_group_code=FD6
      &y=${lat}&x=${long}`;
    return this.getPlaces(url);
  }

  getNearCafes(lat: number, long: number): Promise<Place[]> {
    const url = `https://dapi.kakao.com/v2/local/search/category.json?query="카페"&category_group_code=CE7
      &y=${lat}&x=${long}`;
    return this.getPlaces(url);
  }

  getNearCulturalFaculties(lat: number, long: number): Promise<Place[]> {
    const url = `https://dapi.kakao.com/v2/local/search/category.json?query=""&category_group_code=CT1
      &y=${lat}&x=${long}`;
    return this.getPlaces(url);
  }

  getQueryPlaces(query: string): Promise<Place[]> {
    const size = 5;
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=${size}&sort=accuracy`;
    return this.getPlaces(url);
  }


  getPlaces(url: string): Promise<Place[]> {
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(res => {
        const data_list = res.json()['documents'];
        const result = [];
        data_list.forEach(res => {
          const dist: number = +res['distance'];
          if (dist < this.min_dist)
            result.push(responseToPlace(res));
        });
        return result;
      })
      .catch(handleError);
  }

}

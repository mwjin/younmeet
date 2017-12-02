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


  getPlaces(url: string): Promise<Place[]> {
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(res => {
        let data_list = res.json()['documents'];
        let result = [];
        data_list.forEach(res => {
          let dist: number = +res['distance'];
          if (dist < this.min_dist)
            result.push(responseToPlace(res));
        });
        console.log(result);
        return result;
      })
      .catch(handleError);
  }




  /*
  getFreeTimes(id: number): Promise<FreetimeResponseData[]> {
    return this.http.get(`api/rooms/${id}/free-times`)
      .toPromise()
      .then(response => {
        console.log(response.json());
        return response.json() as FreetimeResponseData[];
      })
      .catch(handleError);
  }

  	create(articleId: number, authorId: number, content: string): Promise<Comment> {
		return this.http
			.post(this.commentsUrl,
				JSON.stringify({article_id: articleId, author_id: authorId,
					content: content}),
				{headers: this.headers})
			.toPromise()
			.then (res => res.json().data as Comment)
	}


  postFreeTimes(freetimes: Freetime[], id: number): Promise<boolean> {
    return this.http.post(`api/rooms/${id}/free-times`,
      JSON.stringify(freetimes))
      .toPromise()
      .then(response => response.status === 201)
      .catch(handleError);
  }
  */

}

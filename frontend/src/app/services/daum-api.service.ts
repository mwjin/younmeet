import { Injectable } from '@angular/core';
import {Headers, Http} from "@angular/http";
import 'rxjs/add/operator/toPromise';


function handleError(error: any) {
  console.error('Error occured', error);
  return Promise.reject(error.message || error);
}


@Injectable()
export class DaumApiService {
  private API_KEY = '7580e2a44a5e572cbd87ee388f620122';
  private headers = new Headers({'Authorization': 'KakaoAK ' + this.API_KEY});
  //private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getNearRestaurants(lat: number, long: number): void {
      const url = `https://dapi.kakao.com/v2/local/search/category.json?query="맛집"&category_group_code=FD6
      &y=${lat}&x=${long}`;
      this.http.get(url, {headers: this.headers})
        .toPromise()
        .then(res => {
          let data = res.json()['documents'];
          console.log(data);
          
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

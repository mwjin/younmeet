import { Injectable } from '@angular/core';
import { Freetime } from '../models/freetime';
import 'rxjs/add/operator/toPromise';
import { getCSRFHeaders } from '../../util/headers';
import { Http } from '@angular/http';
import { FreetimeResponseData } from './freetime-response-data';

function handleError(error: any) {
  console.error('Error occured', error);
  return Promise.reject(error.message || error);
}

@Injectable()
export class FreetimeService {
  constructor(private http: Http) {}

  getFreeTimes(id: number): Promise<FreetimeResponseData[]> {
    return this.http.get(`api/rooms/${id}/free-times`)
      .toPromise()
      .then(response => {
        console.log(response.json());
        return response.json() as FreetimeResponseData[];
      })
      .catch(handleError);
  }


  postFreeTimes(freetimes: Freetime[], id: number): Promise<boolean> {
    return this.http.post(
      `api/rooms/${id}/free-times`,
      JSON.stringify(freetimes),
      { headers : getCSRFHeaders() }
      )
      .toPromise()
      .then(response => response.status === 201)
      .catch(handleError);
  }
}

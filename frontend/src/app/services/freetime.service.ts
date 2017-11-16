import { Injectable } from '@angular/core';
import { Freetime } from '../models/freetime';
import 'rxjs/add/operator/toPromise';
import { getCSRFHeaders } from '../../util/headers';
import { Http, RequestOptionsArgs } from '@angular/http';
import { FreetimeResponseData } from './freetime-response-data';

function handleError(error: any) {
  console.error('Error occured', error);
  return Promise.reject(error.message || error);
}

@Injectable()
export class FreetimeService {
  /* TODO:
       Specify url
     */
  private url = 'api/room/:id/free-times';

  constructor(private http: Http) {}


  getFreeTimes(): Promise<Freetime[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as FreetimeResponseData[])
      .then(freetimeList => freetimeList.map(
        freetimeData => FreetimeResponseData.responseToFreetime(freetimeData)
      ))
      .catch(handleError);
  }

  postFreeTimes(freetimes: Freetime[]): Promise<boolean> {
    return this.http.post(this.url,
      JSON.stringify(freetimes), <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .then(response => response.status === 201)
      .catch(handleError);
  }
}

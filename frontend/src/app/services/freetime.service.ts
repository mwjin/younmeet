import { Injectable } from '@angular/core';
import { Freetime } from '../models/freetime';
import 'rxjs/add/operator/toPromise';
import { getCSRFHeaders } from '../../util/headers';
import { Http } from '@angular/http';

function handleError(error: any) {
  console.error('Error occured', error);
  return Promise.reject(error.message || error);
}

@Injectable()
export class FreetimeService {
  /* TODO:
       Specify url
     */
  private url = 'api/room/:roomid/:userid/time';

  constructor(private http: Http) {}

  getFreeTimes(): Promise<Freetime[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as Freetime[])
      .catch(handleError);
  }

}

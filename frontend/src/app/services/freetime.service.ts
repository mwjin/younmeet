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
  constructor(private http: Http) {}

  /*
  getFreeTimes(id: number): Promise<Freetime[]> {
    console.log('function call');
    return this.http.get(`api/rooms/${id}/free-times`)
      .toPromise()
      .then(response => {
        let freeTimesList: Freetime[] = [];
        let freeTimeJsonData = response.json() as FreetimeResponseData;
        console.log('json data' + freeTimeJsonData);
        for (let index in freeTimeJsonData) {
          console.log('index data = ' + freeTimeJsonData[ index ]);
          freeTimesList.push(new Freetime(freeTimeJsonData[ index ][ 'start' ], freeTimeJsonData[ index ][ 'end' ]));
        }
        return freeTimesList;
      })
      .catch(handleError);

  }
  */


  getFreeTimes(id: number): Promise<Freetime[]> {
    return this.http.get(`api/rooms/${id}/free-times`)
      .toPromise()
      .then(response => response.json() as FreetimeResponseData[])
      .then(freetimeList => {
        console.log(freetimeList.map(freetimeData => FreetimeResponseData.responseToFreetime(freetimeData)));
        return freetimeList.map(freetimeData => FreetimeResponseData.responseToFreetime(freetimeData));
      })
      .then(freetimes => {
        console.log(freetimes);
        return freetimes;
      })
      /*
      console.log(stringfiedFreeTimes);
      for (let index in stringfiedFreeTimes) {
        console.log((stringfiedFreeTimes[ index ][ 'start' ].toJSON()));
        console.log(new Date('2017-11-22T00:30:00.000Z'));
        console.log(new Date(stringfiedFreeTimes[ index ][ 'start' ].toJSON()));
        console.log(new Date(stringfiedFreeTimes[ index ][ 'end' ].toJSON()));
        console.log(new Freetime(new Date(stringfiedFreeTimes[ index ][ 'start' ].toJSON()),
          new Date(stringfiedFreeTimes[ index ][ 'end' ].toJSON())));
        let freetime: Freetime = new Freetime(new Date(stringfiedFreeTimes[ index ][ 'start' ].toJSON()),
          new Date(stringfiedFreeTimes[ index ][ 'end' ].toJSON()));
        freeTimeResult.push(freetime);
        console.log(freetime);
      }
      console.log(freeTimeResult);
      return stringfiedFreeTimes;
    })
    .then(freeTimes => {
      console.log(freeTimes);
      return freeTimes;
    })*/
      .catch(handleError);
  }


  postFreeTimes(freetimes: Freetime[], id: number): Promise<boolean> {
    return this.http.post(`api/rooms/${id}/free-times`,
      JSON.stringify(freetimes), <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .then(response => response.status === 201)
      .catch(handleError);
  }
}

import { Freetime } from '../models/freetime';
import { Injectable } from '@angular/core';

let fakePreviousFreetimes: Freetime[] = [
  new Freetime(new Date('2017-11-10T00:50:00Z'), new Date('2017-11-10T01:50:00Z')),
  new Freetime(new Date('2017-11-11T00:30:00Z'), new Date('2017-11-11T01:50:00Z')),
  new Freetime(new Date('2017-11-12T00:20:00Z'), new Date('2017-11-12T02:50:00Z')),
  new Freetime(new Date('2017-11-13T03:50:00Z'), new Date('2017-11-13T04:50:00Z')),
];

@Injectable()
export class FreetimeServiceSpy {
  getFreeTimes = jasmine.createSpy('previousFreeTimes').and.callFake(
    () => Promise.resolve(fakePreviousFreetimes));
}

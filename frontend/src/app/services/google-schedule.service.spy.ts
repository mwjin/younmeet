import { Injectable } from '@angular/core';
import { Schedule } from '../models/schedule';

const fakeSchedules: Schedule[] = [
  new Schedule('SWPP Last Lecture', new Date('2017-12-12T11:00:00Z'), new Date('2017-12-12T11:50:00Z')),
  new Schedule('SWPP Final Exam', new Date('2017-12-13T18:30:00Z'), new Date('2017-12-13T20:30:00Z')),
  new Schedule('SWPP Post Session', new Date('2017-12-19T11:00:00Z'), new Date('2017-12-19T13:00:00Z')),
];

@Injectable()
export class GoogleScheduleServiceSpy {

  getSchedules = jasmine.createSpy('schedules').and.callFake(
    () => Promise.resolve(fakeSchedules));

  signInGoogle = jasmine.createSpy('signInGoogle').and.callFake(() => {
    return Promise.resolve(true);
  });

  signOutGoogle = jasmine.createSpy('signOutGoogle').and.callFake(() => {
    return Promise.resolve(true);
  });
}

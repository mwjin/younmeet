import { TestBed, inject } from '@angular/core/testing';

import { GoogleScheduleService } from './google-schedule.service';

describe('ScheduleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleScheduleService]
    });
  });

  it('should be created', inject([GoogleScheduleService], (service: GoogleScheduleService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { BesttimeService } from './besttime.service';

describe('BesttimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BesttimeService]
    });
  });

  it('should be created', inject([BesttimeService], (service: BesttimeService) => {
    expect(service).toBeTruthy();
  }));
});

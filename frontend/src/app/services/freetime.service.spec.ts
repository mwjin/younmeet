import { TestBed, inject } from '@angular/core/testing';

import { FreetimeService } from './freetime.service';

describe('FreetimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FreetimeService]
    });
  });

  it('should be created', inject([FreetimeService], (service: FreetimeService) => {
    expect(service).toBeTruthy();
  }));
});

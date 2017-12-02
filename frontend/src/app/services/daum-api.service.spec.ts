import { TestBed, inject } from '@angular/core/testing';

import { DaumApiService } from './daum-api.service';

describe('DaumApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DaumApiService]
    });
  });

  it('should be created', inject([DaumApiService], (service: DaumApiService) => {
    expect(service).toBeTruthy();
  }));
});

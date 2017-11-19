import { TestBed, inject } from '@angular/core/testing';

import { FreetimeService } from './freetime.service';
import { HttpModule } from '@angular/http';

describe('FreetimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [FreetimeService]
    });
  });

  it('should be created', inject([FreetimeService], (service: FreetimeService) => {
    expect(service).toBeTruthy();
  }));
});

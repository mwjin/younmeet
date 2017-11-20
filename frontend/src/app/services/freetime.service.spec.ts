import { TestBed, inject } from '@angular/core/testing';

import { FreetimeService } from './freetime.service';
import { MockBackend } from '@angular/http/testing';
import { MeetService } from './meet.service';
import { Http, HttpModule, ResponseOptions, XHRBackend } from '@angular/http';

describe('FreetimeService', () => {
  let freetimeService: FreetimeService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        MeetService,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    });
  });

  beforeEach(inject([XHRBackend, Http], (mb: MockBackend, http: Http) => {
    mockBackend = mb;
    freetimeService = new FreetimeService(http);
  }));

  it('should be initialized properly', () => {
    expect(freetimeService).toBeTruthy();
  });
  it('mock backend should be initialized properly', () => {
    expect(mockBackend).toBeTruthy();
  });

  function expectUrl(backend: MockBackend, url: string, response: any, status: number = 200) {
    const mockResponse = new ResponseOptions({ status : status, body : response });
    backend.connections.subscribe(c => {
      expect(c.request.url).toBe(url);
      c.mockRespond(new Response(mockResponse));
    });
  }
});

import { TestBed, inject, async } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { AuthenticationService } from './authentication.service';
import { User } from '../models/user';

const makeMockUserDB = () => [
  {
    id : 1,
    username : 'user1',
    email : 'swpp2017@gmail.com',
    password : 'iluvswpp'
  },
  {
    id : 2,
    username : 'user2',
    email : 'swpp2016@naver.com',
    password : 'ihateswpp'
  }
] as User[];


describe('AuthenticationService', () => {
  beforeEach(() => {
    const local = {};


    spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
      return local[ key ] || null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
      return local[ key ] = <string> value;
    });

    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete local[ key ];
    });

    TestBed.configureTestingModule({
      imports : [ HttpModule ],
      providers : [ AuthenticationService,
        { provide : XHRBackend, useClass : MockBackend } ]
    });
  });

  it('can make object with "new"', inject([ Http ], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new AuthenticationService(http);
    expect(service instanceof AuthenticationService).toBe(true);
  }));

  it('local storage currentUser should be empty before sign in', inject([ Http ], (http: Http) => {
    expect(localStorage.getItem[ 'currentUser' ]).toBeNull();
  }));

  /*
  describe('When signin', () => {
    let backend: MockBackend;
    let service: AuthenticationService;

    let fakeUsers: User[];
    let response: Response;

    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthenticationService(http);

      fakeUsers = makeMockUserDB();

    }));
  });
  */
});

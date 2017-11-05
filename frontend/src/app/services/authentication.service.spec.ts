import { TestBed, inject, async } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

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
  beforeEach(async(() => {
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
    }).compileComponents();
  }));

  it('currentUser should be null before signin', () => {
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('can make object with "new"', inject([ Http ], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new AuthenticationService(http);
    expect(service instanceof AuthenticationService).toBe(true);
  }));


  describe('When signin', () => {
    let backend: MockBackend;
    let service: AuthenticationService;

    let fakeUsers: User[];

    let response: Response;

    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthenticationService(http);
      fakeUsers = makeMockUserDB();
      response = new Response(new ResponseOptions({ status : 200, body : fakeUsers[ 0 ] }));

    }));

    it('could sign in with username', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.logIn('user1', 'iluvswpp')
        .then(result => {
          console.log(localStorage.getItem('currentUser'));
          console.log(result);
          expect(result).toBe(true);
          expect(localStorage.getItem('currentUser')).not.toBeNull();
        });
    })));

    it('could sign in with email', async(inject([], () => {
      service.logIn('swpp2017@gmail.com', 'iluvswpp')
        .then(result => {
          console.log(localStorage.getItem('currentUser'));
          expect(result).toBe(true);
          expect(localStorage.getItem('currentUser')).not.toBeNull();
        });
    })));
  });

  describe('When failed to signin', () => {
    let backend: MockBackend;
    let service: AuthenticationService;

    let fakeUsers: User[];

    let response: Response;

    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthenticationService(http);
      fakeUsers = makeMockUserDB();
      response = new Response(new ResponseOptions({ status : 403 }));

    }));


    it('could not sign in with unregistered username', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.logIn('nouser', 'iluvswpp')
        .then(result => {
          console.log(localStorage.getItem('currentUser'));
          expect(result).toBe(false);
          expect(localStorage.getItem('currentUser')).toBeNull();
        });
    })));

    it('could not sign in with unregistered username', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.logIn('nono@gmail.com', 'iluvswpp')
        .then(result => {
          console.log(localStorage.getItem('currentUser'));
          expect(result).toBe(false);
          expect(localStorage.getItem('currentUser')).toBeNull();
        });
    })));
  });
  describe('When signout', () => {
    let backend: MockBackend;
    let service: AuthenticationService;

    let fakeUsers: User[];
    let response: Response;

    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthenticationService(http);
      fakeUsers = makeMockUserDB();

    }));
    it('could log out when current user exists', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200 }));
      localStorage.setItem('currentUser', JSON.stringify(fakeUsers[ 0 ]));
      console.log(localStorage.getItem('currentUser'));
      expect(localStorage.getItem('currentUser')).not.toBeNull();
      service.logOut()
        .then((result) => {
          console.log(localStorage.getItem('currentUser'));
          expect(result).toBe(true);
          expect(localStorage.getItem('currentUser')).toBeNull();
        });
    })));
    it('could not log out when current user does not exist', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 403 }));
      console.log(localStorage.getItem('currentUser'));
      expect(localStorage.getItem('currentUser')).toBeNull();
      service.logOut()
        .then((result) => {
          console.log(localStorage.getItem('currentUser'));
          expect(result).toBe(false);
          expect(localStorage.getItem('currentUser')).toBeNull();
        });
    })));
  });
});



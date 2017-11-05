import { TestBed, inject, async } from '@angular/core/testing';
import {
  HttpModule,
  Http,
  Response,
  ResponseOptions,
  XHRBackend
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AccountService } from './account.service';

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
  },
  {
    id : 3,
    username : 'user3',
    email : 'swpp2015@daum.net',
    password : 'iluvswpp'
  }
] as User[];


describe('AccountService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports : [ HttpModule ],
      providers : [ AccountService,
        { provide : XHRBackend, useClass : MockBackend } ]
    }).compileComponents();
  }));

  it('should be created', inject([ AccountService ], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));

  it('can make object with "new"', inject([ Http ], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new AccountService(http);
    expect(service instanceof AccountService).toBe(true);
  }));

  describe('When get user', () => {
    let backend: MockBackend;
    let service: AccountService;

    let fakeUsers: User[];
    let response: Response;

    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AccountService(http);
      fakeUsers = makeMockUserDB();
    }));

    it('could get user with certain id', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakeUsers[ 0 ] }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getUser(fakeUsers[ 0 ].id)
        .then(user => {
          console.log(`first user = ${user}`);
          expect(user).toEqual(fakeUsers[ 0 ]);
        });
    })));

    it('could not get user with non existing id', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 403 }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getUser(4)
        .then(user => {
          console.log(`user with non existing id = ${user}`);
          expect(user).toBeNull();
        });
    })));
  });

  describe('When put user', () => {
    let backend: MockBackend;
    let service: AccountService;

    let fakeUsers: User[];
    let response: Response;

    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AccountService(http);
      fakeUsers = makeMockUserDB();
    }));

    it('could put user with certain id', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakeUsers[ 0 ] }));
      const fakeUser = fakeUsers[ 0 ];
      fakeUser.username = 'username modified';
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.putUser(fakeUser)
        .then(user => {
          console.log(`modified = ${user.username}`);
          expect(user.username).toEqual(fakeUsers[ 0 ].username);
        });
    })));

    it('could not put user with non existing id', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 403 }));
      const fakeUser = new User(5, 'temp_user', 'temp@gmail.com', 'temp_temp');
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.putUser(fakeUser)
        .then(user => {
          expect(fakeUsers.indexOf(user)).toEqual(-1);
        });
    })));
  });

  describe('When post a new user(sign up)', () => {
    let backend: MockBackend;
    let service: AccountService;

    let fakeUsers: User[];
    let response: Response;
    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AccountService(http);
      fakeUsers = makeMockUserDB();
    }));

    it('could post a new user', async(inject([], () => {
      const newUser = new User(4, 'newComer', 'newComer@gmail.com', 'swpp2017');
      response = new Response(new ResponseOptions({ status : 201, body : newUser }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.postUserSignUp(newUser.username, newUser.email, newUser.password)
        .then(user => {
          expect(user).toEqual(newUser);
        });
    })));
  });

  describe('When delete a user', () => {
    let backend: MockBackend;
    let service: AccountService;

    let fakeUsers: User[];
    let response: Response;
    beforeEach(inject([ Http, XHRBackend ], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AccountService(http);
      fakeUsers = makeMockUserDB();
    }));

    it('could delete existing user', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200 }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.deleteUser(fakeUsers[ 0 ].id)
        .then(result => {
          expect(result).toBeTruthy();
        });
    })));
    it('could not delete non-existing user', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 403 }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.deleteUser(10)
        .then(result => {
          expect(result).not.toBeTruthy();
        });
    })));
  });
});

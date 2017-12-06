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

    it('could get user', async(inject([], () => {
      response = new Response(new ResponseOptions({ status : 200, body : fakeUsers[ 0 ] }));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getUserDetail()
        .then(user => {
          expect(user).toEqual(fakeUsers[ 0 ]);
        });
    })));

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

      it('could put user', async(inject([], () => {
        response = new Response(new ResponseOptions({ status : 204, body : true }));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
        let user = new User(2, 'test', 'test@gmail.com', 'iluvswpp');
        service.putUser(user)
          .then(result => {
            expect(result).toEqual(true);
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
          .then(result => {
            expect(result).toEqual(true);
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

      it('could delete a user', async(inject([], () => {
        response = new Response(new ResponseOptions({ status : 200, body : true }));
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
        service.deleteUser()
          .then(result => {
            expect(result).toEqual(true);
          });
      })));

    });
  });
});

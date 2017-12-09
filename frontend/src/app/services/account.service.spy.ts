import { User } from '../models/user';

export class AccountServiceSpy {

  private TEST_USERS = [
    new User(0, 'Alice', 'alice@gmail.com', 'alice_ps'),
    new User(1, 'Bob', 'bob@gmail.com', 'bob_ps'),
    new User(2, 'Chris', 'chris@gmail.com', 'chris_ps'),
  ];

  getUserDetail = jasmine.createSpy('getUser').and.callFake((id: number) => {
    return Promise.resolve(this.TEST_USERS[ id ]);
  });

  putUser = jasmine.createSpy('putUser').and.callFake((user: User) => {
    let found = this.TEST_USERS.filter(u => u.id === user.id)[ 0 ];
    found.username = user.username;
    found.email = user.email;
    found.password = user.password;
    return Promise.resolve(found);
  });

  postUserSignUp = jasmine.createSpy('postUserSignUp').and.callFake(
    (username: string, email: string, password: string) => {
      this.TEST_USERS.push(new User(
        this.TEST_USERS.length, username, email, password
      ));
      return Promise.resolve(true);
    });


  deleteUser = jasmine.createSpy('deleteUser').and.callFake((id: number) => {
    this.TEST_USERS = this.TEST_USERS.filter(u => u.id !== id);
    return Promise.resolve(true);
  });
}

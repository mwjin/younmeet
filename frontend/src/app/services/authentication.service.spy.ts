
export class AuthenticationServiceSpy {
  shouldLogout: boolean = true;

  login = jasmine.createSpy('login').and.callFake((usernameOrEmail: string, password: string) => {
    if ((usernameOrEmail == "swpp2017" || usernameOrEmail == "swpp2017@gmail.com") &&
      password == "iluvswpp") {

      return Promise.resolve(true);
    }
    else {
      return Promise.resolve(false);
    }
  });

  logout = jasmine.createSpy('logout').and.callFake(() => {
    return Promise.resolve(this.shouldLogout);
  });
}

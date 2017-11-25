
export class AuthenticationServiceSpy {
  shouldLogout: boolean = true;

  logIn = jasmine.createSpy('logIn').and.callFake((usernameOrEmail: string, password: string) => {
    if ((usernameOrEmail == "swpp2017" || usernameOrEmail == "swpp2017@gmail.com") &&
      password == "iluvswpp") {

      return Promise.resolve(true);
    }
    else {
      return Promise.resolve(false);
    }
  });

  logOut = jasmine.createSpy('logOut').and.callFake(() => {
    return Promise.resolve(this.shouldLogout);
  });
}

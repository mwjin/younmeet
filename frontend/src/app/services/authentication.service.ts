import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthenticationService {
  private headers = new Headers({ 'Content-Type' : 'application/json' });

  constructor(private http: Http) {
  }

  logIn(usernameOrEmail: string, password: string): Promise<boolean> {
    const url = `/api/signin`; // could be /api/user/signin
    const isEmail: RegExp = new RegExp('^[^@\\s]+[@][^@\\s]+[.][a-z]{2,3}$');
    if (isEmail.test(usernameOrEmail)) {
      // If input is email format
      return this.http.post(url,
        JSON.stringify({
          email : usernameOrEmail,
          password : password
        }), { headers : this.headers })
        .toPromise()
        .then(response => {
          if (response.status === 200) {
            // login success
            localStorage.setItem('currentUser', JSON.stringify(response.json()));
            return true;
          } else {
            return false;
          }
        })
        .catch(this.handleError);
    } else {
      // If input is username format
      return this.http.post(url,
        JSON.stringify({
          username : usernameOrEmail,
          password : password
        }), { headers : this.headers })
        .toPromise()
        .then(response => {
          if (response.status === 200) {
            // signin success
            localStorage.setItem('currentUser', JSON.stringify(response.json()));
            return true;
          } else {
            // do something else
            return false;
          }
        });
    }
  }

  logOut(): Promise<void> {
    const url = `/api/signout`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem('currentUser');
        }
      });
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occured', error);
    return Promise.reject(error.message || error);
  }

}

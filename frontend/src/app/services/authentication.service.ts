import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { toPromise } from 'rxjs/operator/toPromise';
import { getCSRFHeaders } from '../../util/headers';

@Injectable()
export class AuthenticationService {
  private headers = new Headers({ 'Content-Type' : 'application/json' });

  redirectUrl: string;

  constructor(private http: Http) {
  }

  logIn(usernameOrEmail: string, password: string): Promise<boolean> {
    const url = `/api/signin`;
    const isEmail: RegExp = new RegExp('^[^@\\s]+[@][^@\\s]+[.][a-z]{2,3}$');
    if (isEmail.test(usernameOrEmail)) {
      // If input is email format
      return this.http.post(url,
        JSON.stringify({
          email : usernameOrEmail,
          password : password
        }), { headers : getCSRFHeaders(), withCredentials : true })
        .toPromise()
        .then(response => {
          if (response.status === 200) {
            // login success
            let token = '';
            if (document.cookie) {
              token = document.cookie.split('csrftoken=')[ 1 ].split(';')[ 0 ];
            }
            localStorage.setItem('currentUser', JSON.stringify({ 'token' : token }));
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
        }), { headers : getCSRFHeaders() })
        .toPromise()
        .then(response => {
          if (response.status === 200) {
            // login success
            let token = '';
            if (document.cookie) {
              token = document.cookie.split('csrftoken=')[ 1 ].split(';')[ 0 ];
            }
            localStorage.setItem('currentUser', JSON.stringify({ 'token' : token }));
            return true;
          } else {
            // do something else
            return false;
          }
        }).catch(this.handleError);
    }
  }

  logOut(): Promise<boolean> {
    const url = `/api/signout`;
    return this.http.get(url)
      .toPromise()
      .then(response => {
        localStorage.removeItem('currentUser');
        return true;
      })
      .catch((error: any) => {
        console.error(`Logout request failed!. Will log out for frontend.`);
        localStorage.removeItem('currentUser');
        return Promise.resolve(true);
      });
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true;
    }
    return false;
  }

  /*
  checkPassword(password: string): Promise<boolean> {
    const url = `/api/checkPassword`;
  }
  */

  private handleError(error: any): Promise<any> {
    console.error('Error occured', error);
    return Promise.reject(error.message || error);
  }

}

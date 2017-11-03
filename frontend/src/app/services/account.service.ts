import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { User } from '../models/user';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class AccountService {
  private accountUrl = '/api/user';
  private headers = new Headers({ 'Content-Type' : 'application/json' });

  constructor(private http: Http) { }

  getUser(id: number): Promise<User> {
    const url = `${this.accountUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  putUser(user: User): Promise<User> {
    const url = `${this.accountUrl}/${user.id}`;
    return this.http
      .put(url, JSON.stringify(user), { headers : this.headers })
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

  postUserSignIn(usernameOrEmail: string, password: string): Promise<HttpResponse<number>> {
    /*
     * Request POST for signin
     * return status 200 if sign-in success
     *  then route to the dashboard component
     * else, return 404 or something else
     */
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
        .then(response => response.status)
        .catch(this.handleError);
    }
  }

  postUserSignUp(username: string, email: string, password: string): Promise<HttpResponse<number>> {
    /*
     * Requiest POST for signup
     * return status 201 if success to make a new user
     * else return something else
     */
    const url = `/api/signup`; // could be /api/user/signup
    return this.http.post(url,
      JSON.stringify({
        username : username,
        email : email,
        password : password
      }), { headers : this.headers })
      .toPromise()
      .then(response => response.status)
      .catch(this.handleError);
  }

  deleteUser(id: number): Promise<void> {
    const url = `${this.accountUrl}/${id}`;
    return this.http.delete(url, { headers : this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occured', error);
    return Promise.reject(error.message || error);
  }

}

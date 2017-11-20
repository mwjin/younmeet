import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { User } from '../models/user';
import { getCSRFHeaders } from '../../util/headers';

@Injectable()
export class AccountService {
  private accountUrl = '/api/user';

  constructor(private http: Http) { }

  getUserDetail(): Promise<User> {
    return this.http.get(this.accountUrl)
      .toPromise()
      .then(response => response.json() as User)
      .catch(this.handleError);
  }

  putUser(user: User): Promise<boolean> {
    return this.http
      .put(this.accountUrl, JSON.stringify(user), <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .then(response => response.status === 204)
      .catch(this.handleError);
  }

  postUserSignUp(username: string, email: string, password: string): Promise<boolean> {
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
      }), <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .then(response => response.status === 201)
      .catch(this.handleError);
  }

  deleteUser(): Promise<boolean> {
    return this.http.delete(this.accountUrl, <RequestOptionsArgs>{ headers : getCSRFHeaders() })
      .toPromise()
      .then((response) => {
        return response.status === 200;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occured', error);
    return Promise.reject(error.message || error);
  }

}

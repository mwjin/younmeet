import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { User } from '../models/user';
import {getCSRFHeaders} from "../../util/headers";

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
      .put(
        this.accountUrl,
        JSON.stringify(user),
        { headers: getCSRFHeaders() }
        )
      .toPromise()
      .then(response => response.status === 204)
      .catch(this.handleError);
  }

  postUserSignUp(username: string, email: string, password: string): Promise<boolean> {
    const url = `/api/signup`; // could be /api/user/signup
    return this.http.post(
      url,
      JSON.stringify({
        username : username,
        email : email,
        password : password
      }),
      { headers: getCSRFHeaders() }
      )
      .toPromise()
      .then(response => response.status === 201)
      .catch(this.handleError);
  }

  deleteUser(): Promise<boolean> {
    return this.http.delete(this.accountUrl, { headers: getCSRFHeaders() })
      .toPromise()
      .then((response) => {
        return response.status === 200;
      })
      .catch(this.handleError);
  }


  checkPassword(password: string): Promise<boolean> {
    const url = `/api/user/check-password`;
    return this.http.post(url,
      JSON.stringify({'password': password}),
      { headers : getCSRFHeaders() }
      )
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occured', error);
    return Promise.reject(error.message || error);
  }

}

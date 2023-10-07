import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  constructor(private http: HttpClient) { }

  signUp(data: any) {
    return this.http.post(this.apiModel.host + '/api/user/signup',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  forgotPassword(data: any) {
    return this.http.post(this.apiModel.host + '/api/user/forgotPassword',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  login(data: any) {
    return this.http.post(this.apiModel.host + '/api/user/login',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  checkToken() {
    return this.http.get(this.apiModel.host + '/api/user/check-token');
  }

  changePassword(data: any) {
    return this.http.post(this.apiModel.host + '/api/user/change-password',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getUsers() {
    return this.http.get(this.apiModel.host + '/api/user/get');
  }

  updateUser(data: any) {
    console.log("updateUser service (data) : ", data);
    return this.http.post(this.apiModel.host + '/api/user/update',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getUserRole(data: any) {
    return this.http.get(this.apiModel.host + '/api/user/getUserRole',data);
  }
  
}

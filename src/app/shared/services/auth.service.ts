import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiModel } from '../models/Api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;

  constructor(private router: Router) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }

}

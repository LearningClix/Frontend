import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;

  constructor(private http: HttpClient) { }

  getDetails(){
    return this.http.get(this.apiModel.host + '/api/dashboard/details');
  }

}

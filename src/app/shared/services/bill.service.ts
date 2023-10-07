import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;

  constructor(private http: HttpClient) { }

  generateReport(data: any) {
    console.log("Service generateReport (data) : ", data);
    return this.http.post(this.apiModel.host + '/api/bill/generate-report',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getPDF(data:any): Observable<Blob> {
    console.log("getPDF (data) : ", data);
    return this.http.post(this.apiModel.host + '/api/bill/getBillPDF', data, {responseType:'blob'});     
  }

  getBills() {
    return this.http.get(this.apiModel.host + '/api/bill/getBills');
  }

  deleteBill(id: any) {
    return this.http.post(this.apiModel.host + '/api/bill/deleteBill/' + id,
      {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}

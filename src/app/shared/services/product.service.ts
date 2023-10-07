import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  constructor(private http: HttpClient) { }

  getProduct() {
    return this.http.get(this.apiModel.host + '/api/product/get');
  }

  getProductByCategory(id:any) {
    return this.http.get(this.apiModel.host + '/api/product/get-by-category/' + id);
  }

  getProductById(id:any) {
    return this.http.get(this.apiModel.host + '/api/product/get/' + id);
  }

  add(data: any) {
    return this.http.post(this.apiModel.host + '/api/product/add',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(data: any) {
    return this.http.post(this.apiModel.host + '/api/product/update',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }


  delete(seq:any): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/api/product/delete/' + seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }
  
  updateProductStatus(data: any) {
    return this.http.post(this.apiModel.host + '/api/product/update-product-status',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}

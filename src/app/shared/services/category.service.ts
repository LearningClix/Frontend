import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiModel } from '../models/Api.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiModel: ApiModel = new ApiModel();
  url: string = this.apiModel.host;
  constructor(private http: HttpClient) { }

  categories(){
    return this.http.get(this.apiModel.host + '/api/category/get');
  }

  add(data:any){
    return this.http.post(this.apiModel.host + '/api/category/add',
          data, { 
            headers:new HttpHeaders().set('Content-Type','application/json')
        });
  }

  update(data:any){
    return this.http.post(this.apiModel.host + '/api/category/update',
          data, { 
            headers:new HttpHeaders().set('Content-Type','application/json')
        });
  }

  delete(seq:any): Observable<any> {
    return this.http.post<any>(this.apiModel.host + '/api/category/delete/' + seq, { headers: this.apiModel.httpHeaderPost })
      .pipe(tap((p: any) => { console.log(p); })
      );
  }

  updateCategoryStatus(data: any) {
    return this.http.post(this.apiModel.host + '/api/category/update-category-status',
      data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getFilterCategories(){
    return this.http.get(this.apiModel.host + '/api/category/get?filterValue=true');
  }
  
}

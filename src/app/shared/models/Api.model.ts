import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

export class ApiModel {
  public token: string;
  public host: string;
  public httpOptions: any;
  public httpOptionsPdf: any;
  public httpHeaderGet: HttpHeaders;
  public httpHeaderPost: HttpHeaders;
  public httpHeaderPostMultipart: HttpHeaders;


  constructor() {
    //----- TEST  ------//

    this.host = 'http://localhost:8080';

    // Production 
    //this.rptProdHost = 'https://learningclix.cafe.com:8443/';

    this.token = 'Bearer ' + sessionStorage.getItem('token');
    this.httpOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': this.token,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    };

    this.httpOptionsPdf = {
      'responseType': 'arraybuffer' as 'json',
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Authorization': this.token,
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      })
    };

    this.httpHeaderGet = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Authorization': this.token,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    this.httpHeaderPost = new HttpHeaders({
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Authorization': this.token,
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    this.httpHeaderPostMultipart = new HttpHeaders({
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Authorization': this.token,
      'Access-Control-Allow-Credentials': 'true',
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

  }
}


import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { Util } from 'src/app/libs/Util';
import { environment } from 'src/environments/environment';
import { LogService } from '../log.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // see src/environments/environment.ts and src/environments/environment.prod.ts 
  static readonly BASEURL: string = environment.baseUrl;

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    console.log('conneting to api ' + DatabaseService.BASEURL);
  }

  // Http Options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'rejectUnauthorized': 'false',
      'insecure': 'true',
      'requestCert': 'false',
    })
  }

  protected GET(path: string, options: object = {}, doLogging: boolean = true): Observable<any> {
    const url = DatabaseService.BASEURL + path;
    this.logger.log(`GET ${url}`);
    return this.httpClient.get(url, this.httpOptions);
  }
  protected PUT(path: string, body: object = null, options: object = {}, doLogging: boolean = true): Observable<any> {
    const url = DatabaseService.BASEURL + path;
    this.logger.log(`PUT ${url} body: ${JSON.stringify(body, null, 2)}`);
    return this.httpClient.put(url, body, this.httpOptions);
  }
  protected POST(path: string, body: object = null, options: object = {}, doLogging: boolean = true): Observable<any> {
    const url = DatabaseService.BASEURL + path;
    this.logger.log(`POST ${url} body: ${JSON.stringify(body, null, 2)}`);
    return this.httpClient.post(url, body, this.httpOptions);
  }
  protected DELETE(path: string, options: object = {}, doLogging: boolean = true): Observable<any> {
    const url = DatabaseService.BASEURL + path;
    this.logger.log(`DELETE ${url}`);
    return this.httpClient.delete(url, this.httpOptions);
  }


  // Handle API errors
  protected handleError(error: HttpErrorResponse) {
    if (!this.alertCtrl) this.alertCtrl = new AlertController();

    Util.alert(this.alertCtrl, error.message + '!');

    if (this.logger) {
      this.logger.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      this.logger.error(error);
    }

    // return an observable with a user-facing error message
    return throwError('Error: ' + JSON.stringify(error));
  };


}

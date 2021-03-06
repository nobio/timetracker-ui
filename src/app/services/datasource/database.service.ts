import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
  //static readonly BASEURL: string = 'https://nobio.myhome-server.de:30043';
  //static readonly BASEURL: string = 'http://nobio.myhome-server.de:30030';
  //static readonly BASEURL: string = 'http://localhost:30000';
  static readonly BASEURL: string = environment.baseUrl;

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    console.log('conneting database to ' + DatabaseService.BASEURL);
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
    this.logger.log(body);
    return this.httpClient.put(url, body, this.httpOptions);
  }
  protected POST(path: string, body: object = null, options: object = {}, doLogging: boolean = true): Observable<any> {
    const url = DatabaseService.BASEURL + path;
    this.logger.log(`POST ${url} body: ${JSON.stringify(body, null, 2)}`);
    this.logger.log(body);
    return this.httpClient.post(url, body, this.httpOptions);
  }
  protected DELETE(path: string, options: object = {}, doLogging: boolean = true): Observable<any> {
    const url = DatabaseService.BASEURL + path;
    this.logger.log(`DELETE ${url}`);
    return this.httpClient.delete(url, this.httpOptions);
  }


  // Handle API errors
  protected handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.logger.error(error.error.message);
      Util.alert(this.alertCtrl, error.error.message, 'Datenbankfehler', error.error.message)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      Util.alert(this.alertCtrl, error.error, 'Achtung!', 'Datenbankfehler')
      this.logger.error(`Backend returned code ${error.status}, body was: ${error.error}`);
      this.logger.error(error)
    }
    // return an observable with a user-facing error message
    return throwError('Error: ' + JSON.stringify(error));
  };


}


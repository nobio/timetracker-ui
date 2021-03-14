import { Injectable, Injector } from '@angular/core';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Util } from 'src/app/lib/Util';
import { LogService } from '../log.service';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  logger: LogService;
  constructor(private alertCtrl: AlertController, private log: LogService) { 
    this.logger = log;
  }

  public get baseUrl(): string {
    return "https://nobio.myhome-server.de:30043";
    //return "http://nobio.myhome-server.de:30030";
    //return  "http://localhost:30000";
  }


  // Http Options
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'rejectUnauthorized': 'false',
      'insecure': 'true',
      'requestCert': 'false',
    })
  }

  // Handle API errors
  public handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this.logger.error(error.error.message);
      Util.alert(this.alertCtrl, error.error.message, 'Datenbankfehler', error.error.message)
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      Util.alert(this.alertCtrl, error.error, 'Achtung!', 'Datenbankfehler')
      this.logger.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Error: ' + JSON.stringify(error));
  };

}

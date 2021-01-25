import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Util } from 'src/app/lib/Util';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private alertCtrl: AlertController) { }

  public get baseUrl(): string {
    return "https://nobio.myhome-server.de:30043";
    //return "http://nobio.myhome-server.de:30030";
    //return  "http://localhost:30000";
  }


  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  // Handle API errors
  public handleError(error: HttpErrorResponse) {
    console.log('Alert Controler: ' + this.alertCtrl);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      Util.alert(this.alertCtrl, error.error.message, 'Datenbankfehler')
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      Util.alert(this.alertCtrl, error.error, 'Achtung!', 'Datenbankfehler')
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Error: ' + JSON.stringify(error));
  };

}

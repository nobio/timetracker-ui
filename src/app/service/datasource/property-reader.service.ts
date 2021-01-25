import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError, retry } from 'rxjs/operators';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyReader extends BaseService {

  private properties: Map<string, string> = new Map<string, string>();

  /** temporary hard coded protperties */

  constructor(public httpClient: HttpClient, alertCtrl: AlertController) {
    super(alertCtrl);
    this.loadAll();
  }

  private loadAll(): void {
    console.log(`${super.baseUrl}/api/properties`);
    this.httpClient
      .get(`${super.baseUrl}/api/properties`)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (data: any) => {
          console.log(data);
          data.forEach(el => {
            this.properties.set(el.key, el.value);
          });
        },
        (err) => {
          super.handleError(err);
          console.log(`Fehler beim Laden der Properties: ${err}`);
        }
      );
  }

  public get(key: string): string {
    if (this.properties.size > 0) {
      return this.properties.get(key);
    }
  }
  public set(key: string, value: string): void {
    console.log(`Property to set: '${key}' to '${value}'`)

    // store locally
    this.properties.set(key, value);
    // store in DB (async)
    this.httpClient
      .put(`${super.baseUrl}/api/properties/${key}?value=${value}`, null, super.httpOptions)
      .pipe(retry(1), catchError(super.handleError))
      .subscribe(
        (data: any) => { },
        (err) => {
          super.handleError(err);
          console.log(`Fehler beim Laden der Properties: ${err}`);
        }
      );
  }
}

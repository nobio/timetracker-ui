import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError, retry } from 'rxjs/operators';
import { LogService } from '../log.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyReader extends BaseService {

  private properties: Map<string, string> = new Map<string, string>();

  /** temporary hard coded protperties */

  constructor(public httpClient: HttpClient, alertCtrl: AlertController, logger: LogService) {
    super(alertCtrl, logger);
    this.loadAll();
  }

  private loadAll(): void {
    this.logger.log(`${super.baseUrl}/api/properties`);
    this.httpClient
      .get(`${super.baseUrl}/api/properties`, this.httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (data: any) => {
          this.logger.log(data);
          data.forEach(el => {
            this.properties.set(el.key, el.value);
          });
        },
        (err) => {
          super.handleError(err);
          this.logger.log(`Fehler beim Laden der Properties: ${err}`);
        }
      );
  }

  public get(key: string): string {
    if (this.properties.size > 0) {
      return this.properties.get(key);
    }
  }
  public set(key: string, value: string): void {
    this.logger.log(`Property to set: '${key}' to '${value}'`)

    // store locally
    this.properties.set(key, value);
    // store in DB (async)
    this.httpClient
      .put(`${super.baseUrl}/api/properties/${key}?value=${value}`, null, this.httpOptions)
      .pipe(retry(1), catchError(super.handleError))
      .subscribe(
        (data: any) => { },
        (err) => {
          super.handleError(err);
          this.logger.log(`Fehler beim Laden der Properties: ${err}`);
        }
      );
  }
}

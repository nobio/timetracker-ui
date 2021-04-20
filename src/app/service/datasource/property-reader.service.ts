import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError, retry } from 'rxjs/operators';
import { LogService } from '../log.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyReader extends DatabaseService {

  private properties: Map<string, string> = new Map<string, string>();

  /** temporary hard coded protperties */

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    super(httpClient, alertCtrl, logger);
    this.loadAll();
  }

  private loadAll(): void {
    this.GET('/api/properties')
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
    this.PUT(`/api/properties/${key}?value=${value}`, null)
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

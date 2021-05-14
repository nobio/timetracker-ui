import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError, retry } from 'rxjs/operators';
import { GeoTrack } from 'src/app/models/geo-track';
import { GeoTrackingMetaData } from 'src/app/models/geo-tracking-meta-data';
import { LogService } from '../log.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class GeoTrackService extends DatabaseService {

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    super(httpClient, alertCtrl, logger);
  }

  loadGeoTrackingDataByDate(dateStart: string, dateEnd: string): Promise<Array<GeoTrack>> {

    let geoTrackingData: GeoTrack[] = new Array();

    return new Promise((resolve, reject) => {

      this.GET(`/api/geotrack/?dateStart=${dateStart}&dateEnd=${dateEnd}`)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        // Attention: the data from database is not deliberately of type GeoTrack; 
        // it's just a coincidence.... maybe needs to be changed
        (data: Array<GeoTrack>) => {

          data.forEach((el) => {
            geoTrackingData.push({
              longitude: el.longitude,
              latitude: el.latitude,
              accuracy: el.accuracy,
              altitude: el.altitude,
              date: el.date,
              source: el.source,
            });
          });

          resolve(geoTrackingData);

        },
        (err) => {
          super.handleError(err);
          this.logger.error(err);
          reject("Fehler beim Laden der Daten mit fehlerhaften Einträgen: " + err);
        }
      );
    });
  };

  /**
   * {
   *   "size": 27,
   *   "totalDistance": 5880,
   *   "accuracy": {
   *     "mean": 65.55555555555556,
   *     "stdt": 31.955759312983297
   *   }
   * }
   * @param dateStart 
   * @param dateEnd 
   */
  loadGeoTrackingMetaDataByDate(dateStart: string, dateEnd: string): Promise<GeoTrackingMetaData> {
    return new Promise((resolve, reject) => {
      this.GET(`/api/geotrack/metadata?dateStart=${dateStart}&dateEnd=${dateEnd}`)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          // Attention: the data from database is not deliberately of type GeoTrack; 
          // it's just a coincidence.... maybe needs to be changed
          (metaData: GeoTrackingMetaData) => {
            this.logger.log(metaData);
            resolve(metaData);
          },
          (err) => {
            super.handleError(err);
            this.logger.error(err);
            reject("Fehler beim Laden der Daten mit fehlerhaften Einträgen: " + err);
          }
        );
    });
  }
}

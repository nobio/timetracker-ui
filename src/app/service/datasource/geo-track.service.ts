import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaseService } from './base.service';
import { TimeUnit } from 'src/app/model/enums';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import moment from 'moment';
import { Entry } from 'src/app/model/entry';
import { GeoTrack } from 'src/app/model/geo-track';

@Injectable({
  providedIn: 'root'
})
export class GeoTrackService extends BaseService {

  constructor(public httpClient: HttpClient, alertCtrl: AlertController) {
    super(alertCtrl);
  }

  loadGeoTrackingDataByDate(date: string, timeUnit: TimeUnit): Promise<Array<GeoTrack>> {

    let geoTrackingData: GeoTrack[] = new Array();
    const dt: string = moment(date).format('YYYY-MM-DD');

    return new Promise((resolve, reject) => {
      this.httpClient
        .get(super.baseUrl + "/api/geotrack/" + dt)
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
            console.log(err);
            reject("Fehler beim Laden der Daten mit fehlerhaften Einträgen: " + err);
          }
        );
    });
  };
}

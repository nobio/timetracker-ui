import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError, retry } from 'rxjs/operators';
import { GeoFence } from 'src/app/models/geo-fence';
import { LogService } from '../log.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class GeofenceService extends DatabaseService {

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    super(httpClient, alertCtrl, logger);
  }

  loadGeofences(): Promise<GeoFence[]> {
    let geoFenceData: GeoFence[] = new Array<GeoFence>();

    return new Promise((resolve, reject) => {
      this.GET('/api/geofences')
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (data: GeoFence[]) => {
            data.forEach((el) => {
              geoFenceData.push({
                id: el.id,
                enabled: el.enabled,
                longitude: el.longitude,
                latitude: el.latitude,
                radius: el.radius,
                description: el.description,
                isCheckedIn: el.isCheckedIn,
                lastChange: el.lastChange,
              });
            });
            // console.log(geoFenceData)
            resolve(geoFenceData);
          },
          (err) => {
            super.handleError(err);
            this.logger.error(err);
            reject("Fehler beim Laden der Daten mit fehlerhaften Einträgen: " + err);
          }
        );
    });

  };


  loadGeofence(id: string): Promise<GeoFence> {
    let geoFenceData: GeoFence = new GeoFence();

    return new Promise((resolve, reject) => {
      this.GET(`/api/geofences/${id}`)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (data: GeoFence) => {
            {
              geoFenceData = {
                id: data.id,
                enabled: data.enabled,
                longitude: data.longitude,
                latitude: data.latitude,
                radius: data.radius,
                description: data.description,
                isCheckedIn: data.isCheckedIn,
                lastChange: data.lastChange,
              };
            };
            // console.log(geoFenceData)
            resolve(geoFenceData);
          },
          (err) => {
            super.handleError(err);
            this.logger.error(err);
            reject("Fehler beim Laden der Daten mit fehlerhaften Einträgen: " + err);
          }
        );
    });

  };
}

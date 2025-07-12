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

  constructor(
    override httpClient: HttpClient,
    override alertCtrl: AlertController,
    override logger: LogService) {
    super(httpClient, alertCtrl, logger);
  }

  /**
   * load all geofences (list)
   * @returns
   */
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

  /**
   * load a specific geo fence by it's id
   * @param id
   * @returns
   */
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

  /**
   * save a geoFence object
   * @param geoFence
   * @returns
   */
  save(geoFence: GeoFence): Promise<void> {
    return new Promise((resolve, reject) => {
      this.PUT(`/api/geofences/${geoFence.id}`, {
        enabled: geoFence.enabled,
        radius: geoFence.radius,
        longitude: geoFence.longitude,
        latitude: geoFence.latitude,
        description: geoFence.description,
        isCheckedIn: geoFence.isCheckedIn,
        lastChange: geoFence.lastChange,
      })
        .subscribe(
          (user) => resolve(),
          (err) => {
            super.handleError(err);
            this.logger.error(`failed to update geofence ${geoFence}: ${err}`);
            reject("Error updating geofence " + geoFence.description + " " + err);
          }
        );
    });
  }

}

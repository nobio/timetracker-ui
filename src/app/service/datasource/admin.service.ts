import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from '@ionic/angular';
import { catchError, retry } from "rxjs/operators";
import { Toggle } from "src/app/model/toggle";
import { Toggles } from "src/app/model/toggles";
import { LogService } from "../log.service";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root",
})
export class AdminService extends DatabaseService {
  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    super(httpClient, alertCtrl, logger);
  }

  /**
   * calculates statisics and removes double entries
   *
   * @param entry JSON of new entry
   */
  calculateStatistics(): Promise<string> {
    this.logger.log("calculate busy time");

    return new Promise((resolve, reject) => {
      this.PUT('/api/stats')
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            this.logger.log("successfully recalculated");
            resolve("Berechnung erfolgreich durchgeführt");
          },
          (err) => {
            super.handleError(err);
            this.logger.log("failed to recalculate " + err);
            reject("Fehler bei Berechnung: " + err);
          }
        );
    });
  }

  /**
   * Dump the mongodb to the local file system in order to be restored if needed
   *
   * @returns {Promise<any>}
   * @memberof AdminBackendProvider
   */
  dumpTimeEntries(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.POST('/api/entries/dump')
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            this.logger.log(res);
            this.logger.log("successfully dumped data");
            resolve(
              `res["size"] Datensätze erfolgreich als Datei gesichert (${res["filename"]})`
            );
          },
          (err) => {
            super.handleError(err);
            this.logger.log("failed to save file " + err);
            reject("Fehler bei der Sicherung der Daten: " + err);
          }
        );
    });
  }

  /**
   * backup data in an extra backup table
   *
   * @returns {Promise<any>}
   * @memberof AdminBackendProvider
   */
  backupTimeEntries(): Promise<any> {
    this.logger.log("backup data");

    return new Promise((resolve, reject) => {
      this.POST('/api/entries/backup')
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            this.logger.log(JSON.stringify(res));
            this.logger.log("successfully backed up data to MongoDB");
            resolve(
              `${res["size"]} Datensätze erfolgreich als MongoDB gesichert`
            );
          },
          (err) => {
            super.handleError(err);
            this.logger.log("failed to backup data to MongoDB " + err);
            reject("Fehler bei der Sicherung der Daten in MongoDB: " + err);
          }
        );
    });
  }

  /**
   * backup data in an extra backup table
   *
   * @returns {Promise<Toggles[]>}
   * @memberof AdminBackendProvider
   */
  loadToggles(): Promise<Toggles> {
    return new Promise((resolve, reject) => {
      this.GET('/api/toggles/')
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (toggles: typeof Toggles[]) => {
            this.logger.log("loaded toggles: " + JSON.stringify(toggles));

            let to: Toggles = new Toggles();
            toggles.forEach((toggle) => {
              to.setToggle(toggle);
            });

            resolve(to);
          },
          (err) => {
            this.logger.log("failed to load toggles " + err);
            reject("Toggles konnten nicht geladen werden: " + err);
          }
        );
    });
  }

  saveToggle(toggle: Toggle): Promise<any> {
    return new Promise((resolve, reject) => {
      this.PUT(`/api/toggles/${toggle.id}`, toggle)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            this.logger.log("successfully saved a toggle");
            resolve("Toggle " + toggle.name + " has successfully been saved");
          },
          (err) => {
            this.logger.log("failed to save toggle " + err);
            reject("Error while saving toggle " + err);
          }
        );
    });
  }

  evaluateTimeEntries(): Promise<any> {
    this.logger.log("evaluate data");

    return new Promise((resolve, reject) => {
      this.POST('/api/entries/error/evaluate')
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            this.logger.log(res);
            this.logger.log("successfully initiated evaluation of time entries");
            resolve(res["message"]);
          },
          (err) => {
            super.handleError(err);
            this.logger.log("failed to save toggle " + err);
            reject("Error while saving toggle " + err);
          }
        );
    });
  }

}

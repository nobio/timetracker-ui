import { Injectable } from "@angular/core";
import { Toggles } from "src/app/model/toggles";
import { Toggle } from "src/app/model/toggle";
import { HttpClient } from "@angular/common/http";
import { BaseService } from "./base.service";
import { catchError, retry } from "rxjs/operators";
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: "root",
})
export class AdminService extends BaseService {
  constructor(public httpClient: HttpClient, alertCtrl: AlertController) {
    super(alertCtrl);
  }

  /**
   * calculates statisics and removes double entries
   *
   * @param entry JSON of new entry
   */
  calculateStatistics(): Promise<string> {
    console.log("calculate busy time");

    return new Promise((resolve, reject) => {
      this.httpClient
        .put(super.baseUrl + "/api/stats", this.httpOptions)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            console.log("successfully recalculated");
            resolve("Berechnung erfolgreich durchgeführt");
          },
          (err) => {
            super.handleError(err);
            console.log("failed to recalculate " + err);
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
      this.httpClient
        .post(super.baseUrl + "/api/entries/dump", this.httpOptions)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            console.log(res);
            console.log("successfully dumped data");
            resolve(
              res["size"] +
                " Datensätze erfolgreich als Datei gesichert (" +
                res["filename"] +
                ")"
            );
          },
          (err) => {
            super.handleError(err);
            console.log("failed to save file " + err);
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
    console.log("backup data");

    return new Promise((resolve, reject) => {
      this.httpClient
        .post(super.baseUrl + "/api/entries/backup", this.httpOptions)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            console.log(JSON.stringify(res));
            console.log("successfully backed up data to MongoDB");
            resolve(
              res["size"] + " Datensätze erfolgreich als MongoDB gesichert"
            );
          },
          (err) => {
            super.handleError(err);
            console.log("failed to backup data to MongoDB " + err);
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
      this.httpClient
        .get(super.baseUrl + "/api/toggles/", this.httpOptions)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (toggles: typeof Toggles[]) => {
            console.log("loaded toggles: " + JSON.stringify(toggles));

            let to: Toggles = new Toggles();
            toggles.forEach((toggle) => {
              to.setToggle(toggle);
            });

            resolve(to);
          },
          (err) => {
            console.log("failed to load toggles " + err);
            reject("Toggles konnten nicht geladen werden: " + err);
          }
        );
    });
  }

  saveToggle(toggle: Toggle): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient
        .put(
          super.baseUrl + "/api/toggles/" + toggle.id,
          toggle,
          this.httpOptions
        )
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            console.log("successfully saved a toggle");
            resolve("Toggle " + toggle.name + " has successfully been saved");
          },
          (err) => {
            console.log("failed to save toggle " + err);
            reject("Error while saving toggle " + err);
          }
        );
    });
  }

  evaluateTimeEntries(): Promise<any> {
    console.log("evaluate data");

    return new Promise((resolve, reject) => {
      this.httpClient
        .post(super.baseUrl + "/api/entries/error/evaluate", this.httpOptions)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (res) => {
            console.log(res);
            console.log("successfully initiated evaluation of time entries");
            resolve(res["message"]);
          },
          (err) => {
            super.handleError(err);
            console.log("failed to save toggle " + err);
            reject("Error while saving toggle " + err);
          }
        );
    });
  }

}

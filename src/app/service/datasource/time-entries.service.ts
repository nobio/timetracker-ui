import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { catchError, retry } from "rxjs/operators";
import { Entry } from "src/app/model/entry";
import { EntryStatistics } from "src/app/model/entry-statistics";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { FailDate } from "src/app/model/fail-date";
import moment from 'moment';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: "root",
})
export class TimeEntriesService extends BaseService {
  public entriesByDate: Entry[] = [];
  public selectedEntry: Entry = new Entry();
  public entryStats: EntryStatistics = new EntryStatistics();

  constructor(public httpClient: HttpClient, alertCtrl: AlertController) {
    super(alertCtrl);
  }

  /**
   * load entries for a given date
   * @param dt the given date in ISO-String format
   */
  loadEntriesByDate(dt: string): void {
    console.log("loading entries for " + dt);
    console.log(super.baseUrl);
    const date: number = new Date(dt).getTime();

    this.httpClient
      .get<Entry[]>(super.baseUrl + "/api/entries?dt=" + date)
      .pipe(retry(2)/*, catchError(super.handleError)*/)
      .subscribe((data: Entry[]) => {
        this.entriesByDate = [];
        data.forEach((element) => {
          let e: Entry = new Entry();
          e.encodeEntry(element);
          this.entriesByDate.push(e);
        });
      });
  }

  loadEntry(id: string): void {
    console.log(`loading entry ${id}`);
    if (!id) return;

    this.httpClient
      .get<Entry>(super.baseUrl + "/api/entries/" + id)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (data) => {
          this.selectedEntry = new Entry();
          this.selectedEntry.encodeEntry(data);
        },
        (err) => {
          super.handleError(err)
          throw new Error(err);
        }
      );
  }

  createEntry(entry: Entry, dt: string) {
    const body = {
      direction: entry.direction,
      datetime: entry.entryDate,
      longitude: entry.longitude,
      latitude: entry.latitude,
    };

    this.httpClient
      .post(super.baseUrl + "/api/entries/", body, super.httpOptions)
      //.pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (res) => {
          this.loadEntriesByDate(dt);
        },
        (err) => {
          super.handleError(err)
          this.loadEntriesByDate(dt);
          throw new Error(err);
        }
      );
  }

  /**
   * loads some statistics for this day like pause duration etc.
   * @param dt the given date in ISO-String format
   */
  loadWorkingTime(dt: string): void {
    // reset entry stats
    this.entryStats = new EntryStatistics();

    if (dt === undefined) {
      this.entryStats.workingTime = "na.";
      this.entryStats.pause = "na.";
      this.entryStats.totalWorkload = "na.";
      return;
    }

    const date: number = new Date(dt).getTime();

    this.httpClient
      .get(super.baseUrl + "/api/entries?busy=" + date)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe((data) => {
        console.log(data);
        this.entryStats.totalWorkload = this.millisecToReadbleTime(
          data["duration"]
        );
        this.entryStats.workingTime = this.millisecToReadbleTime(
          data["busytime"]
        );
        this.entryStats.pause = this.millisecToReadbleTime(data["pause"]);
      });
  }

  /**
   * deletes a time entry by it's id
   * @param id unique id of time entry
   */
  deleteSelectedEntry(): Observable<any> {
    console.log(
      `calling ${
      super.baseUrl + "/api/entries/" + this.selectedEntry.id
      } to delete entry`
    );
    return this.httpClient
      .delete(
        super.baseUrl + "/api/entries/" + this.selectedEntry.id,
        super.httpOptions
      )
      .pipe(retry(2), catchError(super.handleError));
  }

  /**
   * saves the selected Entry to databse
   */
  saveSelectedEntry(): Observable<any> {
    console.log(`calling ${super.baseUrl + "/api/entries/" + this.selectedEntry.id} to save entry`);
    return this.httpClient
      .put(
        super.baseUrl + "/api/entries/" + this.selectedEntry.id,
        JSON.stringify(this.selectedEntry.decodeEntry()),
        this.httpOptions
      )
      .pipe(retry(2), catchError(super.handleError));
  }

  /**
   * loads a list of dates with some data errors in them
   */
  loadDatesWithFailedEntries(): Promise<any> {
    console.log("loading error entries...");
    let failDates: FailDate[] = new Array();

    return new Promise((resolve, reject) => {
      this.httpClient
        .get(super.baseUrl + "/api/entries/error/dates")
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (data: []) => {
            //console.log(data)
            data.forEach((element) => {
              failDates.push({
                type: element["error-type"],
                date: element["error-date"],
                urlDate: moment(element["error-date"]).format('YYYY-MM-DD')
              });
            });
            resolve(failDates);
          },
          (err) => {
            super.handleError(err);
            console.log(err);
            console.log(err._body);
            this.selectedEntry = new Entry(); // clear selected entry
            reject(
              "Fehler beim Laden der Daten mit fehlerhaften Einträgen: " + err
            );
          }
        );
    });
  }

  millisecToReadbleTime(millisec: number): string {
    //console.log(millisec + ' ms');
    if (!millisec) {
      return "";
    }
    let dt = new Date();
    dt.setTime(millisec);
    return (
      (dt.getUTCHours() < 10 ? "0" + dt.getUTCHours() : dt.getUTCHours()) +
      ":" +
      (dt.getUTCMinutes() < 10 ? "0" + dt.getUTCMinutes() : dt.getUTCMinutes())
    );
  }
}

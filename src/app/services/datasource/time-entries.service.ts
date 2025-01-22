import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from '@ionic/angular';
import moment from 'moment';
import { Observable } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { Entry } from "src/app/models/entry";
import { EntryStatistics } from "src/app/models/entry-statistics";
import { FailDate } from "src/app/models/fail-date";
import { Tuple } from "src/app/models/tuple";
import { LogService } from "../log.service";
import { DatabaseService } from "./database.service";
import { Mark } from "src/app/models/enums";


@Injectable({
  providedIn: "root",
})
export class TimeEntriesService extends DatabaseService {
  public entriesByDate: Entry[] = [];
  public entriesTuplesByDate: Tuple<Entry>[] = [];
  public selectedEntry: Entry = new Entry();
  public entryStats: EntryStatistics = new EntryStatistics();

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    super(httpClient, alertCtrl, logger);
  }


  /**
   * load entries for a given date
   * @param dt the given date in ISO-String format
   */
  loadEntriesByDate(dt: string): void {
    let n = 0;

    this.logger.log("loading entries for " + dt);
    const date: number = new Date(dt).getTime();

    this.GET(`/api/entries?dt=${date}`)
      .pipe(retry(2))
      .subscribe((data: Entry[]) => {
        this.entriesByDate = [];
        this.entriesTuplesByDate = [];

        data.forEach((element) => {
          let e: Entry = new Entry();
          e.encodeEntry(element);
          this.entriesByDate.push(e);

          // make a 2 object line of the list
          if (n === 0) {
            this.entriesTuplesByDate.push(new Tuple<Entry>());
            this.entriesTuplesByDate[this.entriesTuplesByDate.length - 1].one = e;
            n = 1;
          } else {
            this.entriesTuplesByDate[this.entriesTuplesByDate.length - 1].two = e;
            n = 0;
          }

        });
      });
  }

  loadEntry(id: string): void {
    this.logger.log(`loading entry ${id}`);
    if (!id) return;

    this.GET(`/api/entries/${id}`)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (data) => {
          this.selectedEntry = new Entry();
          this.selectedEntry.encodeEntry(data);
        },
        (err) => {
          super.handleError(err)
          this.logger.error(err);
          throw new Error(err);
        }
      );
  }

  async createEntry(entry: Entry, dt: string) {

    const body = {
      direction: entry.direction,
      datetime: entry.entryDate,
      longitude: entry.longitude,
      latitude: entry.latitude,
    };

    this.POST('/api/entries/', body)
      .pipe(retry(2))
      .subscribe(
        (res) => {
          this.loadEntriesByDate(dt);
        },
        (err) => {
          //super.handleError(err)
          this.logger.error(err);
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
      this.entryStats.workDone = 0;
      return;
    }

    const date: number = new Date(dt).getTime();

    this.GET(`/api/entries?busy=${date}`)
      .pipe(retry(2), /*catchError(super.handleError)*/)
      .subscribe((data) => {
        this.logger.log(data);
        this.entryStats.totalWorkload = this.millisecToReadbleTime(data["duration"]);
        this.entryStats.workingTime = this.millisecToReadbleTime(data["busytime"]);
        this.entryStats.pause = this.millisecToReadbleTime(data["pause"]);
        this.entryStats.workDone = Math.min(1, Math.max(0, Math.abs(data["busytime"] / (8 * 1000 * 60 * 60)))); // millisecons scale to hours; 8 hours nominal worktime

        // calculate time, when working day will (probably) end
        if (this.entriesByDate.length > 0) {
          const calculatedEnd = moment(this.entriesByDate[0].entryDate)
            .add(8, 'hours')
            .add(this.entryStats.pause, 'minutes');

          this.entryStats.workEndsAt = calculatedEnd.format('HH:mm');
        }
      });
  }

  async deleteEntry(entry: Entry) {
    this.DELETE(`/api/entries/${entry.id}`)
      .pipe(retry(1), catchError(super.handleError))
      .subscribe((data: []) => { }),
      (err) => {
        super.handleError(err);
        this.logger.error(err, 'Fehler beim Löschen von Einträgen');
      };
  }

  async deleteAllTimeEntriesFromThisDate(dt) {
    for await (const entry of this.entriesByDate) {
      await this.deleteEntry(entry);
    }
    this.loadEntriesByDate(dt);
    this.selectedEntry = new Entry(); // clear selected entry
  }

  /**
   * deletes a time entry by it's id
   * @param id unique id of time entry
   */
  deleteSelectedEntry(): Observable<any> {
    return this.DELETE(`/api/entries/${this.selectedEntry.id}`)
      .pipe(retry(2), catchError(super.handleError));
  }

  /**
   * saves the selected Entry to databse
   */
  saveSelectedEntry(): Observable<any> {
    return this.PUT(
      `/api/entries/${this.selectedEntry.id}`, this.selectedEntry.decodeEntry())
      .pipe(retry(2), catchError(super.handleError));
  }

  /**
   * loads a list of dates with some data errors in them
   */
  loadDatesWithFailedEntries(): Promise<any> {
    let failDates: FailDate[] = new Array();

    return new Promise((resolve, reject) => {
      this.GET('/api/entries/error/dates')
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (data: []) => {
            //this.logger.log(data)
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
            this.logger.error(err, 'Tage mit Fehlerhafen Einträgen');
            this.logger.error(err._body, 'Tage mit Fehlerhafen Einträgen');
            this.selectedEntry = new Entry(); // clear selected entry
            reject(
              "Fehler beim Laden der Daten mit fehlerhaften Einträgen: " + err
            );
          }
        );
    });
  }

  millisecToReadbleTime(millisec: number): string {
    //this.logger.log(millisec + ' ms');
    if (!millisec) {
      return "00:00";
    }
    let dt = new Date();
    dt.setTime(millisec);
    return (
      (dt.getUTCHours() < 10 ? "0" + dt.getUTCHours() : dt.getUTCHours()) +
      ":" +
      (dt.getUTCMinutes() < 10 ? "0" + dt.getUTCMinutes() : dt.getUTCMinutes())
    );
  }

  async markADay(mark: Mark, dt: string) {

    const body = {
      mark: mark,
      entry_date: dt,
    };

    this.POST('/api/entries/mark', body)
      .pipe(retry(2))
      .subscribe(
        (res) => {
          this.loadEntriesByDate(dt);
        },
        (err) => {
          //super.handleError(err)
          this.logger.error(err);
          this.loadEntriesByDate(dt);
          throw new Error(err);
        }
      );
  }

}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { catchError, retry } from 'rxjs/operators';
import { Entry } from 'src/app/model/entry';
import { EntryStatistics } from 'src/app/model/entry-statistics';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TimeEntriesService extends BaseService {
  public entriesByDate: Entry[] = [];
  public selectedEntry: Entry = new Entry();
  public entryStats: EntryStatistics = new EntryStatistics();

  constructor(
    public httpClient: HttpClient
  ) {
    super();
  }

  /**
   * load entries for a given date
   * @param dt the given date in ISO-String format
   */
  loadEntriesByDate(dt: string): void {
    console.log('loading entries for ' + dt);
    console.log(super.baseUrl);
    const date: number = new Date(dt).getTime();

    this.httpClient.get<Entry[]>(super.baseUrl + '/api/entries?dt=' + date)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe((data: Entry[]) => {

        this.entriesByDate = [];
        data.forEach((element) => {
          let e: Entry = new Entry();
          e.encodeEntry(element);
          this.entriesByDate.push(e);
        });

      })
  }

  loadEntry(id: string): void {

    console.log(`loading entry ${id}`);
    if (!id) return;

    this.httpClient.get<Entry>(super.baseUrl + '/api/entries/' + id)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(data => {
        this.selectedEntry = new Entry();
        this.selectedEntry.encodeEntry(data);
      });
  }

  createEntry(entry: Entry, dt: string) {
    const body = {
      direction: entry.direction,
      datetime: entry.entryDate,
      longitude: entry.longitude,
      latitude: entry.latitude
    }

    this.httpClient.post(super.baseUrl + '/api/entries/', body, super.httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        res => {
          this.loadEntriesByDate(dt)
        },
        err => {
          console.log(err);
          console.log(err._body);
          this.loadEntriesByDate(dt);
          throw new Error(err);
        }
      )

  }

  /**
   * loads some statistics for this day like pause duration etc.
   * @param dt the given date in ISO-String format
   */
  loadWorkingTime(dt: string): void {
    // reset entry stats
    this.entryStats = new EntryStatistics();

    if (dt === undefined) {
      this.entryStats.workingTime = 'na.';
      this.entryStats.pause = 'na.';
      this.entryStats.totalWorkload = 'na.'
      return;
    }

    const date: number = new Date(dt).getTime();

    this.httpClient
      .get(super.baseUrl + '/api/entries?busy=' + date)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        data => {
          console.log(data)
          this.entryStats.totalWorkload = this.millisecToReadbleTime(data['duration']);
          this.entryStats.workingTime = this.millisecToReadbleTime(data['busytime']);
          this.entryStats.pause = this.millisecToReadbleTime(data['pause']);
        }
      )
  }

  /**
   * deletes a time entry by it's id
   * @param id unique id of time entry
   */
  deleteSelectedEntry(): Observable<any> {

    console.log(`calling ${super.baseUrl + '/api/entries/' + this.selectedEntry.id} to delete entry`)
    return this.httpClient
      .delete(super.baseUrl + '/api/entries/' + this.selectedEntry.id, super.httpOptions)
      .pipe(retry(2), catchError(super.handleError))

  }

  /**
   * saves the selected Entry to databse
   */
  saveSelectedEntry(): Observable<any> {

    console.log(`calling ${super.baseUrl + '/api/entries/' + this.selectedEntry.id} to save entry`)
    return this.httpClient
      .put(super.baseUrl + '/api/entries/' + this.selectedEntry.id, JSON.stringify(this.selectedEntry.decodeEntry()), this.httpOptions)
      .pipe(retry(2), catchError(super.handleError))

  }

  millisecToReadbleTime(millisec: number): string {
    //console.log(millisec + ' ms');
    if (!millisec) {
      return '';
    }
    let dt = new Date();
    dt.setTime(millisec);
    return (
      dt.getUTCHours() < 10 ? '0'
        + dt.getUTCHours() : dt.getUTCHours())
      + ':' + (dt.getUTCMinutes() < 10 ? '0'
        + dt.getUTCMinutes() : dt.getUTCMinutes()
      )
  }

}

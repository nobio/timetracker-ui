import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

import { catchError, retry } from 'rxjs/operators';
import { Entry } from 'src/app/model/entry';
import { EntryStatistics } from 'src/app/model/entry-statistics';

@Injectable({
  providedIn: 'root'
})

export class TimeEntriesService {
  public entriesByDate: Entry[] = [];
  public selectedEntry: Entry = new Entry();
  public entryStats: EntryStatistics = new EntryStatistics();

  //private baseUrl: string = "http://localhost:30000";
  //private baseUrl: string = "nobio.myhome-server.de:30043";
  private baseUrl: string = "https://nobio.myhome-server.de:30043";

  constructor(
    private httpClient: HttpClient
  ) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

  /**
   * load entries for a given date
   * @param dt the given date in ISO-String format
   */
  loadEntriesByDate(dt: string): void {
    console.log('loading entries for ' + dt);
    const date: number = new Date(dt).getTime();

    this.httpClient
      .get<Entry[]>(this.baseUrl + '/api/entries?dt=' + date)
      .pipe(retry(2), catchError(this.handleError))
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

    this.httpClient
      .get<Entry>(this.baseUrl + '/api/entries/' + id)
      .pipe(retry(2), catchError(this.handleError))
      .subscribe(data => {
        this.selectedEntry = new Entry();
        this.selectedEntry.encodeEntry(data);
      });
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
      .get(this.baseUrl + '/api/entries?busy=' + date)
      .pipe(retry(2), catchError(this.handleError))
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

    console.log(`calling ${this.baseUrl + '/api/entries/' + this.selectedEntry.id} to delete entry`)
    return this.httpClient
      .delete(this.baseUrl + '/api/entries/' + this.selectedEntry.id, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError))

  }

  /**
   * saves the selected Entry to databse
   */
  saveSelectedEntry(): Observable<any> {

    console.log(`calling ${this.baseUrl + '/api/entries/' + this.selectedEntry.id} to save entry`)
    return this.httpClient
      .put(this.baseUrl + '/api/entries/' + this.selectedEntry.id, JSON.stringify(this.selectedEntry.decodeEntry()), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError))

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

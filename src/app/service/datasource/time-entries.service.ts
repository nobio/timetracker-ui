import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Entry } from 'src/app/model/entry';

@Injectable({
  providedIn: 'root'
})

export class TimeEntriesService {
  public entriesByDate: Entry[] = [];

  private baseUrl: string = "http://localhost:30000";

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
   * @param dt the given date in ISO format ()
   */
  loadEntriesByDate(dt: string): void {
    console.log('loading entries for ' + dt);
    const date: number = new Date(dt).getTime();

    this.httpClient
      .get<Entry[]>(this.baseUrl + '/api/entries?dt=' + date)
      .pipe(retry(2), catchError(this.handleError))
      .subscribe(data => {

        this.entriesByDate = [];
        data.forEach((element) => {
          let e: Entry = new Entry();
          e.encodeEntry(element);
          this.entriesByDate.push(e);
        });
      
      })
  }

}

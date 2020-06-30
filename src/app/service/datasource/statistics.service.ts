import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { TimeUnit } from 'src/app/model/enums';
import { Statistics } from 'src/app/model/statistics';
import { catchError, retry } from 'rxjs/operators';
import { Util } from 'src/app/lib/Util';
import { BreakTimes } from 'src/app/model/break-time';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService extends BaseService {

  constructor(
    public httpClient: HttpClient
  ) {
    super();
  }


  /**
 * Loads historic data for a given date and a given time unit
 * 
 * /stats/1451602800000?timeUnit=year
 * /stats/1507461589327?timeUnit=3
 * 
 * @param date as ISO string representation of the given data
 * @param unit time unit: year, month, week, day
 */
  loadStatisticDataByUnit(date: string, unit: TimeUnit, accumulate: boolean): Promise<Statistics> {
    let dateInMilliSeconds = Util.convertToDateInMillis(date, unit);
    const timeUnit: string = TimeUnit[unit];
    //console.log("loading data for " + date + "(" + dateInMilliSeconds + ") and time unit " + unit) + "(" + timeUnit + ")";

    return new Promise<Statistics>((resolve, reject) => {
      this.httpClient.get(super.baseUrl + "/api/stats/" + dateInMilliSeconds + "/" + timeUnit + "?accumulate=" + accumulate, super.httpOptions)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          res => {
            // console.log("statistics data successfully loaded");

            let stats = {} as Statistics;
            stats.actualWorkingTime = res['actual_working_time'];
            stats.averageWorkingTime = res['average_working_time'];
            stats.plannedWorkingTime = res['planned_working_time'];
            stats.data = res['chart_data'].main[0].data;
            stats.compData = res['chart_data'].comp[0].data;

            resolve(stats);
          },
          err => {
            console.log("failed to load historc data " + err);
            reject("Fehler beim Laden der historischen Daten: " + err);
          }
        );
    });
  }

  /**
   * loads statistics for break time 
   */
  loadStatisticBreakTime(realData: boolean, interval:number): Promise<BreakTimes> {
    return new Promise<BreakTimes>((resolve, reject) => {

      this.httpClient.get(super.baseUrl + "/api/statistics/breaktime/" + interval + "?real=" + realData, super.httpOptions)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (breaktimeData: []) => {
            let data:any = [];
            for (let n = 0; n < breaktimeData.length; n++) {
              data.push( 
                {
                  "breakTime": breaktimeData[n]['breakTime'], 
                  "time": breaktimeData[n]['time']
                }
              );
            }
        
            let stats = {} as BreakTimes;
            stats.data = data;
            resolve(stats);
          },
          err => {
            console.log("failed to load break time data " + err);
            reject("Fehler beim Laden der Pausendaten: " + err);
          }
        );
    });
  }
}

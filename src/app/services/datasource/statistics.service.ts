import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError, retry } from 'rxjs/operators';
import { Util } from 'src/app/libs/Util';
import { BreakTimes } from 'src/app/models/break-time';
import { Direction, TimeUnit } from 'src/app/models/enums';
import { Statistics } from 'src/app/models/statistics';
import { LogService } from '../log.service';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService extends DatabaseService {

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    super(httpClient, alertCtrl, logger);
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
  loadStatisticDataByUnit(date: string, unit: TimeUnit, accumulate: boolean, fill: boolean): Promise<Statistics> {
    let dateInMilliSeconds = Util.convertToDateInMillis(date, unit, 0);  // 3 hours offset
    const timeUnit: string = TimeUnit[unit];
    //this.logger.log("loading data for " + date + "(" + dateInMilliSeconds + ") and time unit " + unit) + "(" + timeUnit + ")";

    return new Promise<Statistics>((resolve, reject) => {
      this.GET(`/api/stats/${dateInMilliSeconds}/${timeUnit}?accumulate=${accumulate}&fill=${fill}`)
        .pipe(retry(1), catchError(super.handleError))
        .subscribe(
          res => {
            // this.logger.log("statistics data successfully loaded");

            let stats = {} as Statistics;
            stats.actualWorkingTime = res['actual_working_time'];
            stats.averageWorkingTime = res['average_working_time'];
            stats.plannedWorkingTime = res['planned_working_time'];
            stats.data = res['chart_data'].main[0].data;
            stats.compData = res['chart_data'].comp[0].data;

            resolve(stats);
          },
          err => {
            this.logger.log("failed to load historc data " + err);
            reject("Fehler beim Laden der historischen Daten: " + err);
          }
        );
    });
  }

  /**
   * loads statistics for break time
   */
  loadStatisticBreakTime(realData: boolean, interval: number): Promise<BreakTimes> {
    return new Promise<BreakTimes>((resolve, reject) => {
      this.GET(`/api/statistics/breaktime/${interval}?real=${realData}`)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (breaktimeData: []) => {
            let data: any = [];
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
            this.logger.error(`failed to load break time data ${err}`);
            console.error(`failed to load break time data ${err}`);
            reject("Fehler beim Laden der Pausendaten: " + err);
          }
        );
    });
  }

  /**
 * Loads historic aggregated data for all the data (time) and a given time unit
 *
 * /statistics/aggregate?timeUnit=month
 *
 * @param unit time unit: day, week, month
 */
  loadStatisticAggregatedDataByUnit(unit: TimeUnit): Promise<Statistics> {
    const timeUnit: string = TimeUnit[unit];
    this.logger.log("loading data for time unit " + unit) + "(" + timeUnit + ")";

    return new Promise<Statistics>((resolve, reject) => {
      this.GET(`/api/statistics/aggregate?timeUnit=${timeUnit}`)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          res => {
            //this.logger.log("aggregated data successfully loaded: " + JSON.stringify(res));
            //this.logger.log(res['chart_data']['main'][0]['data'])
            let stats = {} as Statistics;
            stats.actualWorkingTime = res['actual_working_time'];
            stats.averageWorkingTime = res['average_working_time'];
            stats.plannedWorkingTime = res['planned_working_time'];
            stats.data = res['chart_data']['main'][0]['data'];
            stats.compData = res['chart_data']['comp'][0]['data'];
            resolve(stats);
          },
          err => {
            this.logger.log("failed to load historc data " + err);
            reject("Fehler beim Laden der historischen Daten: " + err);
          }
        );
    });
  }

  /**
 *
 * @param interval
 * @param direction
 */
  loadStatisticHistogramDataByInterval(interval: Number, direction: Direction): Promise<Statistics> {

    return new Promise<Statistics>((resolve, reject) => {

      let url: string = `/api/statistics/histogram/${interval}`;
      if (direction) {
        url += `?direction=${direction}`;
      }

      this.GET(url)
        .pipe(retry(2), catchError(super.handleError))
        .subscribe(
          (histogramData: []) => {
            let data: any = [];
            for (let n = 0; n < histogramData.length; n++) {
              data.push(
                {
                  "x": new Date(histogramData[n]['time']).getUTCHours() + ':00',
                  "y": histogramData[n]['histValue']
                }
              );
            }

            let stats = {} as Statistics;
            stats.data = data;
            resolve(stats);
          },
          err => {
            this.logger.log("failed to load historic data " + err);
            reject("Fehler beim Laden der historischen Daten: " + err);
          }
        );
    });
  }
}

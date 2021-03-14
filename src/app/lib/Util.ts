import { TimeUnit } from '../model/enums';
import { AlertController } from '@ionic/angular';
import { Plugins } from "@capacitor/core";
import { GeoCoord } from '../model/geo-coord';
import moment, { Moment } from 'moment';
import { LogService } from '../service/log.service';

const { Geolocation } = Plugins;

export class Util {

  // =================================== Helper functions END ======================================

  /**
   * substract one time unit to current date variable and repaint
   * @param timeUnit
   * @param date
   * @returns new date
   */
  static setBefore(timeUnit: TimeUnit, date: string): string {
    let dt = new Date(date);

    if (TimeUnit.day == timeUnit) {
      dt.setUTCDate(dt.getUTCDate() - 1);
    } else if (TimeUnit.week == timeUnit) {
      dt.setUTCDate(dt.getUTCDate() - 7);
    } else if (TimeUnit.month == timeUnit) {
      dt.setMonth(dt.getMonth() - 1);
      dt.setDate(1);
    } else if (TimeUnit.year == timeUnit) {
      dt.setUTCFullYear(dt.getUTCFullYear() - 1);
      dt.setDate(1);
      dt.setMonth(0);
    }

    return dt.toISOString();
  }

  /**
   * Sets the current date to today; 
   * Please mind that for timeUnit = week we set the date to this week's monday
   * @param timeUnit
   * @param date
   * @returns new date
   */
  static setToday(timeUnit: TimeUnit): string {
    let dt = new Date();

    if (TimeUnit.day == timeUnit) {
      //dt.setUTCDate(dt.getUTCDate() + 1);
    } else if (TimeUnit.week == timeUnit) {
      dt = this.getMonday(new Date());
    } else if (TimeUnit.month == timeUnit) {
      dt.setDate(1);
    } else if (TimeUnit.year == timeUnit) {
      dt.setDate(1);
      dt.setMonth(0);
    }

    return dt.toISOString();
  }

  /**
   * add one time unit to current date variable and repaint
   * @param timeUnit
   * @param date
   * @returns new date
   */
  static setAhead(timeUnit: TimeUnit, date: string): string {
    let dt = new Date(date);

    if (TimeUnit.day == timeUnit) {
      dt.setUTCDate(dt.getUTCDate() + 1);
    } else if (TimeUnit.week == timeUnit) {
      dt.setUTCDate(dt.getUTCDate() + 7);
    } else if (TimeUnit.month == timeUnit) {
      dt.setUTCMonth(dt.getUTCMonth() + 1);
      dt.setDate(1);
    } else if (TimeUnit.year == timeUnit) {
      dt.setUTCFullYear(dt.getUTCFullYear() + 1);
      dt.setDate(1);
      dt.setMonth(0);
    }

    return dt.toISOString();
  }

  /**
   * returns a Date Object representing the Monday of the very same week;
   * Time remains the same
   * @param dt 
   * @returns Date a Monday
   */
  static getMonday(dt: Date): Date {
    let day: number = dt.getDay();
    let diff: number = dt.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(dt.setDate(diff));
  }
  static getMondayByMoment(dt: Moment): Moment {
    let day: number = dt.day();
    let diff: number = dt.day() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return moment(dt).day(diff);
  }

  /**
   * Takes a date and TimeUnit and converts this to milliseconds representing
   * the date without any time information
   * 
   * @param date 
   * @param unit 
   */
  static convertToDateInMillis(date: string, unit: TimeUnit) {
    let dt = new Date(date);
    dt.setHours(0);
    dt.setMinutes(0);
    dt.setSeconds(0);
    dt.setMilliseconds(0);
    if (TimeUnit.week == unit) {
      // todo: dt.setDate(<1. der Woche>);
    } else if (TimeUnit.month == unit) {
      dt.setDate(1); // must set to 1. of the month
    } else if (TimeUnit.year == unit) {
      dt.setDate(1); // must set to 1. of the month
      dt.setMonth(0); // must set to January. of the year
    }
    return dt.getTime();
  }

  /**
   * Helper function to display an alert
   * @param alertCtrl 
   * @param msg 
   * @param title 
   * @param subTitle 
   */
  static async alert(alertCtrl: AlertController, msg: string, title: string = 'Fehler', subTitle: string = '') {
    const alert = alertCtrl.create({
      header: title,
      message: msg,
      subHeader: subTitle,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
          }
        },
      ],
      animated: true,
    });

    (await alert).present()
  }

  /**
   * looksup the current geo location coordinates
   */
  static lookUpGeoLocation(): Promise<GeoCoord> {
    const geoCoord = {} as GeoCoord

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition()
        .then(geoLocPos => {
          if (geoLocPos && geoLocPos.coords) {
            geoCoord.latitude = geoLocPos.coords.latitude;
            geoCoord.longitude = geoLocPos.coords.longitude;
          }
          resolve(geoCoord);
        })
        .catch(err => reject(err))
    });
  }
}

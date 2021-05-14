import moment, { Moment } from 'moment';
import { Util } from '../libs/Util';
import { TimeUnit } from './enums';

export class TimeBox {
   private date: Moment;
   public day: string;
   public week: string;
   public month: string;
   public year: string;

   constructor() {
      this.reset();
   }


   /**
    * resets to now timestamp
    */
   public reset(): void {
      this.date = moment();
      this.set(this.date.toISOString())
   }

   /**
    * sets the dates of this object to the given date
    * @param date date in ISO format to which all fields are set
    */
   public set(date: string): void {
      this.date = moment(date);
      let dt = moment(date);
      // set day (without time)
      this.day = dt.format('YYYY-MM-DD');
      // set week
      this.week = Util.getMondayByMoment(dt).format('YYYY-MM-DD');
      // set month (day = 1, because we want 01.MM.YYYY)
      dt.date(1);
      this.month = dt.format('YYYY-MM-DD');
      // set year (month = 1, because we want 01.01.yyyy)
      dt.month(0);
      this.year = dt.format('YYYY-MM-DD');
   }

   getDateISOString(): string {
      return this.date.toISOString();
   }

   getDateByTimeUnitISOString(tu: TimeUnit): string {
      if (TimeUnit.day == tu) {
         return this.day;
       } else if (TimeUnit.week == tu) {
         return this.week;
       } else if (TimeUnit.month == tu) {
         return this.month;
       } else if (TimeUnit.year == tu) {
          return this.year;
       }
   }

   public toString(): string {
      return 'TimeBox:\n' +
         'date: ' + this.date.toISOString() + '\n' +
         'day: ' + this.day + '\n' +
         'week: ' + this.week + '\n' +
         'month: ' + this.month + '\n' +
         'year: ' + this.year;
   }

}

import { Component, ViewChild } from "@angular/core";
import { TimeEntriesService } from "../../services/datasource/time-entries.service";
import { Entry } from "../../models/entry";
import { IonDatetime, ToastController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import * as moment from 'moment';
import { Util } from 'src/app/libs/Util';

@Component({
  selector: "app-entries",
  templateUrl: "entries.page.html",
  styleUrls: ["entries.page.scss"],
})
export class EntriesPage {
  private _date: string = new Date().toISOString();
  hasNoFailedDates: boolean = false;
  enterTime: string = null;
  goTime: string = null;

  constructor(
    public timeEntryService: TimeEntriesService,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
  ) { }

  ionViewWillEnter() {
    if (this.route.snapshot.params.date) this.date = moment(this.route.snapshot.params.date).toISOString();
    if (!this.date) this.date = new Date().toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date);
    this.timeEntryService.loadDatesWithFailedEntries().then((res: []) => this.hasNoFailedDates = res.length === 0)
  }

  /** enters a new entry 'enter' to the database */
  public async enter() {
    this.createEntry("enter");
  }
  /** enters a new entry 'go' to the database */
  public leave() {
    this.createEntry("go");
  }
  public async addEnterGo() {
    let date: string;
    console.log(this.enterTime, this.goTime, this.date, `${moment(this.date).format('YYYY-MM-DD')} ${this.enterTime}` );

    if(this.enterTime) {
      if(moment(this.enterTime, "HH:mm", true).isValid()) {
        date = moment(`${moment(this.date).format('YYYY-MM-DD')} ${this.enterTime}`).toISOString();
        await this.createEntry("enter", date);
      }
    }
    console.log(date);

    if(this.goTime) {
      if(moment(this.goTime, "HH:mm", true).isValid()) {
        date = moment(`${moment(this.date).format('YYYY-MM-DD')} ${this.goTime}`).toISOString();
        await this.createEntry("go", date);
      }
    }
    console.log(date);
  }
  resetEnterGo() {
    this.enterTime = null;
    this.goTime = null;
  }

  private async createEntry(direction: string, date?: string) {
    const entry = {} as Entry;
    entry.direction = direction;
    entry.entryDate = (date) ? date : this.date;

    try {
      const geoCoord = await Util.lookUpGeoLocation();
      if (geoCoord) {
        entry.latitude = geoCoord.latitude;
        entry.longitude = geoCoord.longitude;
      }
      await this.timeEntryService.createEntry(entry, this.date);
    } catch (error) {
      this.presentMessage(error, 20000);
    }

  }

  /* ===================== Time handling ===================== */
  set date(dt: string) {
    this._date = dt;
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date);
  }
  get date(): string {
    return this._date;
  }

  public setYesterday(): void {
    let yesterday = new Date(this.date);
    yesterday.setDate(yesterday.getDate() - 1);
    this.date = yesterday.toISOString();
  }
  public setToday(): void {
    this.date = new Date().toISOString();
  }
  public setTomorrow(): void {
    let tomorrow = new Date(this.date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.date = tomorrow.toISOString();
  }
  /* ===================== Time handling ===================== */

  /**
   * shows message box at the bottom (toast)
   * @param msg
   * @param duration
   */
  async presentMessage(msg: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
    });
    toast.present();
  }
}

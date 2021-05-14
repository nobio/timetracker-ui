import { Component } from "@angular/core";
import { TimeEntriesService } from "../../services/datasource/time-entries.service";
import { Entry } from "../../models/entry";
import { ToastController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import moment from 'moment';
import { Util } from 'src/app/libs/Util';

@Component({
  selector: "app-entries",
  templateUrl: "entries.page.html",
  styleUrls: ["entries.page.scss"],
})
export class EntriesPage {
  private _date: string = new Date().toISOString();
  hasNoFailedDates: boolean = false;

  constructor(
    public timeEntryService: TimeEntriesService,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
  ) {}

  ionViewWillEnter() {
    if (this.route.snapshot.params.date) this.date = moment(this.route.snapshot.params.date).toISOString();
    if (!this.date) this.date = new Date().toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date);
    this.timeEntryService.loadDatesWithFailedEntries()
      .then( (res:[]) => this.hasNoFailedDates = res.length === 0)
  }

  /** enters a new entry 'enter' to the database */
  public async enter() {
    this.createEntry("enter");
  }
  /** enters a new entry 'go' to the database */
  public leave() {
    this.createEntry("go");
  }

  private async createEntry(direction: string) {
    const entry = {} as Entry;
    entry.direction = direction;
    entry.entryDate = this.date;

    try {
      const geoCoord = await Util.lookUpGeoLocation();
      entry.latitude = geoCoord.latitude;
      entry.longitude = geoCoord.longitude;
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

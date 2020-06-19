import { Component } from '@angular/core';
import { TimeEntriesService } from '../service/datasource/time-entries.service';
import { Entry } from '../model/entry';
import { Plugins, GeolocationPosition } from '@capacitor/core';
import { ToastController } from '@ionic/angular';

const { Geolocation } = Plugins;


@Component({
  selector: 'app-entries',
  templateUrl: 'entries.page.html',
  styleUrls: ['entries.page.scss']
})
export class EntriesPage {
  private _date: string = new Date().toISOString();

  constructor(
    public timeEntryService: TimeEntriesService,
    private toastCtrl: ToastController
  ) { }

  ionViewWillEnter() {
    if (!this.date) this.date = new Date().toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date);
  }

  /** enters a new entry 'enter' to the database */
  public async enter() { this.createEntry('enter'); }
  /** enters a new entry 'go' to the database */
  public leave() { this.createEntry('go'); }


  private async createEntry(direction: string) {
    const entry = {} as Entry;
    let geoLocPosition: GeolocationPosition;
    try {
      geoLocPosition = await Geolocation.getCurrentPosition(); 
    } catch (error) {
      console.error(`no geolocation available: ${error.message}`);
      geoLocPosition = undefined;
    }

    entry.direction = direction;
    entry.entryDate = this.date;
    if (geoLocPosition && geoLocPosition.coords) {
      entry.latitude = geoLocPosition.coords.latitude;
      entry.longitude = geoLocPosition.coords.longitude;
    }

    try {
      await this.timeEntryService.createEntry(entry, this.date);
    } catch (err) {
      this.presentMessage(err, 20000)
    }
  }

  /* ===================== Time handling ===================== */
  set date(dt: string) {
    this._date = dt;
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date)
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

  public showTimeEntryErrors() { }

  /**
   * shows message box at the bottom (toast)
   * @param msg 
   * @param duration 
   */
  async presentMessage(msg: string, duration: number) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration
    });
    toast.present();
  }

}

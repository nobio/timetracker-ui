import { Component } from '@angular/core';
import { TimeEntriesService } from '../service/datasource/time-entries.service';

@Component({
  selector: 'app-entries',
  templateUrl: 'entries.page.html',
  styleUrls: ['entries.page.scss']
})
export class EntriesPage {
  private _date: string = new Date().toISOString();

  constructor(
    public timeEntryService: TimeEntriesService,
  ) { }

  ionViewWillEnter() {
    if (!this.date) this.date = new Date().toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date)
  }
  public enter() { }
  public leave() { }

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


}

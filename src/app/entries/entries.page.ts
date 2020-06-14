import { Component } from '@angular/core';
import { TimeEntriesService } from '../service/datasource/time-entries.service';

@Component({
  selector: 'app-entries',
  templateUrl: 'entries.page.html',
  styleUrls: ['entries.page.scss']
})
export class EntriesPage {
  public date: string;

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
  public setYesterday(): void {
    let yesterday = new Date(this.date);
    yesterday.setDate(yesterday.getDate() - 1);
    this.date = yesterday.toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date)
  }
  public setToday(): void {
    this.date = new Date().toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date);
  }
  public setTomorrow(): void {
    let tomorrow = new Date(this.date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.date = tomorrow.toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date);
  }
  /* ===================== Time handling ===================== */

  public showTimeEntryErrors() { }


}

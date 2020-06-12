import { Component } from '@angular/core';
import { TimeEntriesService } from '../service/datasource/time-entries.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  public date: string;

  constructor(
    public timeEntryService: TimeEntriesService
  ) { }

  ionViewWillEnter() {
    this.date = new Date().toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
  }
  public enter() { }
  public leave() { }

  /* ===================== Time handling ===================== */
  public setYesterday(): void {
    let yesterday = new Date(this.date);
    yesterday.setDate(yesterday.getDate() - 1);
    this.date = yesterday.toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    //##this.backend.loadWorkingTime(this.date);
  }
  public setToday(): void {
    this.date = new Date().toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    //##this.backend.loadWorkingTime(this.date);
  }
  public setTomorrow():void { 
    let tomorrow = new Date(this.date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.date = tomorrow.toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    //##this.backend.loadWorkingTime(this.date);
  }
  /* ===================== Time handling ===================== */

  public showTimeEntryErrors() { }

  deleteEntry(id: string, slidingItem: any): void {
    console.log('deleting entry ' + id);
  }

  showEntryDetails(id: string, slidingItem: any): void {
    console.log('show entry for ' + id);
  }
  
  editEntryDetails(id: string, slidingItem: any): void {
    console.log('editing item ' + id);
  }

  showMap(id: string): void {
    console.log('showMap ' + id);
  }

}

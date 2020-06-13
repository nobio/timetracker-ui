import { Component } from '@angular/core';
import { TimeEntriesService } from '../service/datasource/time-entries.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-entries',
  templateUrl: 'entries.page.html',
  styleUrls: ['entries.page.scss']
})
export class EntriesPage {
  public date: string;

  constructor(
    public timeEntryService: TimeEntriesService,
    private alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    this.date = new Date().toISOString();
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
  public setTomorrow():void { 
    let tomorrow = new Date(this.date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.date = tomorrow.toISOString();
    this.timeEntryService.loadEntriesByDate(this.date);
    this.timeEntryService.loadWorkingTime(this.date);
  }
  /* ===================== Time handling ===================== */

  public showTimeEntryErrors() { }

  public async deleteEntry (id: string) {
    console.log('deleting entry ' + id);
    
    const confirm = await this.alertCtrl.create({
      header: 'Wirklich löschen?',
      message: 'Soll dieser Eintrag tatsächlich gelöscht werden?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel', 
        },
        {
          text: 'Löschen',
          handler: () => {
            this.timeEntryService.deleteEntry(id, this.date);
          }
        }
      ]
    });
    await confirm.present();

  }

  showEntry(id: string): void {
    console.log('show entry for ' + id);
  }
  
  editEntry(id: string): void {
    console.log('editing item ' + id);
  }

  showMap(id: string): void {
    console.log('showMap ' + id);
  }

}

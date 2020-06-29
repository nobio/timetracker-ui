import { Component } from '@angular/core';
import { Toggles } from '../../model/toggles';
import { ToastController } from '@ionic/angular';
import { AdminService } from '../../service/datasource/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss']
})
export class AdminPage {
  toggles: Toggles = new Toggles();
  toggleSlackNotificationEnabled: boolean = false;

  constructor(
    private adminSrv: AdminService,
    private toastCtrl: ToastController
  ) { 
  }

  ionViewWillEnter() {
    this.adminSrv.loadToggles()
      .then(toggles => this.toggles = toggles)
      .catch(err => this.presentMessage(err, 2000));
  }

  /**
   * initiate the recalcuation of statistics
   */
  calculateBusyTime() {
    this.presentMessage('Neuberechnung starten...', 2000);
    this.adminSrv
      .calculateStatistics()
      .then(result => {
        this.presentMessage(result, 3000);
      })
      .catch(err => {
        this.presentMessage(err, 3000);
      });

  }

  /**
   * dump data to file system
   */
  dumpData() {
    this.presentMessage('Daten ins File System dumpen...', 2000);
    this.adminSrv
      .dumpTimeEntries()
      .then(result => {
        this.presentMessage(result, 3000);
      })
      .catch(err => {
        this.presentMessage(err, 3000);
      });
  }

  /**
   * back data to database
   */
  backupData() {
    this.presentMessage('Daten in Datenbank sichern...', 2000);
    this.adminSrv
      .backupTimeEntries()
      .then(result => {
        this.presentMessage(result, 3000);
      })
      .catch(err => {
        this.presentMessage(err, 3000);
      });
  }

  /** 
   * evaluate data; i.e. check TimeEntries for each day and check the order and if data is complete.
   * Results are stored in database and can be read by another endpoint   * 
   */
  evaluateData() {
    this.presentMessage('Daten werden untersucht...', 2000);
    this.adminSrv
      .evaluateTimeEntries()
      .then(result => {
        this.presentMessage(result, 3000);
      })
      .catch(err => {
        this.presentMessage(err, 3000);
      });
  }

  /**
   * save a toggle
   */
  saveToggle(toggleName: string) {
    console.log('saving toggle ' + toggleName);

    const t = this.toggles.getToggle(toggleName);
    this.adminSrv.saveToggle(t)
      //.then(toggle => this.presentMessage(toggle, 1000))
      .catch(err => this.presentMessage(err, 2000));
  }

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

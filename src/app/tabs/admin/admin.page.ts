import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { OnlineStatusComponent } from 'src/app/components/online-status/online-status.component';
import { AuthService } from 'src/app/services/datasource/auth.service';
import { PropertyReader } from 'src/app/services/datasource/property-reader.service';
import { LogService } from 'src/app/services/log.service';
import { Toggles } from '../../models/toggles';
import { AdminService } from '../../services/datasource/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    FormsModule,
    OnlineStatusComponent,
    CommonModule
  ],
})
export class AdminPage {
  toggles: Toggles = new Toggles();
  toggleSlackNotificationEnabled: boolean = false;

  constructor(
    private adminSrv: AdminService,
    private toastCtrl: ToastController,
    private props: PropertyReader,
    private logger: LogService,
    private authSrv: AuthService
  ) {
  }

  ionViewWillEnter() {
    this.adminSrv.loadToggles()
      .then(toggles => this.toggles = toggles)
      .catch(err => this.presentMessage(err, 2000));
  }

  set fill(fill: boolean) {
    this.props.set('de.nobio.timetracker.FILL', `${fill}`);
  }
  get fill(): boolean {
    return this.props.get('de.nobio.timetracker.FILL') == 'true';
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
    // this.logger.log('saving toggle ' + toggleName);

    const t = this.toggles.getToggle(toggleName);
    this.adminSrv.saveToggle(t)
      //.then(toggle => this.presentMessage(toggle, 1000))
      .catch(err => this.presentMessage(err, 2000));
  }

  /**
   * logs out this session
   */
  logout() {
    this.authSrv.logout();
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

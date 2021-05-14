import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { TimeEntriesService } from 'src/app/services/datasource/time-entries.service';
import { ActivatedRoute } from '@angular/router';
import { Util } from 'src/app/libs/Util';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
})
export class EntryPage {

  mode: string = 'edit';

  constructor(
    //private navParams: NavParams,
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    public timeEntryService: TimeEntriesService,
    private navCtrl: NavController
  ) { }

  ionViewWillEnter() {
    this.timeEntryService.loadEntry(this.route.snapshot.params.id);
  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Wirklich löschen?',
      message: 'Soll ich diesen Eintrag tatsächlich <strong>löschen?</strong>',
      //subHeader: 'Subtitle',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Löschen',
          handler: () => {
            this.timeEntryService.deleteSelectedEntry()
              .subscribe(e => this.navCtrl.navigateBack('/tabs/entries'));
          }
        }
      ]
    });

    await alert.present();
  }

  save(): void {
    this.timeEntryService.saveSelectedEntry()
      .subscribe(e => this.navCtrl.navigateBack('/tabs/entries'));
  }

  setGeoLocation(): void {
    Util.lookUpGeoLocation()
    .then(geoCoord => {
      this.timeEntryService.selectedEntry.longitude = geoCoord.longitude;
      this.timeEntryService.selectedEntry.latitude = geoCoord.latitude;
    })
  }
}

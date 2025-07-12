import { Component } from '@angular/core';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { TimeEntriesService } from 'src/app/services/datasource/time-entries.service';
import { ActivatedRoute } from '@angular/router';
import { Util } from 'src/app/libs/Util';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.page.html',
  styleUrls: ['./entry.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    DecimalPipe,
    DatePipe,
    CommonModule
  ],
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
    this.timeEntryService.loadEntry(this.route.snapshot.params['id']);
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
              .subscribe(e => this.navCtrl.navigateBack('/members/entries'));
          }
        }
      ]
    });

    await alert.present();
  }

  save(): void {
    this.timeEntryService.saveSelectedEntry()
      .subscribe(e => this.navCtrl.navigateBack('/members/entries'));
  }

  setGeoLocation(): void {
    Util.lookUpGeoLocation()
      .then(geoCoord => {
        this.timeEntryService.selectedEntry.longitude = geoCoord.longitude;
        this.timeEntryService.selectedEntry.latitude = geoCoord.latitude;
      })
  }
  get markIcon(): string {
    return Util.markIcon(this.timeEntryService.selectedEntry.mark);
  }

}

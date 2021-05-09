import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { AdminService } from 'src/app/service/datasource/admin.service';
import { LogService } from 'src/app/service/log.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage {

  public user: User = new User();
  public passwordHasChanged: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    public adminService: AdminService,
    private navCtrl: NavController,
    private logger: LogService
  ) { }

  ionViewWillEnter() {
    console.log(this.route.snapshot.params);

    this.adminService.loadUser(this.route.snapshot.params.id)
      .then(user => this.user = user)
      .catch(err => this.logger.error(err))

  }

  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Wirklich löschen?',
      message: 'Soll dieser Benutzer wirklich <strong>gelöscht</strong> werden?</strong>',
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
            this.adminService.deleteUser(this.user)
            .then(e => this.navCtrl.navigateBack('/tabs/admin/user'))
            .catch(err => this.logger.error(err))
          }
        }
      ]
    });

    await alert.present();
  }

  save(): void {
    console.log(this.user)
    if(this.passwordHasChanged) {
      console.log("password has changed - setting password");
      this.adminService.setPassword(this.user) 
    }
    this.adminService.updateUser(this.user)
      .then(e => this.navCtrl.navigateBack('/tabs/admin/user'))
      .catch(err => this.logger.error(err))
  }

}

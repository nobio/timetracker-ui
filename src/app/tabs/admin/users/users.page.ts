import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/model/user';
import { AdminService } from 'src/app/service/datasource/admin.service';
import { LogService } from 'src/app/service/log.service';

@Component({
  selector: 'app-user',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  public users: User[] = [];

  constructor(
    private route: ActivatedRoute,
    public adminService: AdminService,
    private navCtrl: NavController,
    private logger: LogService
  ) { }

  ngOnInit() {
    // load all users
    this.adminService.loadAllUser()
      .then(users => { this.users = users })
      .catch(err => this.logger.error('unable to load users'))
  }
}

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/datasource/admin.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-user',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    FormsModule
  ],
})
export class UsersPage implements OnInit {

  public users: User[] = [];

  constructor(
    public adminService: AdminService,
    private logger: LogService
  ) { }

  ngOnInit() {
    // load all users
    this.adminService.loadAllUser()
      .then(users => { this.users = users })
      .catch(err => this.logger.error('unable to load users'))
  }
}

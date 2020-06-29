import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPage } from './admin.page';

import { AdminPageRoutingModule } from './admin-routing.module'
import { OnlineStatusComponentModule } from '../online-status/online-status.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnlineStatusComponentModule,
    RouterModule.forChild([{ path: '', component: AdminPage }]),
    AdminPageRoutingModule,
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}

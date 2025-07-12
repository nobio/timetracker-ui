import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AdminPage } from './admin.page';
import { OnlineStatusComponent } from 'src/app/components/online-status/online-status.component';
import { AdminPageRoutingModule } from './admin-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnlineStatusComponent,
    RouterModule.forChild([{ path: '', component: AdminPage }]),
    AdminPageRoutingModule,
    AdminPage
  ],
})
export class AdminPageModule { }

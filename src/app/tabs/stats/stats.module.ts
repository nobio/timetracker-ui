import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StatsPageRoutingModule } from './stats-routing.module';
import { StatsPage } from './stats.page';
import { OnlineStatusComponent } from 'src/app/components/online-status/online-status.component';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnlineStatusComponent,
    StatsPageRoutingModule,
    StatsPage
  ],
})
export class StatsPageModule { }

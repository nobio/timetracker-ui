import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OnlineStatusComponentModule } from '../../online-status/online-status.module';
import { StatsPageRoutingModule } from './stats-routing.module';
import { StatsPage } from './stats.page';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OnlineStatusComponentModule,
    StatsPageRoutingModule
  ],
  declarations: [StatsPage]
})
export class StatsPageModule {}

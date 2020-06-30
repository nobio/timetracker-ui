import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsPage } from './stats.page';

import { StatsPageRoutingModule } from './stats-routing.module';
import { OnlineStatusComponentModule } from '../../online-status/online-status.module';

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
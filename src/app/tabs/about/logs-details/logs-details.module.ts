import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogsDetailsPageRoutingModule } from './logs-details-routing.module';

import { LogsDetailsPage } from './logs-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogsDetailsPageRoutingModule
  ],
  declarations: [LogsDetailsPage]
})
export class LogsDetailsPageModule {}

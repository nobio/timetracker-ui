import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FailsPageRoutingModule } from './fails-routing.module';

import { FailsPage } from './fails.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FailsPageRoutingModule
  ],
  declarations: [FailsPage]
})
export class FailsPageModule {}

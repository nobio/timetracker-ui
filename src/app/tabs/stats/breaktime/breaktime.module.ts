import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BreaktimePageRoutingModule } from './breaktime-routing.module';

import { BreaktimePage } from './breaktime.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BreaktimePageRoutingModule
  ],
  declarations: [BreaktimePage]
})
export class BreaktimePageModule {}

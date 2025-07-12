import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AggregatPageRoutingModule } from './aggregat-routing.module';
import { AggregatPage } from './aggregat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggregatPageRoutingModule,
    AggregatPage
  ],
})
export class AggregatPageModule { }

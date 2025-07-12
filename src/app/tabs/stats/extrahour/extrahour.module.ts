import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtrahourPageRoutingModule } from './extrahour-routing.module';

import { ExtrahourPage } from './extrahour.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtrahourPageRoutingModule,
    ExtrahourPage
  ]
})
export class ExtrahourPageModule { }

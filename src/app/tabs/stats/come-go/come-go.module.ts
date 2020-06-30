import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComeGoPageRoutingModule } from './come-go-routing.module';

import { ComeGoPage } from './come-go.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComeGoPageRoutingModule
  ],
  declarations: [ComeGoPage]
})
export class ComeGoPageModule {}

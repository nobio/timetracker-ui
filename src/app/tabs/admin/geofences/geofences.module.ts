import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GeofencesPageRoutingModule } from './geofences-routing.module';
import { GeofencesPage } from './geofences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeofencesPageRoutingModule,
    GeofencesPage
  ],
})
export class GeofencesPageModule { }

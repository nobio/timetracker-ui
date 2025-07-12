import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { GeoFence } from 'src/app/models/geo-fence';
import { GeofenceService } from 'src/app/services/datasource/geofence.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-geofences',
  templateUrl: './geofences.page.html',
  styleUrls: ['./geofences.page.scss'],
  imports: [
    IonicModule,
    RouterModule,
    FormsModule,
    CommonModule
  ],
})
export class GeofencesPage {

  public geoFences: GeoFence[] = new Array();

  constructor(
    private geoFenceService: GeofenceService,
    private logger: LogService
  ) { }

  async ionViewWillEnter() {
    this.geoFences = await this.geoFenceService.loadGeofences();
    console.log(this.geoFences);
  }

}

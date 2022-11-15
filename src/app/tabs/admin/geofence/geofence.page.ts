import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeoFence } from 'src/app/models/geo-fence';
import { GeofenceService } from 'src/app/services/datasource/geofence.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.page.html',
  styleUrls: ['./geofence.page.scss'],
})
export class GeofencePage {

  public geoFence: GeoFence = new GeoFence();

  constructor(
    private route: ActivatedRoute,
    private geoFenceService: GeofenceService,
    private logger: LogService
  ) { }

  async ionViewWillEnter() {
    this.geoFence = await this.geoFenceService.loadGeofence(this.route.snapshot.params.id);
  }

}

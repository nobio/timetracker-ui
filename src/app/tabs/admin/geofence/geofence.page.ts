import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeoFence } from 'src/app/models/geo-fence';
import { GeofenceService } from 'src/app/services/datasource/geofence.service';
import { LogService } from 'src/app/services/log.service';

import * as Leaflet from "leaflet";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.page.html',
  styleUrls: ['./geofence.page.scss'],
})
export class GeofencePage implements OnInit {

  public geoFence: GeoFence = new GeoFence();
  private map: Leaflet.Map;

  constructor(
    private route: ActivatedRoute,
    private geoFenceService: GeofenceService,
    private logger: LogService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    Leaflet.Icon.Default.imagePath = "assets/leaflet/"
    if (!this.map) {
      this.map = Leaflet.map("map-geofence");
    }
  }

  async ionViewWillEnter() {
    this.geoFence = await this.geoFenceService.loadGeofence(this.route.snapshot.params.id);
    this.initMap();
  }

  set geoFenceIsEnabled(enabled: boolean) {
    this.geoFence.enabled = enabled;
    this.geoFenceService.save(this.geoFence)
      .catch(err => this.logger.error(err))

  }
  get geoFenceIsEnabled(): boolean {
    return this.geoFence.enabled;
  }

  set geoFenceIsCheckedIn(isCheckedIn: boolean) {
    this.geoFence.isCheckedIn = isCheckedIn;
    this.geoFenceService.save(this.geoFence)
      .catch(err => this.logger.error(err))
  }
  get geoFenceIsCheckedIn(): boolean {
    return this.geoFence.isCheckedIn;
  }

  initMap() {
    // if no valid values in selected entry, redirect to root
    if (!this.geoFence.latitude || !this.geoFence.longitude) {
      return;
    }

    // init the map
    this.map.setView([
      this.geoFence.latitude,
      this.geoFence.longitude,
    ], 17
    );

    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "edupala.com © Angular LeafLet",
    }).addTo(this.map);

    Leaflet.marker([
      this.geoFence.latitude,
      this.geoFence.longitude,
    ],
    ).addTo(this.map);

  }

  /**
   * Save the geoFence data
   */
  save() {
    this.geoFenceService.save(this.geoFence)
      .then(e => this.navCtrl.navigateBack('/members/admin/geofence'))
      .catch(err => this.logger.error(err))
  }

  /**
   * delete this geofence
   */
  delete() {

  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeoFence } from 'src/app/models/geo-fence';
import { GeofenceService } from 'src/app/services/datasource/geofence.service';
import { LogService } from 'src/app/services/log.service';

import * as Leaflet from "leaflet";

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
    private logger: LogService
  ) { }

  ngOnInit() {
    Leaflet.Icon.Default.imagePath = "assets/leaflet/"
    if (!this.map) {
      this.map = Leaflet.map("map-geofence");
    }
  }

  async ionViewWillEnter() {
    console.warn("DEBUG: ionViewWillEnter 1")
    this.geoFence = await this.geoFenceService.loadGeofence(this.route.snapshot.params.id);
    console.warn("DEBUG: ionViewWillEnter 2")
    this.initMap();
    console.warn("DEBUG: ionViewWillEnter 3")
  }

  initMap() {
    console.warn("DEBUG: initMap 1")
    // if no valid values in selected entry, redirect to root
    if (!this.geoFence.latitude || !this.geoFence.longitude) {
      return;
    }
    console.warn("DEBUG: initMap 2")

    // init the map
    this.map.setView([
      this.geoFence.latitude,
      this.geoFence.longitude,
    ], 17
    );
    console.warn("DEBUG: initMap 3")

    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "edupala.com © Angular LeafLet",
    }).addTo(this.map);
    console.warn("DEBUG: initMap 4")

    Leaflet.marker([
      this.geoFence.latitude,
      this.geoFence.longitude,
    ],
    ).addTo(this.map);
    console.warn("DEBUG: initMap 5")

  }

}

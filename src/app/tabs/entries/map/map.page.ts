import { Component, OnInit } from "@angular/core";
import { TimeEntriesService } from "src/app/services/datasource/time-entries.service";
import * as Leaflet from "leaflet";
//import { antPath } from "leaflet-ant-path";
//import "leaflet/dist/images/marker-shadow.png";
//import "leaflet/dist/images/marker-icon-2x.png";
import { NavController } from '@ionic/angular';

@Component({
  selector: "map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"],
})
export class MapPage implements OnInit {
  private map: Leaflet.Map;

  constructor(
    private timeEntryService: TimeEntriesService,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    Leaflet.Icon.Default.imagePath = "assets/leaflet/"
    if (!this.map) {
      this.map = Leaflet.map("map-entry");
    }
  }

  ionViewDidEnter() {
    if (!this.map) {
      this.map = Leaflet.map("map");
    }
    this.initMap();
  }

  initMap() {

    // if no valid values in selected entry, redirect to root
    if (!this.timeEntryService.selectedEntry.latitude || !this.timeEntryService.selectedEntry.longitude) {
      this.navCtrl.navigateRoot('/');
    }

    // init the map
    this.map.setView([
      this.timeEntryService.selectedEntry.latitude,
      this.timeEntryService.selectedEntry.longitude,
    ], 17
    );

    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "edupala.com © Angular LeafLet",
    }).addTo(this.map);

    Leaflet.marker([
      this.timeEntryService.selectedEntry.latitude,
      this.timeEntryService.selectedEntry.longitude,
    ],
    ).addTo(this.map);
  }
}

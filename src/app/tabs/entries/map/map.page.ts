import { Component } from "@angular/core";
import { TimeEntriesService } from "src/app/service/datasource/time-entries.service";
import * as Leaflet from "leaflet";
//import { antPath } from "leaflet-ant-path";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import { NavController } from '@ionic/angular';

@Component({
  selector: "map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"],
})
export class MapPage {
  private map: Leaflet.Map;

  constructor(
    private timeEntryService: TimeEntriesService,
    private navCtrl: NavController,
    ) { }

  ionViewDidEnter() {
    this.initMap();
  }

  initMap() {

    // if no valid values in selected entry, redirect to root
    if(!this.timeEntryService.selectedEntry.latitude || !this.timeEntryService.selectedEntry.longitude) {
      this.navCtrl.navigateRoot('/');
    }

    // init the map
    this.map = Leaflet.map("map").setView(
      [
        this.timeEntryService.selectedEntry.latitude,
        this.timeEntryService.selectedEntry.longitude,
      ], 20
    );
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "edupala.com © Angular LeafLet",
    }).addTo(this.map);

    const markPoint = Leaflet.marker([
      this.timeEntryService.selectedEntry.latitude,
      this.timeEntryService.selectedEntry.longitude,
    ]);
    markPoint.bindPopup("<p>Tashi Delek - Bangalore.</p>");

    this.map.addLayer(markPoint);

    setTimeout(function(){ this.map.invalidateSize()}, 1000);

    /*
    // https://edupala.com/how-to-add-leaflet-map-in-ionic/
    antPath(
      [
        [
          this.timeEntryService.selectedEntry.latitude,
          this.timeEntryService.selectedEntry.longitude,
        ],
        [
          this.timeEntryService.selectedEntry.latitude,
          this.timeEntryService.selectedEntry.longitude,
        ],
      ],
      { color: "#FF0000", weight: 5, opacity: 0.6 }
    ).addTo(this.map);
*/
  }
}

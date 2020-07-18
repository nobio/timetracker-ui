import { Component, OnInit } from '@angular/core';
import { TimeUnit } from '../../model/enums';
import { Util } from 'src/app/lib/Util';
import * as Leaflet from "leaflet";
import { antPath } from "leaflet-ant-path";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import { GeoTrackService } from 'src/app/service/datasource/geo-track.service';
import { GeoTrack } from 'src/app/model/geo-track';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  date: string; // ISO String representation of the date
  timeUnit: TimeUnit = TimeUnit.day;
  private map: Leaflet.Map;

  constructor(private geoTrackService: GeoTrackService) { }

  ionViewDidEnter() {
    // load today's data
    if (!this.map) {
      this.map = Leaflet.map("map");
    }
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "edupala.com © Angular LeafLet",
    }).addTo(this.map);
    this.map.setZoom(17);
    this.setToday();
  }
  /**
   * substract one time unit to current date variable and repaint
   */
  public setBefore(): any {
    this.date = Util.setBefore(this.timeUnit, this.date);
    this.reInitMap();
  }
  /**
   * Sets the current date to today;
   * Please mind that for timeUnit = week we set the date to this week's monday
   */
  public setToday(): any {
    this.date = Util.setToday(this.timeUnit);
    this.reInitMap();
  }
  /**
   * add one time unit to current date variable and repaint
   */
  public setAhead(): any {
    this.date = Util.setAhead(this.timeUnit, this.date);
    this.reInitMap();
  }

  private async reInitMap() {
    // load geo tracking data from database 
    let geoTrackData: Array<GeoTrack> = await this.geoTrackService.loadGeoTrackingDataByDate(this.date, this.timeUnit);

    if (!geoTrackData || geoTrackData.length === 0) {
      geoTrackData = new Array();
      geoTrackData.push({
        latitude: 51.163376,
        longitude: 10.447683,
        accuracy: 1,
        altitude: 205,
        date: new Date().toISOString(),
        source: 'default'
      })
    }

    // prepare path data
    let path: Array<Array<number>> = new Array();
    geoTrackData.forEach(gtd => {
      const latlng: Array<number> = new Array();
      latlng.push(gtd.latitude);
      latlng.push(gtd.longitude);
      path.push(latlng);
    });
    const polyline = Leaflet.polyline(path, { color: 'red' }).addTo(this.map);
    this.map.fitBounds(polyline.getBounds());
  }

}

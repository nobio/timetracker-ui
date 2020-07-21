import { Component, OnInit } from '@angular/core';
import { TimeUnit } from '../../model/enums';
import { Util } from 'src/app/lib/Util';
import * as Leaflet from "leaflet";
import { antPath } from "leaflet-ant-path";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import { GeoTrackService } from 'src/app/service/datasource/geo-track.service';
import { GeoTrack } from 'src/app/model/geo-track';
import moment from 'moment';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  date: string; // ISO String representation of the date
  timeUnit: TimeUnit = TimeUnit.day;
  private map: Leaflet.Map;
  private antPathLayer: any;
  private circle: Array<any> = new Array();
  private defaultTrack: any;
  private circleOptions = { radius: 2, fillColor: "#ff9000", color: "#ff7800", weight: 2, opacity: 1 };
  private antPathOptions: { delay: 400, dashArray: [10, 20], weight: 5, color: "#0000FF", pulseColor: "#FFFFFF", paused: false, reverse: false, hardwareAccelerated: true }


  constructor(private geoTrackService: GeoTrackService) {
    // ATTENTION: needed to set this object in the constructor
    // because of the new Date().toISOString() call; it did not 
    // work as long the class has not been instanitated
    // Default is the center of Germany :-)
    this.defaultTrack = {
      latitude: 51.163376,
      longitude: 10.447683,
      accuracy: 1,
      altitude: 205,
      source: 'default',
      date: new Date().toISOString(),
    }

  }

  ionViewDidEnter() {
    // load today's data
    if (!this.map) {
      this.map = Leaflet.map("map");
    }
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "edupala.com © Angular LeafLet",
    }).addTo(this.map);
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
    const startend = this.getStartEndByDateTimeUnit();
    let geoTrackData: Array<GeoTrack> = await this.geoTrackService.loadGeoTrackingDataByDate(
      startend.dtStart,
      startend.dtEnd
    );

    // remove the old polyline layer, otherwise we add one layer over another
    if (this.antPathLayer) {
      this.antPathLayer.remove();
    }
    // remove old circles
    this.circle.forEach(layer => {
      layer.remove();
    });
    // resetting circle Marker
    this.circle = new Array();


    // fill one entry with a defaul value; there will always be at least
    // one entry it iterate later
    if (!geoTrackData || geoTrackData.length === 0) {
      geoTrackData = new Array();
      geoTrackData.push(this.defaultTrack);
    }

    // prepare path data
    let path: Array<Array<number>> = new Array();
    geoTrackData.forEach(gtd => {
      const latlng: Array<number> = new Array();
      latlng.push(gtd.latitude);
      latlng.push(gtd.longitude);
      path.push(latlng);

      if (gtd.accuracy) {
        this.circleOptions.radius = gtd.accuracy;
      }
      const circleLayer = Leaflet.circle(latlng, this.circleOptions).addTo(this.map);

      this.circle.push(circleLayer);
    });

    this.antPathLayer = antPath(path, this.antPathOptions).addTo(this.map);
    this.map.fitBounds(this.antPathLayer.getBounds());
  }

  /**
   * calculates the start date (whicht is this.date) and the
   * end date = this.date + 1xthis.timeUnit
   */
  private getStartEndByDateTimeUnit(): any {
    let dtEnd: string;
    const tUnit: string = TimeUnit[this.timeUnit];
    const dtStart = moment(this.date).format('YYYY-MM-DD');

    if (tUnit === 'year') {
      dtEnd = moment(dtStart).add(1, 'year').format('YYYY-MM-DD');
    } else if (tUnit === 'month') {
      dtEnd = moment(dtStart).add(1, 'month').format('YYYY-MM-DD');
    } else if (tUnit === 'week') {
      dtEnd = moment(dtStart).add(1, 'week').format('YYYY-MM-DD');
    } else if (tUnit === 'day') {
      dtEnd = moment(dtStart).add(1, 'day').format('YYYY-MM-DD');
    }

    return { dtStart: dtStart, dtEnd: dtEnd }

  }
}

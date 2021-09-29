import { Component, OnInit } from '@angular/core';
import { LineStyle, TimeUnit } from '../../models/enums';
import { Util } from 'src/app/libs/Util';
import * as Leaflet from "leaflet";
import { antPath } from "leaflet-ant-path";
import { hotline } from "leaflet-hotline";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon-2x.png";
import { GeoTrackService } from 'src/app/services/datasource/geo-track.service';
import { GeoTrack } from 'src/app/models/geo-track';
import moment from 'moment';
import { TimeBox } from 'src/app/models/time-box';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {
  private timeBox: TimeBox = new TimeBox();
  timeUnit: TimeUnit = TimeUnit.day;
  private map: Leaflet.Map;
  private geoTrackData: GeoTrack[];
  private pathLayer: any;
  private circles: Array<any> = new Array();
  private defaultTrack: any;
  private circleOptions = { radius: 2, fillColor: "#ff9000", color: "#ff7800", weight: 2, opacity: 0 };
  private antPathOptions: { delay: 400, dashArray: [10, 20], weight: 5, color: "#0000FF", pulseColor: "#FFFFFF", paused: false, reverse: false, hardwareAccelerated: true }
  /*
weight - Same as usual. 5 per default.
outlineWidth - The width of the outline along the stroke in pixels. Can be 0. 1 per default.
outlineColor - The color of the outline. 'black' per default.
palette - The config for the palette gradient in the form of { <stop>: '<color>' }. { 0.0: 'green', 0.5: 'yellow', 1.0: 'red' } per default. Stop values should be between 0 and 1.
min - The smallest z value expected in the data array. This maps to the 0 stop value. Any z values smaller than this will be considered as min when choosing the color to use.
max - The largest z value expected in the data array. This maps to the 1 stop value. Any z values greater than this will be considered as max when choosing the color to use.
  */
  //private velocityPathOptions: { weight: 5, outlineWidth: 0.1, /* outlineColor: "#000000", */ palette: { 0.0: '#008800', 0.5: '#ffff00', 1.0: '#ff00ff' }, min: 10.0, max: 40.0 }
  private velocityPathOptions: {
    min: 0,
    max: 100,
    palette: {
      0.0: '#008800',
      0.1: '#ffff00',
      0.2: '#1ab691',
      0.3: '#65ff12',
      0.4: '#ffffff',
      0.5: '#000000',
      0.6: '#987654',
      0.7: '#0923c1',
      0.8: '#a643bc',
      0.9: '#87f100',
      1.0: '#ff0000'
    },
    weight: 5,
    outlineColor: '#000000',
    outlineWidth: 1
  }
  private altitudePathOptions: { weight: 5, outlineWidth: 0.1, /* outlineColor: "#000000", */ palette: { 0.0: 'green', 0.2: 'yellow', 0.7: 'orange', 1.0: 'red' }, min: 0.0, max: 600.0 }
  private lineStyle: string = LineStyle.ANT;
  private reloadDataNeeded = false;

  constructor(
    private geoTrackService: GeoTrackService,
    private toastController: ToastController,
  ) {
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

  // ==== getter/setter for date
  set date(dt: string) {
    this.timeBox.set(dt);
    this.reloadDataNeeded = true;
    this.reInitMap();
  }
  get date(): string {
    return this.timeBox.getDateByTimeUnitISOString(this.timeUnit);
  }
  // ============================

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
    this.reloadDataNeeded = true;
    this.reInitMap();
  }
  /**
   * Sets the current date to today;
   * Please mind that for timeUnit = week we set the date to this week's monday
   */
  public setToday(): any {
    this.date = Util.setToday(this.timeUnit);
    this.reloadDataNeeded = true;
    this.reInitMap();
  }
  /**
   * Method to relaod data regarding it's time unit
   */
  public setDate(): any {
    this.reloadDataNeeded = true;
    this.reInitMap();
  }
  /**
   * add one time unit to current date variable and repaint
   */
  public setAhead(): any {
    this.date = Util.setAhead(this.timeUnit, this.date);
    this.reloadDataNeeded = true;
    this.reInitMap();
  }
  public async setStyle(style: string) {
    this.lineStyle = style;
    this.reInitMap();
  }

  public async showMetaData() {
    const startend = this.getStartEndByDateTimeUnit();

    const metaData = await this.geoTrackService.loadGeoTrackingMetaDataByDate(
      startend.dtStart,
      startend.dtEnd,
    )

    const msg =
      'Gesamtstrecke ' + (metaData.totalDistance / 1000).toFixed(2) + 'km,' +
      ' Abweichung: ' + (metaData.accuracy.stdt / 1000).toFixed(2) + 'km';

    const toast = await this.toastController.create({
      message: msg,
      duration: 3000
    });

    toast.present();
  }

  /**
   * This method implements the reinitialization of the map.
   * Parameter useed: this.lineStyle, date
   */
  private async reInitMap() {
    // load geo tracking data from database 
    await this.loadTrackingData();

    // remove the old polyline layer, otherwise we add one layer over another
    if (this.pathLayer) {
      this.pathLayer.remove();
    }
    // remove old circles
    this.circles.forEach(layer => {
      layer.remove();
    });
    // resetting circle Marker
    this.circles = new Array();


    // prepare path data
    let path: Array<Array<number>> = new Array();
    this.geoTrackData.forEach(gtd => {
      const latlng: Array<number> = new Array();
      latlng.push(gtd.latitude);
      latlng.push(gtd.longitude);

      if (this.lineStyle == LineStyle.ALTITUDE) latlng.push(gtd.altitude);
      if (this.lineStyle == LineStyle.VELOCITY) latlng.push(gtd.velocity);

      path.push(latlng);

      if (gtd.accuracy) {
        this.circleOptions.radius = gtd.accuracy;
      }
      const circleLayer = Leaflet.circle(latlng, this.circleOptions).addTo(this.map);

      this.circles.push(circleLayer);
    });

    if (this.lineStyle == LineStyle.ANT) this.pathLayer = antPath(path, this.antPathOptions).addTo(this.map);
    if (this.lineStyle == LineStyle.VELOCITY) this.pathLayer = hotline(path, this.antPathOptions).addTo(this.map);
    if (this.lineStyle == LineStyle.ALTITUDE) this.pathLayer = hotline(path, this.altitudePathOptions).addTo(this.map);

    console.log(path);
    console.log(this.pathLayer)
    this.map.fitBounds(this.pathLayer.getBounds());
  }

  private async loadTrackingData() {
    if (this.reloadDataNeeded) {
      const startend = this.getStartEndByDateTimeUnit();
      this.geoTrackData = await this.geoTrackService.loadGeoTrackingDataByDate(
        startend.dtStart,
        startend.dtEnd
      );

      // fill one entry with a default value; there will always be at least
      // one entry it iterate later
      if (!this.geoTrackData || this.geoTrackData.length === 0) {
        this.geoTrackData = new Array();
        this.geoTrackData.push(this.defaultTrack);
      }
      this.reloadDataNeeded = false;
    }
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

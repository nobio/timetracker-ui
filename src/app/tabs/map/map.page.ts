import { Component, OnInit } from '@angular/core';
import { ToastController, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import * as Leaflet from "leaflet";
import { antPath } from "leaflet-ant-path";
import { hotline } from "leaflet-hotline";
import * as moment from 'moment';
import { Util } from 'src/app/libs/Util';
import { GeoTrack } from 'src/app/models/geo-track';
import { TimeBox } from 'src/app/models/time-box';
import { Topics, WsReceivable } from 'src/app/models/ws-receivable';
import { GeoTrackService } from 'src/app/services/datasource/geo-track.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { LineStyle, TimeUnit } from '../../models/enums';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements ViewWillEnter, ViewWillLeave, WsReceivable {

  private timeBox: TimeBox = new TimeBox();
  timeUnit: TimeUnit = TimeUnit.day;
  private map: Leaflet.Map;
  private geoTrackData: GeoTrack[];
  private pathLayer: any;
  private circles: Array<any> = new Array();
  private defaultTrack: any;
  private circleOptions = { radius: 2, fillColor: "#ff9000", color: "#ff7800", weight: 2, opacity: 0 };
  private lineStyle: string = LineStyle.ANT;
  private reloadDataNeeded = false;

  constructor(
    private geoTrackService: GeoTrackService,
    private toastController: ToastController,
    private websockService: WebSocketService
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
    };

  }

  ionViewWillEnter() {
    // register at Websocket Service to receive messages
    if (!this.websockService.connected()) {
      console.log('reconnecting Websocket from map.page.ts')
      this.websockService.initWebsocketConnection();
    }
    this.websockService.register(this);
  }
  ionViewWillLeave() {
    // unregister a listener
    this.websockService.unregister(this);
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
      this.map = Leaflet.map('map');
    }
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "edupala.com © Angular LeafLet",
    }).addTo(this.map);
    this.setToday();
  }

  /**
   * implements WsReceivable
   * @param data the data received by WebSocket; expexted to contain a GeoTrack object
   */
  receiveWebsocketMessage(data: any): void {
    console.log(`Maps class received data: ${JSON.stringify(data)}`);
    const loc: GeoTrack = data.message; // expect a GeoTrack JSON
    this.geoTrackData.push(loc);
    this.reloadDataNeeded = false;
    this.reInitMap();
  }

  /**
   * implements WsReceivable
   * @returns the topic this class is interested in
   */
  topic(): Topics {
    return Topics.GEOLOC;
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


    if (this.lineStyle == LineStyle.ANT) this.pathLayer = antPath(path, this.getAntPathOptions(this.geoTrackData)).addTo(this.map);
    if (this.lineStyle == LineStyle.VELOCITY) this.pathLayer = hotline(path, this.getVelocityPathOptions(this.geoTrackData)).addTo(this.map);
    if (this.lineStyle == LineStyle.ALTITUDE) this.pathLayer = hotline(path, this.getAltitudePathOptions(this.geoTrackData)).addTo(this.map);

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

  private getAntPathOptions(data: any): any {
    return { delay: 400, dashArray: [10, 20], weight: 5, color: "#0000FF", pulseColor: "#FFFFFF", paused: false, reverse: false, hardwareAccelerated: true };
  }

  private getVelocityPathOptions(data: any): any {
    const vel: number[] = data.map(d => d.velocity);
    const max = Math.max(...vel);
    const min = Math.min(...vel);

    return { min: min, max: max, weight: 5, outlineColor: '#000000', outlineWidth: 1 }
  }

  private getAltitudePathOptions(data: GeoTrack[]): any {
    const alt: number[] = data.map(d => d.altitude);
    const max = Math.max(...alt);
    const min = Math.min(...alt);

    return {
      weight: 5, outlineWidth: 0.1, /* outlineColor: "#000000", */ palette: {
        0.0: 'green',
        0.2: 'yellow',
        0.7: 'orange',
        1.0: 'red'
      }, min: min, max: max

    }
  }
}
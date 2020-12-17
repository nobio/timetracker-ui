import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyReader extends BaseService {

  private props = new Map();

  /** temporary hard coded protperties */

  constructor(public httpClient: HttpClient, alertCtrl: AlertController) {
    super(alertCtrl);
    this.props.set('de.nobio.timetracker.FILL', 'true');  // get Statistics with fill = true (see StatisticsService.loadStatisticDataByUnit(...))
  }

  public get(key: string): string {
    // console.log(`Property to get: ${key} reads value ${this.props.get(key)}`)
    return this.props.get(key);
  }
  public set(key: string, value: string): void {
    // console.log(`Property to set: ${key} with value ${value}`)
    this.props.set(key, value);
  }
}

import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { catchError, retry } from "rxjs/operators";
import { ServerInformation } from "src/app/model/server-information";
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: "root",
})
export class StatusService extends BaseService {
  public serverInfo = new ServerInformation();

  constructor(public httpClient: HttpClient, alertCtrl: AlertController) {
    super(alertCtrl);
    this.serverInfo.baseUrl = this.baseUrl;
  }

  /**
   * asks for online status and stores in in local variable "onlineStatus"
   */
  ping(): void {
    this.httpClient
      .get(super.baseUrl + "/api/ping", super.httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (res) => {
          console.log(res);
          this.serverInfo.isOnline = true;
        },
        (err) => {
          console.log("failed to check online status " + err);
          this.serverInfo.isOnline = false;
        }
      );
  }

  /**
   * load the server version information (from the server, of course)
   */
  loadServerInformation() {
    console.log("loading server version");

    this.httpClient
      .get(super.baseUrl + "/api/version", super.httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (data) => {
          this.serverInfo.serverBuildVersion = data['version'];
          this.serverInfo.serverBuildTime = data['last_build'];
          console.log(this.serverInfo);
        },
        (err) => {
          console.log(err);
          console.log(err._body);
          err = err._body;
        }
      );
    this.httpClient
      .get(super.baseUrl + "/api/toggles/status", super.httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (status) => {
          console.log("loaded toggle status: ");
          this.serverInfo.isSlackEnabled = status['NOTIFICATION_SLACK'];
        },
        (err) => {
          console.log("failed to load toggle status " + err);
          this.serverInfo.isSlackEnabled = false;
        }
      );
  }
}

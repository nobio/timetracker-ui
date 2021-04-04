import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, retry } from "rxjs/operators";
import { ServerInformation } from "src/app/model/server-information";
import { AlertController } from '@ionic/angular';
import { LogService } from "../log.service";

@Injectable({
  providedIn: "root",
})
export class StatusService extends BaseService {
  public serverInfo = new ServerInformation();

  constructor(public httpClient: HttpClient, alertCtrl: AlertController, logger: LogService) {
    super(alertCtrl, logger);
    this.serverInfo.baseUrl = this.baseUrl;
  }

  /**
   * asks for online status and stores in in local variable "onlineStatus"
   */
  ping(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'rejectUnauthorized': 'false',
        'insecure': 'true',
      })
    }
  
    this.httpClient
      .get(super.baseUrl + "/api/ping", httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (res) => {
          this.logger.log(res, false, 'ping');
          this.serverInfo.isOnline = true;
        },
        (err) => {
          this.logger.log("failed to check online status " + err, true, 'Ping');
          this.serverInfo.isOnline = false;
        }
      );
  }

  /**
   * load the server version information (from the server, of course)
   */
  loadServerInformation() {

    this.httpClient
      .get(super.baseUrl + "/api/version", this.httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (data) => {
          this.serverInfo.serverBuildVersion = data['version'];
          this.serverInfo.serverBuildTime = data['last_build'];
          this.logger.log(this.serverInfo);
        },
        (err) => {
          this.logger.log(err);
          this.logger.log(err._body);
          err = err._body;
        }
      );

    this.httpClient
      .get(super.baseUrl + "/api/toggles/status", this.httpOptions)
      .pipe(retry(2), catchError(super.handleError))
      .subscribe(
        (status) => {
          this.serverInfo.isSlackEnabled = status['NOTIFICATION_SLACK'];
          this.logger.log("loaded toggle status: " + JSON.stringify(status));
        },
        (err) => {
          this.serverInfo.isSlackEnabled = false;
          this.logger.log("failed to load toggle status " + err);
        }
      );
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from '@ionic/angular';
import { catchError, retry } from "rxjs/operators";
import { ServerInformation } from "src/app/models/server-information";
import { LogService } from "../log.service";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root",
})
export class StatusService extends DatabaseService {
  public serverInfo = new ServerInformation();

  constructor(protected httpClient: HttpClient, protected alertCtrl: AlertController, protected logger: LogService) {
    super(httpClient, alertCtrl, logger);
  }

  /**
   * asks for online status and stores in in local variable "onlineStatus"
   */
  ping(): void {
  
    this.GET('/api/ping', {}, false)
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

    this.GET('/api/version')
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

    this.GET('/api/toggles/status')
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

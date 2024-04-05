import moment from "moment";
import { OnlineSignal } from "./enums";

const YELLOW_DELAY = 10000;  // after 10 sec green status becomes yellow

export class ServerInformation {
  public serverBuildVersion: string = 'n.a.';
  public serverBuildTime: Date;
  public isSlackEnabled: boolean = false;
  private _isOnline: boolean = false;
  public baseUrl: string;
  public env: string;
  public buildVersion: string;
  public lastUpdate: Date;

  constructor() {
    this.lastUpdate = new Date();
  }

  public set isOnline(online: boolean) {
    this._isOnline = online;
    this.lastUpdate = new Date();
  }
  public get isOnline(): boolean {
    return this._isOnline;
  }

  public get onlineSignal(): OnlineSignal {
    const diffDate = (new Date().getTime() - this.lastUpdate.getTime());

    if (!this.isOnline) return OnlineSignal.RED;
    if (this.isOnline && diffDate >= YELLOW_DELAY) return OnlineSignal.YELLOW;
    if (this.isOnline && diffDate < YELLOW_DELAY) return OnlineSignal.GREEN;
  }

  public get serverBuildTimeAsString(): string {
    if (this.serverBuildTime) {
      return moment(this.serverBuildTime).format("DD.MM.YYYY HH:mm:ss");
    } else {
      return undefined;
    }
  }

}

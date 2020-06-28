import moment from "moment";

export class ServerInformation {
  public serverBuildVersion: string = 'n.a.';
  public serverBuildTime: Date;
  public isSlackEnabled: boolean = false;
  public isOnline: boolean = false;
  public baseUrl: string;
  public env: string;
  public buildVersion: string;


  public get serverBuildTimeAsString(): string {
    if (this.serverBuildTime) {
      return moment(this.serverBuildTime).format("DD.MM.YYYY HH:mm:ss");
    } else {
      return undefined;
    }
  }
}

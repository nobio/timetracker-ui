import { Component } from "@angular/core";
import moment from 'moment';
import { AuthService } from '../../services/datasource/auth.service';
import { StatusService } from "../../services/datasource/status.service";
@Component({
  selector: "app-about",
  templateUrl: "about.page.html",
  styleUrls: ["about.page.scss"],
})
export class AboutPage {
  expireRefresh: string = '';
  expireAccess: string = '';
  intervalId: NodeJS.Timeout;

  constructor(public statusSrv: StatusService, public authSrv: AuthService) { }

  ionViewWillEnter() {
    this.statusSrv.ping();
    this.statusSrv.loadServerInformation();

    // start interval
    this.intervalId = setInterval(() => {
      const accessToken = this.authSrv.getAccessToken();
      const refreshToken = this.authSrv.getRefresehToken();
      const now = Math.floor(moment().valueOf() / 1000); // now in seconds

      if (accessToken && refreshToken) {
        const deltaACC = moment.duration(moment(accessToken['exp'] * 1000).diff(moment()));
        const deltaREF = moment.duration(moment(refreshToken['exp'] * 1000).diff(moment()));

        this.expireRefresh = `${deltaREF.get('days')} Tage ${deltaREF.get('hours')}:${deltaREF.get('minutes')}:${deltaREF.get('seconds')}`;
        this.expireAccess = `${deltaACC.get('minutes')}:${deltaACC.get('seconds')} s`;
      }
    }, 1000);

  }

  ionViewWillLeave() {
    // stop interval
    clearInterval(this.intervalId);
  }

}

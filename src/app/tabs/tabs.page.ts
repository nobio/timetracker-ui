import { Component } from "@angular/core";
import { StatusService } from "../services/datasource/status.service";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  constructor(private statusSrv: StatusService) {
    this.startOnlineStatusThread();
  }

  /**
   * Repetitive task (check server status, ...)
   */
  private startOnlineStatusThread() {
    this.statusSrv.ping();
    setInterval(() => {
      this.statusSrv.ping();
      //setInterval(() => { this.statusSrv.serverInfo.lastUpdate = new Date() }, 2000) // update timestamp several times within the ping period
    }, 20000);
  }
}

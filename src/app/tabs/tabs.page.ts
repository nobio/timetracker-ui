import { Component } from "@angular/core";
import { StatusService } from "../service/datasource/status.service";

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
    }, 20000);
  }
}

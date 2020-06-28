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

  private startOnlineStatusThread() {
    setInterval(() => {
      this.statusSrv.ping();
    }, 20000);
  }
}

import { Component } from "@angular/core";
import { StatusService } from "../../services/datasource/status.service";

@Component({
  selector: "app-about",
  templateUrl: "about.page.html",
  styleUrls: ["about.page.scss"],
})
export class AboutPage {
  constructor(public statusSrv: StatusService) {}

  ionViewWillEnter() {
    this.statusSrv.ping();
    this.statusSrv.loadServerInformation();
  }
}

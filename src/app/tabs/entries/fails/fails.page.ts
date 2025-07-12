import { Component, OnInit } from "@angular/core";
import { TimeEntriesService } from "src/app/services/datasource/time-entries.service";
import { FailDate } from 'src/app/models/fail-date';
import { LogService } from "src/app/services/log.service";
import { IonicModule } from "@ionic/angular";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-fails",
  templateUrl: "./fails.page.html",
  styleUrls: ["./fails.page.scss"],
  imports: [
    IonicModule,
    RouterLink,
    DatePipe
  ],
})
export class FailsPage {

  failDates: Array<FailDate>

  constructor(private timeEntrySrc: TimeEntriesService, private logger: LogService) { }

  ionViewWillEnter() {
    this.timeEntrySrc
      .loadDatesWithFailedEntries()
      .then((fds) => this.failDates = fds)
      .catch((err) => this.logger.log(err))
  }

}

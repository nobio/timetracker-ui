import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogEntity } from 'src/app/model/log-entity';
import { LogQueueService } from 'src/app/service/datasource/log-queue.service';

@Component({
  selector: 'app-logs-details',
  templateUrl: './logs-details.page.html',
  styleUrls: ['./logs-details.page.scss'],
})
export class LogsDetailsPage {

  public logEntry: LogEntity

  constructor(
    public logQueue: LogQueueService,
    private route: ActivatedRoute,
  ) { 
    this.logEntry = this.logQueue.loadById(this.route.snapshot.params.id);
    console.log(this.logEntry)
  }

}

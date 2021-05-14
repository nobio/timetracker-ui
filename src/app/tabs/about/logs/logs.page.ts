import { Component, OnInit } from '@angular/core';
import { LogEntity } from 'src/app/models/log-entity';
import { LogQueueService } from 'src/app/services/datasource/log-queue.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
})
export class LogsPage {

  constructor(public logQueue: LogQueueService) { }

  public listAll(): LogEntity[] {
    return this.logQueue.listAll();
  }

}

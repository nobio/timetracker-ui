import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogEntity } from 'src/app/models/log-entity';
import { LogQueueService } from 'src/app/services/datasource/log-queue.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.page.html',
  styleUrls: ['./logs.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule,
    DatePipe
  ],
})
export class LogsPage {

  constructor(public logQueue: LogQueueService) { }

  public listAll(): LogEntity[] {
    return this.logQueue.listAll();
  }

}

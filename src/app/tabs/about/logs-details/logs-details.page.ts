import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { LogEntity } from 'src/app/models/log-entity';
import { LogQueueService } from 'src/app/services/datasource/log-queue.service';

@Component({
  selector: 'app-logs-details',
  templateUrl: './logs-details.page.html',
  styleUrls: ['./logs-details.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule,
    DatePipe,
  ],
})
export class LogsDetailsPage {

  public logEntry: LogEntity

  constructor(
    public logQueue: LogQueueService,
    private route: ActivatedRoute,
  ) {
    this.logEntry = this.logQueue.loadById(this.route.snapshot.params['id']);
    console.log(this.logEntry)
  }

}

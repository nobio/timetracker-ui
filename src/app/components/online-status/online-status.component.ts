import { Component, OnInit, Input } from '@angular/core';
import { StatusService } from '../../services/datasource/status.service';
import { OnlineSignal } from 'src/app/models/enums';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'online-status-component',
  templateUrl: './online-status.component.html',
  styleUrls: ['./online-status.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],
})
export class OnlineStatusComponent implements OnInit {
  @Input() displaySize: string;

  constructor(public statusSrv: StatusService) {
    // update the status every 2 seconds; wenn online status is expired it automatically 
    // switches to yellow and the web site icon will be updated
    setInterval(() => { this.statusSrv.serverInfo.onlineSignal }, 2000);
  }

  ngOnInit() {
    this.statusSrv.ping();
    this.statusSrv.loadServerInformation();
  }

  get onlineStatusColor(): string {
    if (this.statusSrv.serverInfo.onlineSignal === OnlineSignal.GREEN) return 'success';
    if (this.statusSrv.serverInfo.onlineSignal === OnlineSignal.YELLOW) return 'warning';
    if (this.statusSrv.serverInfo.onlineSignal === OnlineSignal.RED) return 'danger';
    return 'medium'; // default color
  }
  get onlineStatusSymbol(): string {
    if (this.statusSrv.serverInfo.onlineSignal === OnlineSignal.GREEN) return 'thumbs-up';
    if (this.statusSrv.serverInfo.onlineSignal === OnlineSignal.YELLOW) return 'thumbs-up';
    if (this.statusSrv.serverInfo.onlineSignal === OnlineSignal.RED) return 'thumbs-down';
    return 'help'; // default symbol
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { StatusService } from '../service/datasource/status.service';

@Component({
  selector: 'online-status-component',
  templateUrl: './online-status.component.html',
  styleUrls: ['./online-status.component.scss'],
})
export class OnlineStatusComponent implements OnInit {
  @Input() displaySize: string;

  constructor(public statusSrv: StatusService) { }

  ngOnInit() {
  }

}

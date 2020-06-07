import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  constructor() {}

  public date = new Date();
  public localDate;
  public enter() {}
  public leave() {}
  public setYesterday() {}
  public setToday() {}
  public setTomorrow() {}
  public showTimeEntryErrors() {}
}

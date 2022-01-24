import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { Chart } from "chart.js";
import { Util } from 'src/app/libs/Util';
import { Direction } from 'src/app/models/enums';
import { Statistics } from 'src/app/models/statistics';
import { StatisticsService } from 'src/app/services/datasource/statistics.service';

@Component({
  selector: 'app-come-go',
  templateUrl: './come-go.page.html',
  styleUrls: ['./come-go.page.scss'],
})
export class ComeGoPage {
  @ViewChild("lineCanvas") lineCanvas;

  private lineChart: Chart;
  private _interval: number = 40;
  private _direction: Direction = undefined;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private statsSrv: StatisticsService,
    private actionSheetCtrl: ActionSheetController,
  ) { }

  ionViewDidEnter() {
    // initialize Graph
    this.initGraph();
    // load today's data
    this.loadGraphData();
  }

  /* setter/getter for _interval */
  set interval(interval: number) {
    if (interval < 1) {
      this._interval = 1; // minimum value is 1
    } else {
      this._interval = interval;
    }
    this.loadGraphData();
  }
  get interval(): number {
    return this._interval;
  }

  /* setter/getter for _direction */
  set direction(direction: Direction) {
    if ('all' === direction.toString()) {
      this._direction = undefined;  // 'all' is not in Direction enum. We need to translate to undefined
    } else {
      this._direction = direction;
    }
    this.loadGraphData();
  }
  get direction(): Direction {
    return this._direction;
  }

  /**
   * initializes Graph object; data and labels are missing!
   */
  private initGraph() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "bar",
      data: {
        datasets: [
          {
            label: "Anwesenheit pro Zeiteinheit",
            backgroundColor: "rgb(52, 102, 189)",
            borderColor: "rgb(52, 102, 189)",
            hoverBackgroundColor: "rgb(6, 175, 34)",
            hoverBorderColor: "rgb(6, 175, 34)",
            hoverBorderWidth: 4,
            data: [{ x: 0, y: 0 }],
          }
        ]
      },
      options: {
        responsive: true,
      }
    });
  }

  /**
   * Loads statisctic data
   */
  private loadGraphData() {

    this.statsSrv.loadStatisticHistogramDataByInterval(this.interval, this.direction)
      .then((resp: Statistics) => {
        //this.logger.log(resp);
        this.updateGraph(resp, this.lineChart);
      })
      .catch((error: string) => {
        Util.alert(this.alertCtrl, error);
        //this.logger.log(error);
      });

  }

  /**
   * takes statistics data and updates the Graph accordingly
   * @param stats statistic data
   */
  private updateGraph(stats: Statistics, lineChart: any) {
    let label: string[] = [];
    let data: number[] = [];

    for (let n = 0; n < stats.data.length; n++) {
      // reverse data order because server delivers data with the latest upfront
      // label.push(new Date(stats.data[n].x).toLocaleDateString());
      label.push(stats.data[n].x);
      data.push(stats.data[n].y);
    }

    lineChart.data.labels = label;
    lineChart.data.datasets[0].data = data;
    lineChart.update({
      duration: 600,
      easing: "easeOutBounce"
    });
  }

  async showDirectionDialog() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Richtung (Kommen/Gehen)',
      buttons: [
        { text: 'Alle', handler: () => { this.direction = Direction.none } },
        { text: 'Kommen', icon: 'enter', handler: () => { this.direction = Direction.enter } },
        { text: 'Gehen', icon: 'exit', handler: () => { this.direction = Direction.go } },
        { text: 'Abbrechen', role: 'cancel' }
      ]
    });

    await actionSheet.present();
  }

}

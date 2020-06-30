import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { StatisticsService } from 'src/app/service/datasource/statistics.service';
import { BreakTimes } from 'src/app/model/break-time';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-breaktime',
  templateUrl: './breaktime.page.html',
  styleUrls: ['./breaktime.page.scss'],
})
export class BreaktimePage {

  @ViewChild("lineCanvas") lineCanvas;

  ionViewDidEnter() {
    // initialize Graph
    this.initGraph();
    // load today's data
    this.loadGraphData();
  }

  private lineChart: Chart;
  private _interval:number = 5;
  private _realData:boolean = true;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private statsSrv: StatisticsService,
  ) {}

  set realData(realData: boolean) {
    if(realData != this._realData) {
      //console.log('set realData: ' + realData);
      this._realData = realData;
      this.loadGraphData();
    }
  }
  get realData(): boolean {
    //console.log('get realData: ' + this._realData);
    return this._realData;
  }

  /* setter/getter for _interval */
  set interval(interval: number) {
    if(interval < 1) {
      this._interval = 1; // minimum value is 1
    } else {
      this._interval = interval;
    }
    this.loadGraphData();
  }
  get interval(): number {
    return this._interval;
  }

  /**
   * initializes Graph object; data and labels are missing!
   */
  private initGraph() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "bar",
      responsive: true,
      data: {
        datasets: [
          {
            label: "Pausendauer pro Minute",
            fill: false,
            backgroundColor: "rgb(52, 102, 189)",
            borderColor: "rgb(52, 102, 189)",
            hoverBackgroundColor: "rgb(6, 175, 34)",
            hoverBorderColor: "rgb(6, 175, 34)",
            hoverBorderWidth: 4
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                maxRotation: 60
              }
            }
          ]
        }
      }
    });
  }

  /**
   * Loads statisctic data
   */
  private loadGraphData() {

    this.statsSrv.loadStatisticBreakTime(this._realData, this._interval)
      .then((resp: BreakTimes) => {
        //console.log(resp);
        this.updateGraph(resp, this.lineChart);
      })
      .catch((error: string) => {
        //Util.showAlert(error, this.alertCtrl);
        console.error(error)
      });

    }

  /**
   * takes statistics data and updates the Graph accordingly
   * @param stats statistic data
   */
  private updateGraph(stats: BreakTimes, lineChart: any) {
    let label: string[] = [];
    let data: number[] = [];

    for (let n = 0; n < stats.data.length; n++) {
      // reverse data order because server delivers data with the latest upfront
      // label.push(new Date(stats.data[n].x).toLocaleDateString());
      label.push(stats.data[n].time + ' min');
      data.push(stats.data[n].breakTime);
    }

    lineChart.data.labels = label;
    lineChart.data.datasets[0].data = data;
    lineChart.update({
      duration: 600,
      easing: "easeOutBounce"
    });
  }
    

}

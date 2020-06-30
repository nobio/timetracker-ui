import { Component, OnInit, ViewChild } from "@angular/core";
import { TimeUnit } from "src/app/model/enums";
import { Statistics } from "src/app/model/statistics";
import { isDate } from "util";
import { Chart } from "chart.js";
import { NavController, AlertController } from '@ionic/angular';
import { StatisticsService } from 'src/app/service/datasource/statistics.service';
import { Direction } from "../../../model/enums";

@Component({
  selector: "app-aggregat",
  templateUrl: "./aggregat.page.html",
  styleUrls: ["./aggregat.page.scss"],
})
export class AggregatPage {
  @ViewChild("lineCanvas") lineCanvas;

  private lineChart: Chart;
  timeUnit: TimeUnit = TimeUnit.month;


  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private statsSrv: StatisticsService,
  ) { }

  ionViewDidEnter() {
    // initialize Graph
    this.initGraph();
    // load today's data
    this.loadGraphData();
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
            label: "Anwesenheit",
            fill: false,
            backgroundColor: "rgba(255,159,64, 0.5)",
            borderColor: "rgba(255,159,64, 0.9)",
            hoverBackgroundColor: "rgba(255,159,64, 0.9)",
            hoverBorderColor: "rgba(255,159,64, 0.9)",
            hoverBorderWidth: 4,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              ticks: {
                maxRotation: 60,
              },
            },
          ],
        },
      },
    });
  }

  /**
   * Loads statisctic data
   */
  private loadGraphData() {
    this.statsSrv.loadStatisticAggregatedDataByUnit(this.timeUnit)
      .then((resp: Statistics) => {
        console.log(resp);
        this.updateGraph(resp, this.lineChart);
      })
      .catch((error: string) => {
        //Util.showAlert(error, this.alertCtrl);
        console.log(error);
      });
  }
  /**
   * takes statistics data and updates the Graph accordingly
   * @param stats statistic data
   */
  private updateGraph(stats: Statistics, lineChart: any) {
    let label: string[] = [];
    let data: number[] = [];
    let yMax: number = 0;
    let yMin: number = 1000;

    for (let n = 0; n < stats.data.length; n++) {
      // reverse data order because server delivers data with the latest upfront
      //      label.push(stats.data[n].x);
      if (isDate(stats.data[n].x)) {
        label.push(new Date(stats.data[n].x).toLocaleDateString());
      } else {
        label.push(stats.data[n].x);
      }
      data.push(stats.data[n].y);

      yMax = stats.data[n].y > yMax ? stats.data[n].y : yMax;
      yMin = stats.data[n].y < yMin ? stats.data[n].y : yMin;
    }

    // recalculate min
    yMin = yMin - yMin / 100; // substract 1% of the value
    yMin = Math.floor(yMin * 10) / 10; // round down but taking the 1 decimal digit after comma into account (8,453 -> 84,53 -> 84 -> 8,4)

    lineChart.data.labels = label;
    lineChart.data.datasets[0].data = data;

    if (this.timeUnit == TimeUnit.weekday) {
      const rndBackColor: string = this.getRandomRGBa();
      const rndBorderColor: string = "rgba(0,0,0,0.7)";

      lineChart.data.datasets[0].backgroundColor = rndBackColor;
      lineChart.data.datasets[0].hoverBackgroundColor = rndBackColor;

      lineChart.data.datasets[0].borderColor = rndBorderColor;
      lineChart.data.datasets[0].hoverBorderColor = rndBorderColor;
    }

    //lineChart.options.scales.yAxes[0].ticks.max = max;
    lineChart.options.scales.yAxes[0].ticks.min = yMin;
    lineChart.data.datasets[0].label =
      lineChart.options.scales.yAxes[0].ticks.min;
    lineChart.update({
      duration: 600,
      easing: "easeOutBounce",
    });
  }

  private getRandomRGBa(): string {
    const r = Math.floor(Math.random() * 256); // Random number between [0..255]
    const g = Math.floor(Math.random() * 256); // Random number between [0..255]
    const b = Math.floor(Math.random() * 256); // Random number between [0..255]
    const t = Math.random() * 0.5 + 0.5; // Random number between [0.5 .. 1.0]

    return "rgba(" + r + "," + g + "," + b + "," + t + ")";
  }

  setTimeUnit() {
    //console.log(this.timeUnit);
    this.loadGraphData();
  }

}

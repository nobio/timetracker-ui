import { Component, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import { Util } from 'src/app/libs/Util';
import { TimeUnit } from "src/app/models/enums";
import { Statistics } from "src/app/models/statistics";
import { StatisticsService } from 'src/app/services/datasource/statistics.service';
import { LogService } from "src/app/services/log.service";

@Component({
  selector: "app-aggregat",
  templateUrl: "./aggregat.page.html",
  styleUrls: ["./aggregat.page.scss"],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule,
  ],
  standalone: true,
})
export class AggregatPage {
  @ViewChild("lineCanvas") lineCanvas;

  private chart: Chart;
  timeUnit: TimeUnit = TimeUnit.month;


  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private statsSrv: StatisticsService,
    private logger: LogService
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

    this.chart = new Chart(this.lineCanvas.nativeElement, {
      type: "bar",
      data: {
        datasets: [
          {
            label: "Anwesenheit",
            backgroundColor: 'rgba(255,159,64, 0.5)',
            borderColor: 'rgba(255,159,64, 0.9)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,159,64, 0.9)',
            hoverBorderColor: 'rgba(255,159,64, 0.9)',
            hoverBorderWidth: 4,
            data: [{ x: 0, y: 0 }]
          },
          {
            label: 'Durchschnitt',
            borderColor: 'rgba(0,0,0, 0.9)',
            borderWidth: 1,
            //backgroundColor: 'rgba(255,250,225, 0.2)', // array should have same number of elements as number of dataset
            hidden: true,
            data: [{ x: 0, y: 0 }]
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        }
      },
    });
  }

  /**
   * Loads statisctic data
   */
  private loadGraphData() {
    this.statsSrv.loadStatisticAggregatedDataByUnit(this.timeUnit)
      .then((resp: Statistics) => {
        //this.logger.log(resp);
        this.updateGraph(resp, this.chart);
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
  private updateGraph(stats: Statistics, chart: Chart) {
    let label: string[] = [];
    let data: number[] = [];
    let movingAvg: number[] = [];

    let yMax: number = 0;
    let yMin: number = 1000;

    for (let n = 0; n < stats.data.length; n++) {
      // reverse data order because server delivers data with the latest upfront
      //      label.push(stats.data[n].x);
      // console.log(stats.data[n]);
      if (moment.isDate(stats.data[n].x)) {
        label.push(new Date(stats.data[n].x).toLocaleDateString());
      } else {
        label.push(stats.data[n].x);
      }
      data.push(stats.data[n].y);
      movingAvg.push(stats.compData[n].y);

      yMax = stats.data[n].y > yMax ? stats.data[n].y : yMax;
      yMin = stats.data[n].y < yMin ? stats.data[n].y : yMin;
    }

    chart.options.scales['y'].min = Util.min(data);
    chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.data.datasets[1].data = movingAvg;

    //console.log(lineChart.data.datasets[0].data);
    //console.log(lineChart.data.datasets[1].data);

    if (this.timeUnit == TimeUnit.month || TimeUnit.weekday || this.timeUnit == TimeUnit.year) {
      chart.config['type'] = 'bar';
      chart.getDatasetMeta(1).hidden = true;
    } else {
      chart.config['type'] = 'line';
      chart.getDatasetMeta(1).hidden = false;
    }

    chart.update('default');
  }

  setTimeUnit() {
    //this.logger.log(this.timeUnit);
    this.loadGraphData();
  }

}

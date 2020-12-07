import { Component, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TimeUnit, SwipeDirection } from '../../model/enums';
import { StatisticsService } from '../../service/datasource/statistics.service';
import { Statistics } from '../../model/statistics';
import { Chart } from 'chart.js';
import { Util } from '../../lib/Util';
import { TimeBox } from 'src/app/model/time-box';

const CHART_TYPES: Array<string> = ['line', 'bar', 'radar'];

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss']
})

export class StatsPage {

  @ViewChild("lineCanvas") lineCanvas;

  lineChart: Chart;
  private timeBox: TimeBox = new TimeBox();
  timeUnit: TimeUnit = TimeUnit.month;
  private _accumulate: boolean = false;

  constructor(
    private statsSrv: StatisticsService,
    private alertCtrl: AlertController
  ) { }

  // ==== getter/setter for date
  set date(dt: string) {
    this.timeBox.set(dt);
    this.loadGraphData();
  }
  get date(): string {
    return this.timeBox.getDateByTimeUnitISOString(this.timeUnit);
  }
  // ============================

  ionViewDidEnter() {
    // initialize Graph
    this.initGraph();
    // load today's data
    this.setToday();
  }

  /**
 * substract one time unit to current date variable and repaint
 */
  public setBefore(): any {
    this.date = Util.setBefore(this.timeUnit, this.date);
    this.loadGraphData();
  }
  /**
   * Sets the current date to today;
   * Please mind that for timeUnit = week we set the date to this week's monday
   */
  public setToday(): any {
    this.date = Util.setToday(this.timeUnit);
    this.loadGraphData();
  }
  /**
   * Method to relaod data regarding it's time unit
   */
  public setDate(): any {
    this.loadGraphData();
  }
  /**
   * add one time unit to current date variable and repaint
   */
  public setAhead(): any {
    this.date = Util.setAhead(this.timeUnit, this.date);
    this.loadGraphData();
  }


  set accumulate(accumulate: boolean) {
    this._accumulate = accumulate;
    this.loadGraphData();
  }
  get accumulate(): boolean {
    return this._accumulate;
  }

  swipe(event: any) {
    console.log("I have been swiped to " + event.direction);
    if (event.direction === SwipeDirection.LEFT) {
      this.setAhead();
    } else if (event.direction === SwipeDirection.RIGHT) {
      this.setBefore();
    }
  }

  toggleChartType() {
    // line, bar, radar
    const oldType = this.lineChart.config.type;
    let idx = CHART_TYPES.indexOf(this.lineChart.config.type) + 1;
    if (idx >= CHART_TYPES.length) idx = 0;
    if (oldType === 'radar') this.initGraph();
    this.lineChart.config.type = CHART_TYPES[idx];
    this.lineChart.update({
      duration: 600,
      easing: "easeOutBounce"
    });
    if (oldType === 'radar') this.loadGraphData();

  }

  /**
   * initializes Graph object; data and labels are missing!
   */
  private initGraph() {
    console.log(CHART_TYPES[0])
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: CHART_TYPES[0],
      responsive: true,
      data: {
        datasets: [
          {
            label: "Anwesenheit",
            fill: false,
            lineTension: 0.4,
            //backgroundColor: "rgba(148, 159, 177, 0.2)",
            //borderColor: "rgba(148, 159, 177, 1)",
            backgroundColor: 'rgb(38, 194, 129, 1)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(38, 194, 129)',// array should have same number of elements as number of dataset
            //pointBackgroundColor: "rgba(148, 159, 177, 1)",
            pointBackgroundColor: "rgba(148, 10, 19, 1)",

            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(148, 159, 177, 0.8)",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "bevel",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 3,
            pointHitRadius: 30,
            pointStyle: "circle",
            spanGaps: true,
            cubicInterpolationMode: "monotone",
          },
          {
            label: "Durchschnitt",
            pointRadius: 0,
            backgroundColor: 'rgba(255,250,225, 1)', // array should have same number of elements as number of dataset
          }
        ]
      },
      //this.lineChart.options.legend.display = false;
      options: {
        legend: {
          display: false
        }
      },
    });
  }


  /**
   * Loads statisctic data
   */
  private loadGraphData() {
    this.statsSrv.loadStatisticDataByUnit(this.date, this.timeUnit, this.accumulate)
      .then((resp: Statistics) => {
        //console.log(resp);
        this.updateGraph(resp, this.lineChart);
      })
      .catch((error: string) => {
        Util.alert(this.alertCtrl, error);
      });
  }

  /**
 * takes statistics data and updates the Graph accordingly
 * @param stats statistic data
 */
  private updateGraph(stats: Statistics, lineChart: Chart) {
    let label: string[] = [];
    let data: number[] = [];
    let avg: number[] = [];

    for (let n = 0; n < stats.data.length; n++) {
      // label.push(stats.data[n].x);
      label.push(new Date(stats.data[n].x).toLocaleDateString());
      data.push(stats.data[n].y);
      if (this.accumulate) {
        avg.push(stats.compData[n].y);
      } else {
        avg.push(stats.averageWorkingTime);
      }
    }

    lineChart.data.labels = label;
    lineChart.data.datasets[0].data = data;
    lineChart.data.datasets[1].data = avg;
    lineChart.update({
      duration: 600,
      easing: "easeOutBounce"
    });
  }

}

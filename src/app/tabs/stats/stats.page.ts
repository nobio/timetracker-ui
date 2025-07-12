import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import { OnlineStatusComponent } from 'src/app/components/online-status/online-status.component';
import { TimeBox } from 'src/app/models/time-box';
import { PropertyReader } from 'src/app/services/datasource/property-reader.service';
import { LogService } from 'src/app/services/log.service';
import { Util } from '../../libs/Util';
import { SwipeDirection, TimeUnit } from '../../models/enums';
import { Statistics } from '../../models/statistics';
import { StatisticsService } from '../../services/datasource/statistics.service';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    RouterModule,
    OnlineStatusComponent,
    DatePipe
  ],
  standalone: true,
})

export class StatsPage {

  @ViewChild("graphCanvas") graphCanvas;

  chart: Chart;
  private timeBox: TimeBox = new TimeBox();
  timeUnit: TimeUnit = TimeUnit.month;
  private _accumulate: boolean = false;

  constructor(
    private statsSrv: StatisticsService,
    private alertCtrl: AlertController,
    private props: PropertyReader,
    private logger: LogService
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

  get fill(): boolean {
    return this.props.get('de.nobio.timetracker.FILL') === 'true';
  }

  swipe(event: any) {
    this.logger.log("I have been swiped to " + event.direction);
    if (event.direction === SwipeDirection.LEFT) {
      this.setAhead();
    } else if (event.direction === SwipeDirection.RIGHT) {
      this.setBefore();
    }
  }


  /**
   */
  private initGraph() {
    if (this.chart != null) this.chart.destroy();

    this.chart = new Chart(this.graphCanvas.nativeElement, {
      type: 'line',
      data: {
        datasets: [
          {
            type: 'bar',
            label: "Anwesenheit",
            backgroundColor: 'rgb(50, 50, 250, 0.8)', // array should have same number of elements as number of dataset
            borderColor: 'rgb(57, 114, 255)',// array should have same number of elements as number of dataset
            pointStyle: "circle",
            data: [{ x: 0, y: 0 }],
          },
          {
            label: "Durchschnitt",
            type: 'line',
            fill: true,
            pointRadius: 0,
            backgroundColor: 'rgb(12, 23, 150, 0.1)',
            borderDash: [5, 5],
            data: [{ x: 0, y: 0 }],
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        }
      },
    });

  }


  /**
   * Loads statisctic data
   */
  private loadGraphData() {
    this.statsSrv.loadStatisticDataByUnit(this.date, this.timeUnit, this.accumulate, this.fill)
      .then((resp: Statistics) => {
        //this.logger.log(resp);
        this.updateGraph(resp, this.chart);
      })
      .catch((error: string) => {
        Util.alert(this.alertCtrl, error);
      });
  }

  /**
 * takes statistics data and updates the Graph accordingly
 * @param stats statistic data
 */
  private updateGraph(stats: Statistics, chart: Chart) {
    let label: string[] = [];
    let data: number[] = [];
    let avg: number[] = [];

    console.log("Länge: " + stats.size)
    if (stats.size == 0) {
      data.push(0);
      avg.push(0);
    } else {
      for (const stat of stats.data) {
        // label.push(data.x);
        const dtMoment = moment(stat.x);
        if (this.timeUnit == TimeUnit.week) {
          label.push(moment(stat.x, 'YYYY-MM-DD').format('dd, DD.MM'));
        } else {
          label.push(new Date(stat.x).toLocaleDateString());
        }
        data.push(stat.y);
        if (this.accumulate) {
          //avg.push(stats.compData[n].y);
        } else {
          avg.push(stats.averageWorkingTime);
        }
      }
    }

    if (this.timeUnit == TimeUnit.week || this.timeUnit == TimeUnit.month) {
      this.chart.data.datasets[0].type = 'bar';
      const barThickness = this.chart.width / data.length;
      this.chart.data.datasets[0]['barThickness'] = barThickness - barThickness / 3;
      this.chart.data.datasets[0]['borderRadius'] = barThickness / 1
    } else {
      this.chart.data.datasets[0].type = 'line';
    }
    this.chart.options.scales['y'].min = Util.min(data);

    chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.data.datasets[1].data = avg;
    chart.update('none');
  }

}

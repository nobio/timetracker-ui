import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { Chart } from 'chart.js';
import moment from 'moment';
import { Util } from 'src/app/libs/Util';
import { TimeUnit } from 'src/app/models/enums';
import { ExtraHours } from 'src/app/models/extra-hours';
import { StatisticsService } from 'src/app/services/datasource/statistics.service';
import { LogService } from 'src/app/services/log.service';
@Component({
  selector: 'app-extrahour',
  templateUrl: './extrahour.page.html',
  styleUrls: ['./extrahour.page.scss'],
})
export class ExtrahourPage {

  private chart: Chart;
  timeUnit: TimeUnit = TimeUnit.day;
  private _accumulate: boolean = true;
  @ViewChild("canvas") canvas;

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

  setTimeUnit() {
    //this.logger.log(this.timeUnit);
    this.loadGraphData();
  }
  set accumulate(acc: boolean) {
    this._accumulate = acc
    this.loadGraphData();
  }

  get accumulate(): boolean {
    return this._accumulate;
  }


  /**
   * Loads statisctic data
   */
  private async loadGraphData() {
    try {
      const extraHours: ExtraHours = await this.statsSrv.loadExtraHours(this.accumulate, this.timeUnit);
      //this.logger.log(extraHours);
      this.updateGraph(extraHours, this.chart);
    } catch (error) {
      Util.alert(this.alertCtrl, error);
    }
  }

  private initGraph() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: "bar",
      data: {
        datasets: [
          {
            label: "Überstunden",
            backgroundColor: "#377ed4",
            hoverBackgroundColor: "rgb(70, 70, 70)",
            borderRadius: 10,
            data: [{ x: 0, y: 0 }],
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }

  /**
   * updates the canvas
   */
  private updateGraph(extraHours: ExtraHours, chart: any) {
    const label: string[] = [];
    const data: number[] = [];
    const extraHoursData = extraHours.data;

    for (let n = 0; n < extraHoursData.length; n++) {
      label.push(moment(extraHoursData[n].date).format('ddd DD.MM.YY'));
      data.push(extraHoursData[n].extraHour);
    }

    chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update({
      duration: 600,
      easing: "easeOutBounce"
    });

  }
}

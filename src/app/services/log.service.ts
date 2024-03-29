import { Injectable } from '@angular/core';
import { Queue } from 'src/app/libs/Queue';
import { LogEntity } from '../models/log-entity';


@Injectable({
  providedIn: 'root'
})
export class LogService {
  private queue: Queue<LogEntity>;

  private constructor(queue: Queue<LogEntity>) {
    this.queue = queue;
  }

  public log(msg: any, shouldQueue: boolean = true, topic: string = 'Log'): void {
    const message = this.convertToString(msg);
    console.log(this.convertToString(msg));

    if (shouldQueue) {
      const logEntry: LogEntity = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date,
        severity: "log",
        topic,
        text: message,
      };
      this.queue.enqueue(logEntry);
    }
  }

  public error(msg: any | null, topic: string = 'Error'): void {
    if(!msg) return;
    
    const message = this.convertToString(msg);
    //console.trace();
    console.error(this.convertToString(msg));

    const logEntry: LogEntity = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date,
      severity: "error",
      topic,
      text: message,
    };
    this.queue.enqueue(logEntry);
  }

  private convertToString(msg: any): string {
    if (typeof (msg) === 'string') return msg;
    if (typeof (msg) === 'number') return `${msg}`;
    if (typeof (msg) === 'object') return JSON.stringify(msg);
    return msg.toString();
  }
}

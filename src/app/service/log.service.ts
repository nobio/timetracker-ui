import { Injectable } from '@angular/core';
import { Queue } from 'src/app/lib/Queue';


@Injectable({
  providedIn: 'root'
})
export class LogService {
  private queue: Queue<string>;
  
  private constructor(queue: Queue<string>) { 
    this.queue = queue;
  }

  public log(msg: any): void {
    const message = this.convertToString(msg);
    console.log(this.convertToString(msg));
    this.queue.enqueue(message);
  }

  public error(msg: any): void {
    const message = this.convertToString(msg);
    console.trace();
    console.error(this.convertToString(msg));
    this.queue.enqueue(message);
  }

  private convertToString(msg: any): string {
    if(typeof(msg) === 'string') return msg;
    if(typeof(msg) === 'number') return `${msg}`;
    if(typeof(msg) === 'object') return JSON.stringify(msg);
    return msg.toString();
  }
}

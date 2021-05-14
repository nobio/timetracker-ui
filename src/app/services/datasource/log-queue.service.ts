import { Injectable } from '@angular/core';
import { Queue } from 'src/app/libs/Queue';
import { LogEntity } from 'src/app/models/log-entity';

@Injectable({
  providedIn: 'root'
})
export class LogQueueService {

  constructor(private queue: Queue<LogEntity>) { }

  public listAll(): Array<LogEntity> {
    return this.queue.pullAll().reverse();
  }

  public list(count: number): Array<LogEntity> {
    return this.queue.pull(count).reverse();
  }

  public loadById(id: string): LogEntity {
    let entity = null;
    this.queue.pullAll().forEach(ent => {
      if(ent.id === id) {
        entity = ent;
      }
    });

    return entity;
  }
}

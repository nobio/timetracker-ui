import { Injectable } from '@angular/core';
import { Queue } from 'src/app/lib/Queue';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private queue: Queue<string>) { }
}

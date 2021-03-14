import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Queue<T> {

    private storage: T[] = [];
    private capacity: number = 10;

    constructor() { }

    enqueue(item: T): void {
        if (this.size() === this.capacity) {
            //throw Error("Queue has reached max capacity, you cannot add more items");
            this.dequeue();
        }
        this.storage.push(item);
    }

    dequeue(): T | undefined {
        return this.storage.shift();
    }

    size(): number {
        return this.storage.length;
    }

    pullAll(): T[] {
        return this.storage;
    }

    pull(count: number): T[] {
        if (count > this.capacity) throw Error(`Queue only has ${this.capacity} elements; you cannot retrieve ${count} elements!`);
        if (count > this.storage.length) count = this.storage.length;
        return this.storage.splice(0, count);
    }
}
import { TestBed } from '@angular/core/testing';

import { LogQueueService } from './log-queue.service';

describe('LogQueueService', () => {
  let service: LogQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

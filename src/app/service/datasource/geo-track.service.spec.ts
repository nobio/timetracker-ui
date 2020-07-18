import { TestBed } from '@angular/core/testing';

import { GeoTrackService } from './geo-track.service';

describe('GeoTrackService', () => {
  let service: GeoTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

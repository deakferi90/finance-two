import { TestBed } from '@angular/core/testing';

import { OverviewService } from './overview.service';
import { HttpClientModule } from '@angular/common/http';

describe('OverviewService', () => {
  let service: OverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [OverviewService],
    });
    service = TestBed.inject(OverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { BudgetsService } from './budgets.service';
import { HttpClientModule } from '@angular/common/http';

describe('BudgetsService', () => {
  let service: BudgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [BudgetsService],
    });
    service = TestBed.inject(BudgetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

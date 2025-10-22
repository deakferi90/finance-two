import { TestBed } from '@angular/core/testing';
import { BillsService } from './bills.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BillsService', () => {
  let service: BillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

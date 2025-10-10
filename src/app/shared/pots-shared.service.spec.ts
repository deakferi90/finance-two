import { TestBed } from '@angular/core/testing';

import { PotsSharedService } from './pots-shared.service';

describe('PotsSharedService', () => {
  let service: PotsSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotsSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

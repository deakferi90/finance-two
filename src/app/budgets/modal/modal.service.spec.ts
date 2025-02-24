import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';
import { HttpClientModule } from '@angular/common/http';

describe('ModalServiceService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

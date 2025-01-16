import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringBillsComponent } from './recurring-bills.component';

describe('RecurringBillsComponent', () => {
  let component: RecurringBillsComponent;
  let fixture: ComponentFixture<RecurringBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringBillsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

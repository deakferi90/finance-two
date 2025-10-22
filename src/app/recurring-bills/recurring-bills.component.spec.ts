import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringBillsComponent } from './recurring-bills.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RecurringBillsComponent', () => {
  let component: RecurringBillsComponent;
  let fixture: ComponentFixture<RecurringBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecurringBillsComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurringBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

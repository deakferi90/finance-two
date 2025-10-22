import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsComponent } from './transactions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('TransactionsComponent', () => {
  let component: TransactionsComponent;
  let fixture: ComponentFixture<TransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display transactions when data is provided', () => {
    component.transactions = [
      {
        avatar: 'emma-richardson.jpg',
        name: 'Emma Richardson',
        category: 'General',
        date: '2024-08-19T14:23:11Z',
        amount: 75.5,
        recurring: false,
      },
      {
        avatar: 'savory-bites-bistro.jpg',
        name: 'Savory Bites Bistro',
        category: 'Dining Out',
        date: '2024-08-19T20:23:11Z',
        amount: -55.5,
        recurring: false,
      },
    ];
    component.filteredTransactions = component.transactions;
    fixture.detectChanges();

    const transactionItems = fixture.debugElement.queryAll(
      By.css('.parent-container')
    );
    expect(transactionItems.length).toBeGreaterThan(0);
  });

  it('should display "No transactions available" if there are none', () => {
    component.transactions = [];
    component.filteredTransactions = [];
    fixture.detectChanges();

    const message = fixture.debugElement.nativeElement.textContent;
    expect(message).toContain('No transactions available');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

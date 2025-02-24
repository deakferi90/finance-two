import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutChartComponent } from './donut-chart.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

describe('DonutChartComponent', () => {
  let component: DonutChartComponent;
  let fixture: ComponentFixture<DonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientModule, DonutChartComponent], // Add DonutChartComponent to imports
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutChartComponent);
    component = fixture.componentInstance;

    component.budgets = [
      {
        id: 1,
        category: 'Entertainment',
        amount: 1000,
        theme: '#277C78',
        color: 'Green',
        optional: true,
      },
      {
        id: 2,
        category: 'Bills',
        amount: 800,
        theme: '#82C9D7',
        color: 'Cyan',
        optional: true,
      },
      {
        id: 3,
        category: 'Dining Out',
        amount: 400,
        theme: '#F2CDAC',
        color: 'Desert Sand',
        optional: true,
      },
      {
        id: 4,
        category: 'Personal Care',
        amount: 300,
        theme: '#626070',
        color: 'Gray',
        optional: true,
      },
    ];

    component.spent = [150, 100, 50, 200];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

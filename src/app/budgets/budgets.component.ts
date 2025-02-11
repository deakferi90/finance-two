import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BudgetsService } from './budgets.service';
import { Budget } from './budgets.interface';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Transaction } from '../transactions/transaction.interface';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    DonutChartComponent,
    MatProgressBarModule,
    HttpClientModule,
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  [x: string]: any;
  progress: number = 50;
  totalAmount: number = 0;
  spent: number | number[] | any;
  progressBarHeight: string = '24px';
  transactions: Transaction[] = [];
  budgets: Budget[] = [];
  spentValues: any;
  displaySpent: any;
  showAll = false;
  colorBudget: string = '';
  selectedCategory: string | null = null;

  budgetColors: { [key: string]: string } = {
    Entertainment: '#277C78',
    Bills: '#82C9D7',
    'Dining Out': '#F2CDAC',
    'Personal Care': '#626070',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private service: BudgetsService
  ) {}

  ngOnInit(): void {
    this.loadBudgetData();
  }

  getAbsoluteSpent(budget: Budget): number {
    return Math.abs(this.calculateTotalSpent(budget));
  }

  calculateTotalSpent(budget: Budget): number {
    return this.transactions
      .filter((item) => item.category === budget.category)
      .reduce((sum, item) => sum + item.amount, 0);
  }

  calculateRemainingAmount(budget: Budget): number {
    this.spent = this.calculateTotalSpent(budget);
    return this.spent < 0 ? budget.maximum - Math.abs(this.spent) : 0;
  }

  calculateSpentPercentage(budget: Budget): number {
    this.spent = this.calculateTotalSpent(budget);
    const percentage =
      budget.maximum > 0 ? (this.spent / budget.maximum) * 100 : 0;
    return Math.min(percentage, 100);
  }

  toggleShowAll(category: string | null) {
    this.selectedCategory =
      this.selectedCategory === category ? null : category;
  }

  getVisibleTransactions(category: string): Transaction[] {
    const filteredTransactions = this.transactions.filter(
      (item) => item.category === category
    );
    return this.selectedCategory === category
      ? filteredTransactions
      : filteredTransactions.slice(0, 3);
  }

  handleValue(value: any) {
    for (let index = 0; index < value.length; index++) {
      this.spentValues = value;
    }
  }

  loadBudgetData() {
    this.service.getBudgets().subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.budgets = data[0].budgets;
        this.transactions = data[0].transactions;
        this.spent = this.budgets.map((budget) =>
          this.calculateTotalSpent(budget)
        );
        for (let i = 0; i < this.spent.length; i++) {
          this.spentValues = this.spent[i];
        }

        this.cdr.detectChanges();
        for (let index = 0; index < data[0].budgets.length; index++) {
          const el = data[0].budgets[index];
          this.progress = el.maximum;
        }
      } else {
        console.error('Unexpected data format', data);
      }
    });
  }

  getColorForTheme(theme: string): string {
    switch (theme.toLowerCase()) {
      case 'Entertainment':
        return '#277C78';
      case 'Bills':
        return '#82C9D7';
      case 'Dining Out':
        return '#F2CDAC';
      default:
        return '#626070';
    }
  }
}

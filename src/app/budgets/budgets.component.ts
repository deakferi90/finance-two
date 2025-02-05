import { Component, OnInit } from '@angular/core';
import { BudgetsService } from './budgets.service';
import { Budget } from './budgets.interface';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Transaction } from '../transactions/transaction.interface';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  [x: string]: any;
  progress: number = 50;
  totalAmount: number = 0;
  spent: any;
  progressBarHeight: string = '24px';
  transactions: Transaction[] = [];
  budgets: Budget[] = [];
  showAll = false;
  selectedCategory: string | null = null;

  budgetColors: { [key: string]: string } = {
    Entertainment: '#277C78',
    Bills: '#82C9D7',
    'Dining Out': '#F2CDAC',
    'Personal Care': '#626070',
  };

  constructor(private service: BudgetsService) {}

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
    const spent = this.calculateTotalSpent(budget);
    const percentage = budget.maximum > 0 ? (spent / budget.maximum) * 100 : 0;
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

  loadBudgetData() {
    this.service.getBudgets().subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.budgets = data[0].budgets;
        this.transactions = data[0].transactions;
        for (let index = 0; index < data[0].budgets.length; index++) {
          const el = data[0].budgets[index];
          this.progress = el.maximum;
        }
      } else {
        console.error('Unexpected data format', data);
      }
    });
  }
}

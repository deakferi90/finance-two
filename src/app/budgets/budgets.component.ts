import { Component, OnInit } from '@angular/core';
import { BudgetsService } from './budgets.service';
import { Budget } from './budgets.interface';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  progress: number = 50;
  progressBarHeight: string = '24px';
  budgets: Budget[] = [];
  constructor(private service: BudgetsService) {}

  ngOnInit(): void {
    this.loadBudgetData();
  }

  loadBudgetData() {
    this.service.getBudgets().subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.budgets = data[0].budgets;
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

import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { BudgetsService } from './budgets.service';
import { Budget } from './budgets.interface';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Transaction } from '../transactions/transaction.interface';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './modal/modal.component';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    DonutChartComponent,
    MatProgressBarModule,
    HttpClientModule,
    ModalComponent,
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit, AfterViewInit {
  @ViewChildren('menuContainer') menuContainers:
    | QueryList<ElementRef>
    | never[] = [];
  @ViewChild(DonutChartComponent) donutChart!: DonutChartComponent;
  chart!: Chart;
  dotsUrl: string = 'assets/dots.png';
  progress: number = 50;
  totalAmount: number = 0;
  spent!: number | number[];
  openDropDownIndex: number | null = null;
  progressBarHeight: string = '24px';
  transactions: Transaction[] = [];
  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  budgetData!: Budget;
  spentValues: any;
  displaySpent: any;
  showAll = false;
  isModalVisible = false;
  modalTitle: string = '';
  modalContent: string = '';
  colorBudget: string = '';
  selectedCategory: string | null = null;
  deleteMsg: string = '';
  cancel: string = '';
  selectedTheme: string = '';
  selectedBudget: Budget | null = null;
  updatedObject!: object;

  get spentArray(): number[] {
    return Array.isArray(this.spent) ? this.spent : [this.spent];
  }

  budgetColors: { [key: string]: string } = {
    Entertainment: '#277C78',
    Bills: '#82C9D7',
    'Dining Out': '#F2CDAC',
    'Personal Care': '#626070',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private budgetService: BudgetsService
  ) {}

  ngOnInit(): void {
    this.loadBudgetData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.callCreateChart(), 0);
  }

  themeChanged(newTheme: string) {
    if (this.selectedBudget) {
      this.selectedBudget = { ...this.selectedBudget, theme: newTheme };
    }
  }

  addBudget() {
    this.modalTitle = 'Add New Budget';
    this.modalContent = `Choose category to set a spending budget. These categories can help you monitor spending.`;
    this.isModalVisible = true;
  }

  openEditModal(budget: Budget) {
    this.modalTitle = 'Edit Budget';
    this.modalContent = `As your budgets change, feel free to update your spending limits.`;
    this.isModalVisible = true;
    this.budgetData = budget;
  }

  openDeleteModal(budget: Budget) {
    this.modalTitle = `Delete '${budget.category}'`;
    this.modalContent = `Are you sure you want to delete this budget? This action cannot be reversed, and all data inside it will be removed forever.`;
    this.isModalVisible = true;
    this.deleteMsg = 'Yes, Confirm Deletion';
    this.cancel = 'No, Go Back';
  }

  closeModal() {
    this.isModalVisible = false;
  }

  getAbsoluteSpent(budget: Budget): number {
    return Math.abs(this.calculateTotalSpent(budget));
  }

  toggleMenu(index: number) {
    if (this.openDropDownIndex === index) {
      this.openDropDownIndex = null;
    } else {
      this.openDropDownIndex = index;
    }
  }

  calculateTotalSpent(budget: Budget): number {
    return this.transactions
      .filter((item) => item.category === budget.category)
      .reduce((sum, item) => sum + item.amount, 0);
  }

  calculateRemainingAmount(budget: Budget): number {
    this.spent = this.calculateTotalSpent(budget);
    return this.spent < 0 ? budget.amount - Math.abs(this.spent) : 0;
  }

  calculateSpentPercentage(budget: Budget): number {
    this.spent = this.calculateTotalSpent(budget);
    const percentage =
      budget.amount > 0 ? (this.spent / budget.amount) * 100 : 0;
    return Math.min(percentage, 100);
  }

  toggleShowAll(category: string | null) {
    this.selectedCategory =
      this.selectedCategory === category ? null : category;
  }

  budgetSelected(updatedBudget: Budget) {
    this.filteredBudgets = this.filteredBudgets.map((budget) =>
      budget.id === updatedBudget.id ? { ...budget, ...updatedBudget } : budget
    );
  }

  getVisibleTransactions(category: string): Transaction[] {
    const filteredTransactions = this.transactions.filter(
      (item) => item.category === category
    );
    return this.selectedCategory === category
      ? filteredTransactions
      : filteredTransactions.slice(0, 3);
  }

  handleValue(value: []) {
    this.spentValues = value;
  }

  loadBudgetData() {
    this.budgetService.getBudgetData().subscribe((data: any) => {
      if (Array.isArray(data.budgets) && data.budgets.length > 0) {
        this.budgets = data.budgets;
        this.filteredBudgets = data.budgets.filter(
          (budget: any) => !budget.optional
        );
        this.transactions = data.transactions;
        this.spent = this.budgets.map((budget) => {
          return this.calculateTotalSpent(budget);
        });

        for (let i = 0; i < this.spent.length; i++) {
          this.spentValues = this.spent[i];
        }

        this.cdr.detectChanges();
      } else {
        console.error('Unexpected data format', data);
      }
    });
  }

  onEditBudget(budgetId: number | string, updatedData: Partial<Budget>) {
    const budgetIdNumber = Number(budgetId);
    this.budgetService.updateBudget(budgetIdNumber, updatedData).subscribe(
      (response) => {
        console.log('Budget updated:', response);

        const index = this.budgets.findIndex(
          (budget) => budget.id === budgetId
        );
        if (index !== -1) {
          this.budgets[index] = { ...this.budgets[index], ...updatedData };
        }

        this.filteredBudgets = this.budgets.filter(
          (budget) => !budget.optional
        );

        this.recalculateSpentValues();
        this.refreshChart();

        this.isModalVisible = false;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error updating budget:', error);
      }
    );
  }

  refreshChart() {
    if (this.chart) {
      this.chart.update();
    }
  }

  recalculateSpentValues() {
    this.spent = this.budgets.map((budget) =>
      Math.abs(this.calculateTotalSpent(budget))
    );
    this.spentValues = [...this.spent];
    this.cdr.detectChanges();
  }

  callCreateChart() {
    if (this.donutChart) {
      this.donutChart.createChart();
    } else {
      console.warn('Retrying in 100ms...');
    }
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    let clickedInside = false;

    this.menuContainers.forEach((menu) => {
      if (menu.nativeElement.contains(event.target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside && this.openDropDownIndex !== null) {
      this.openDropDownIndex = null;
    }
  }
}

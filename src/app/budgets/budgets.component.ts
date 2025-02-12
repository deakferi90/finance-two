import {
  Component,
  OnInit,
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
export class BudgetsComponent implements OnInit {
  @ViewChildren('menuContainer') menuContainers!: QueryList<ElementRef>;
  [x: string]: any;
  dotsUrl: string = 'assets/dots.png';
  progress: number = 50;
  totalAmount: number = 0;
  spent!: number | number[];
  openDropDownIndex: number | null = null;
  progressBarHeight: string = '24px';
  transactions: Transaction[] = [];
  budgets: Budget[] = [];
  spentValues: any;
  displaySpent: any;
  showAll = false;
  isModalVisible = false;
  modalTitle: string = '';
  modalContent: string = '';
  colorBudget: string = '';
  selectedCategory: string | null = null;

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
    private service: BudgetsService
  ) {}

  ngOnInit(): void {
    this.loadBudgetData();
  }

  addBudget() {
    this.modalTitle = 'Add New Budget';
    this.modalContent = `Choose category to set a spending budget. These categories can help you monitor spending.`;
    this.isModalVisible = true;
  }

  openEditModal(index: number) {
    this.modalTitle = 'Edit Budget';
    this.modalContent = `You are about to edit budget #${index + 1}.`;
    this.isModalVisible = true;
  }

  openDeleteModal(index: number) {
    this.modalTitle = 'Delete Budget';
    this.modalContent = `Are you sure you want to delete budget #${index + 1}?`;
    this.isModalVisible = true;
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

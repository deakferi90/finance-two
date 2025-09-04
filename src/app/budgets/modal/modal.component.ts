import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Budget } from '../budgets.interface';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ModalService } from './modal.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { DonutChartComponent } from '../donut-chart/donut-chart.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() content!: string;
  @Input() deleteMsg!: string;
  @Input() cancel!: string;
  @Input() budgets: Budget[] | any = [];
  @Input() title = '';
  @Input() message = '';
  @Input() budgetColors: { [key: string]: string } = {};
  @Input() selectedBudget!: any;
  @Input() loadDataBudget!: () => void;
  @Input() recalculateSpentValues!: () => void;
  @ViewChild(DonutChartComponent) donutChart!: DonutChartComponent;
  @Output() closeModal = new EventEmitter<void>();
  @Output() themeChanged = new EventEmitter<Budget>();
  @Output() budgetSelected = new EventEmitter<Budget>();
  @Output() budgetUpdated = new EventEmitter<Budget>();
  @Output() budgetAdded = new EventEmitter<Budget>();
  @Output() chartRedraw = new EventEmitter<void>();
  @Output() budgetDeleted = new EventEmitter<number>();
  maxSpeed: number = 0;
  initialBudgets: Budget[] = [];

  colorMapping: { [key: string]: string } = {
    '#277C78': 'Green',
    '#82C9D7': 'Cyan',
    '#426CD5': 'Blue',
    '#F2CDAC': 'Desert Sand',
    '#FFA500b3': 'Orange',
    '#626070': 'Gray',
    '#FFB6C1CC': 'Pink',
  };

  dropdownStates: { [key: string]: boolean } = {
    category: false,
    amount: false,
    theme: false,
  };

  selectedCategory: any = null;
  previousSelections: any[] = [];
  selectedAmount: number | string | null | undefined = null;
  selectedTheme: string | undefined = '';
  newValue: Budget | object = {};
  filteredBudgets!: Budget[];

  constructor(
    private modalService: ModalService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.modalService
      .getBudgets()
      .pipe(take(1))
      .subscribe((budgets: Budget[]) => {
        this.filteredBudgets = budgets;
      });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  toggleDropdown(dropdown: string) {
    this.dropdownStates[dropdown] = !this.dropdownStates[dropdown];

    Object.keys(this.dropdownStates).forEach((key) => {
      if (key !== dropdown) {
        this.dropdownStates[key] = false;
      }
    });
  }

  getColorName(theme: string): string {
    const selectedCategoryOption = this.budgets.find(
      (budget: { theme: string }) => budget.theme === theme
    );
    return selectedCategoryOption ? selectedCategoryOption.color : '';
  }

  selectOption(dropdown: string, option: any) {
    if (dropdown === 'category') {
      this.selectedCategory = option;

      const selectedCategoryOption = this.budgets.find(
        (budget: { category: any }) => budget.category === option.category
      );
      this.dropdownStates[dropdown] = option + 1;

      if (selectedCategoryOption) {
        this.selectedTheme = selectedCategoryOption.theme;
        this.selectedAmount = selectedCategoryOption.amount;
      }
    } else if (dropdown === 'theme') {
      this.selectedTheme = option.theme;
    }

    this.dropdownStates[dropdown] = false;
  }

  formatNumber(event: any) {
    let value = parseFloat(event.target.value);

    if (!isNaN(value)) {
      this.maxSpeed = parseFloat(value.toFixed(2));
    } else {
      this.maxSpeed = 0;
    }
  }

  updateBudget() {
    const maxSpeedInput = document.querySelector(
      '.max-speed'
    ) as HTMLInputElement;
    const inputValue = maxSpeedInput?.value;

    const updatedBudget: Budget = {
      id: this.selectedBudget.id,
      amount: inputValue ? Number(inputValue) : this.selectedBudget.amount,
      category: this.selectedCategory?.category || this.selectedBudget.category,
      theme: this.selectedTheme || this.selectedBudget.theme,
      color:
        this.selectedTheme && this.colorMapping[this.selectedTheme]
          ? this.colorMapping[this.selectedTheme]
          : this.selectedBudget.color,
    };

    this.modalService.updateBudget(updatedBudget).subscribe(
      (response: Budget) => {
        this.budgetUpdated.emit(response);
        this.toastr.success('Budget updated successfully!');

        this.selectedBudget = { ...this.selectedBudget, ...response };

        this.budgets = this.budgets.map((budget: { id: number }) =>
          budget.id === response.id ? { ...budget, ...response } : budget
        );

        this.modalService
          .getBudgets()
          .pipe(take(1))
          .subscribe((budgets: Budget[]) => {
            this.filteredBudgets = budgets;
            this.initialBudgets = [...budgets];
          });

        this.resetSelections();

        this.close();
      },
      (error) => {
        this.toastr.error('Error updating budget');
        console.error('Update failed:', error);
      }
    );
  }

  close() {
    this.selectedCategory =
      this.initialBudgets.find(
        (budget) => budget.category === this.selectedCategory?.category
      ) || null;

    this.selectedTheme = this.selectedCategory
      ? this.selectedCategory.theme
      : '';

    this.selectedAmount = this.selectedCategory
      ? this.selectedCategory.amount
      : null;

    this.selectedBudget = null;
    this.closeModal.emit();
  }

  refreshChart() {
    if (this.donutChart) {
      this.donutChart.createChart();
    }
  }

  addBudget() {
    const selAmount = document.querySelector(
      '.max-speed'
    ) as HTMLInputElement | null;
    this.selectedAmount = selAmount?.value;

    const budgetData = {
      id: this.selectedCategory.id,
      category: this.selectedCategory?.category,
      amount: this.selectedAmount,
      theme: this.selectedCategory?.theme,
    };
    this.modalService.addBudget(budgetData).subscribe((newBudget: Budget) => {
      this.budgets = this.budgets.map((budget: { id: number }) =>
        budget.id === newBudget.id ? { ...budget, ...newBudget } : budget
      );

      if (
        !this.budgets.some(
          (budget: { id: number }) => budget.id === newBudget.id
        )
      ) {
        this.budgets = [...this.budgets, newBudget];
      }

      this.filteredBudgets = this.budgets.filter(
        (budget: { optional: boolean }) => !budget.optional && budget.optional
      );

      if (newBudget) {
        this.budgetAdded.emit(newBudget);
        this.toastr.success('Budget added successfully!');
        this.resetSelections();
        this.close();
      } else {
        this.toastr.error('Failed to add budget');
      }
    });
    this.close();
  }

  confirmDelete() {
    if (this.selectedBudget) {
      this.budgetDeleted.emit(this.selectedBudget.id);
    }
    this.closeModal.emit();
  }

  cancelDelete() {
    this.closeModal.emit();
  }

  resetSelections() {
    this.selectedCategory = null;
    this.selectedAmount = null;
    this.selectedTheme = '';
    this.selectedBudget = null;
  }
}

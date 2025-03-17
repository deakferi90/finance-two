import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Budget } from '../budgets.interface';
import { FormsModule } from '@angular/forms';
import { ModalService } from './modal.service';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() content!: string;
  @Input() deleteMsg!: string;
  @Input() cancel!: string;
  @Input() budgets: Budget[] = [];
  @Input() title = '';
  @Input() message = '';
  @Input() budgetColors: { [key: string]: string } = {};
  @Input() selectedBudget!: any;
  @Output() closeModal = new EventEmitter<void>();
  @Output() themeChanged = new EventEmitter<Budget>();
  @Output() budgetSelected = new EventEmitter<Budget>();
  @Output() budgetUpdated = new EventEmitter<Budget>();
  @Output() chartRedraw = new EventEmitter<void>();
  maxSpeed: number = 0;

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

  selectedCategory: Budget | null = null;
  selectedAmount: number | string | null = null;
  selectedTheme: string | undefined = '';
  newValue: Budget | object = {};
  filteredBudgets!: Budget[];

  constructor(
    private modalService: ModalService,
    private toastr: ToastrService
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
      (budget) => budget.theme === theme
    );
    return selectedCategoryOption ? selectedCategoryOption.color : '';
  }

  selectOption(dropdown: string, option: any) {
    if (dropdown === 'category') {
      this.selectedCategory = option;

      const selectedCategoryOption = this.budgets.find(
        (budget) => budget.category === option.category
      );
      this.dropdownStates[dropdown] = option;

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

        this.budgets = this.budgets.filter((budget) =>
          budget.id === response.id ? { ...budget, ...response } : budget
        );

        this.filteredBudgets = this.budgets.filter(
          (budget) => !budget.optional
        );

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
    this.closeModal.emit();
  }

  resetSelections() {
    this.selectedCategory = null;
    this.selectedAmount = null;
    this.selectedTheme = '';
    this.selectedBudget = null;
  }
}

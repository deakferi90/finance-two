import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Budget } from '../budgets.interface';
import { FormsModule } from '@angular/forms';
import { ModalService } from './modal.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private modalService: ModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBudgets();
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

  loadBudgets() {
    this.modalService.getBudgets().subscribe((budgets: Budget[]) => {
      this.budgets = budgets;
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
    const maxSpeed = document.querySelector('.max-speed') as HTMLInputElement;
    const inputValue = maxSpeed?.value;
    this.selectedAmount = inputValue;
    const themeHexCode = this.selectedTheme!;
    let selectedColor = this.selectedBudget.color;

    if (themeHexCode !== this.selectedBudget.theme) {
      selectedColor =
        this.colorMapping[themeHexCode] || this.selectedBudget.color;
    }

    this.newValue = {
      id: Number(this.selectedBudget.id),
      amount: Number(this.selectedAmount),
      category: this.selectedCategory?.category || this.selectedBudget.category,
      theme: this.selectedTheme || this.selectedBudget.theme,
      color: selectedColor,
    };
    this.modalService.updateBudget(this.newValue).subscribe(
      (updatedBudget: Budget | undefined) => {
        this.budgetUpdated.emit(updatedBudget);
        this.toastr.success('Budget updated successfully!');
      },
      (error: any) => {
        this.toastr.error('Error updating budget');
        console.error('Update failed:', error);
      }
    );

    this.close();
  }

  close() {
    this.resetSelections();
    this.closeModal.emit();
  }

  // resetBudgets() {
  //   this.modalService.resetBudgets().subscribe(
  //     () => {
  //       this.loadBudgets();
  //       this.toastr.success('Budgets reset successfully!');
  //     },
  //     (error) => {
  //       this.toastr.error('Failed to reset budgets');
  //       console.error('Reset failed:', error);
  //     }
  //   );
  // }

  resetSelections() {
    this.selectedCategory = null;
    this.selectedAmount = null;
    this.selectedTheme = '';
    this.selectedBudget = { ...this.selectedBudget };
  }
}

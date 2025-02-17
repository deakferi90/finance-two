import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Budget } from '../budgets.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Input() content!: string;
  @Input() deleteMsg!: string;
  @Input() cancel!: string;
  @Input() budgets: Budget[] = [];
  @Input() title = '';
  @Input() message = '';
  @Input() budgetColors: { [key: string]: string } = {};
  @Input() selectedBudget!: Budget;
  @Output() closeModal = new EventEmitter<void>();
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
    maximum: false,
    theme: false,
  };

  selectedCategory: Budget | null = null;
  selectedMaximum: number | string | null = null;
  selectedTheme: string | null = null;
  newValue: object = {};

  constructor() {}

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
        this.selectedMaximum = selectedCategoryOption.maximum;
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
    this.selectedMaximum = inputValue;
    const themeHexCode = this.selectedTheme!;
    const selectedColor = this.colorMapping[themeHexCode] || 'Unknown';

    this.newValue = {
      category: this.selectedCategory?.category,
      maximum: Number(this.selectedMaximum),
      theme: this.selectedTheme,
      color: selectedColor,
    };
    console.log(this.newValue);
  }

  close() {
    this.resetSelections();
    this.closeModal.emit();
  }

  resetSelections() {
    this.selectedCategory = null;
    this.selectedMaximum = null;
    this.selectedTheme = null;
    this.selectedBudget = { ...this.selectedBudget };
  }
}

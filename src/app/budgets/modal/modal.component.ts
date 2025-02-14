import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Budget } from '../budgets.interface';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
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
  @Input() selectedBudget: any;
  @Output() closeModal = new EventEmitter<void>();
  maxSpeed: number = 0;

  dropdownStates: { [key: string]: boolean } = {
    category: false,
    maximum: false,
    theme: false,
  };

  selectedCategory: any = null;
  selectedMaximum: any = null;
  selectedTheme: any = null;

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
      console.log(this.selectedBudget);

      const selectedCategoryOption = this.budgets.find(
        (budget) => budget.category === option.category
      );
      this.dropdownStates[dropdown] = option;

      if (selectedCategoryOption) {
        this.selectedTheme = selectedCategoryOption.theme;
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

  close() {
    this.closeModal.emit();
  }
}

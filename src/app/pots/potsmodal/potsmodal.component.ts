import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pots } from '../pots.interface';

@Component({
  selector: 'app-potsmodal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './potsmodal.component.html',
  styleUrls: ['./potsmodal.component.scss'],
})
export class PotsmodalComponent implements OnChanges {
  selectOption(arg0: string, _t35: any) {
    throw new Error('Method not implemented.');
  }
  @Input() isVisible: boolean = false;
  @Input() selectedPot!: Pots;
  @Input() selectedPotName: string = '';
  @Input() mode: 'edit' | 'delete' = 'delete';

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() potUpdated = new EventEmitter<Pots>();

  isThemeDropdownOpen = false;

  get selectedThemeName(): string {
    const theme = this.themes.find((t) => t.value === this.editPot.theme);
    return theme ? theme.name : 'Select Theme';
  }

  editPot: Pots = {
    name: '',
    target: 0,
    total: 0,
    theme: '',
    themeColor: undefined,
    id: 0,
    _id: '0',
  };

  themes = [
    { name: 'Green', value: '#277C78' },
    { name: 'Cyan', value: '#82C9D7' },
    { name: 'Desert Sand', value: '#F2CDAC' },
    { name: 'Gray', value: '#626070' },
    { name: 'Purple', value: '#826CB0' },
  ];

  usedThemes: string[] = ['#277C78', '#626070'];

  toggleThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  selectTheme(theme: any) {
    this.editPot.theme = theme.value;
    this.isThemeDropdownOpen = false;
  }

  isThemeUsed(theme: any): boolean {
    return this.usedThemes.includes(theme.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedPot'] && this.selectedPot) {
      this.editPot = { ...this.selectedPot };
    }
  }

  close() {
    this.closeModal.emit();
  }

  onDelete() {
    this.confirmDelete.emit();
  }

  onSave() {
    this.potUpdated.emit(this.editPot);
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
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
export class PotsmodalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() selectedPot!: Pots;
  @Input() selectedPotName: string = '';
  @Input() mode: 'edit' | 'delete' | 'add' = 'delete';

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() potUpdated = new EventEmitter<Pots>();
  @Output() addNewPot = new EventEmitter<Pots>();

  allPots: Pots[] = [];
  isThemeDropdownOpen = false;

  get selectedThemeName(): string {
    const theme = this.addingNewThemes.find(
      (t) => t.value === this.addPot.theme
    );
    return theme ? theme.name : 'Select Theme';
  }

  addPot: Pots = {
    name: '',
    target: 0,
    total: 0,
    theme: '',
    themeColor: undefined,
    id: this.allPots.length,
    _id: '0',
  };

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

  addingNewThemes = [
    { name: 'Blue', value: 'blue' },
    { name: 'Orange', value: 'orange' },
    { name: 'Pink', value: '#FFC0CB' },
  ];

  usedThemes: string[] = ['blue', 'orange', '#FFC0CB'];

  ngOnInit(): void {
    this.allPots = [
      {
        id: 1,
        name: 'Savings',
        target: 2000.0,
        total: 159.0,
        themeColor: '#277C78',
        _id: '',
        theme: 'Green',
      },
      {
        id: 2,
        name: 'Concert Ticket',
        target: 150.0,
        total: 110.0,
        theme: 'Gray',
        themeColor: '#626070',
        _id: '',
      },
      {
        id: 3,
        name: 'Gift',
        target: 150.0,
        total: 110.0,
        theme: 'Cyan',
        themeColor: '#82C9D7',
        _id: '',
      },
      {
        id: 4,
        name: 'New Laptop',
        target: 1000.0,
        total: 10.0,
        theme: 'Desert Sand',
        themeColor: '#F2CDAC',
        _id: '',
      },
      {
        id: 5,
        name: 'Holiday',
        target: 1440.0,
        total: 531.0,
        theme: 'Purple',
        themeColor: '#826CB0',
        _id: '',
      },
    ];
  }

  onAdd() {
    if (!this.addPot.theme) {
      this.addPot.theme = '#FFC0CB';
    }

    this.addPot.themeColor = this.addPot.theme;

    this.addPot.total = this.addPot.target / 2;
    this.addNewPot.emit(this.addPot);
  }

  toggleThemeDropdown() {
    this.isThemeDropdownOpen = !this.isThemeDropdownOpen;
  }

  selectTheme(theme: any) {
    this.addPot.theme = theme.value;
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

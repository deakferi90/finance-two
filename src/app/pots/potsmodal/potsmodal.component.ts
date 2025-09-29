import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-potsmodal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './potsmodal.component.html',
  styleUrl: './potsmodal.component.scss',
})
export class PotsmodalComponent {
  @Input() isVisible: boolean = false;
  @Input() selectedPotName: string = '';
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();
  constructor() {}

  close() {
    this.closeModal.emit();
  }

  onDelete() {
    this.confirmDelete.emit();
  }
}

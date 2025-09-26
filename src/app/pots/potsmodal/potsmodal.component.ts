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
  @Output() closeModal = new EventEmitter<void>();
  @Output() potDeleted = new EventEmitter<number>();
  constructor() {}

  close() {
    this.closeModal.emit();
  }

  onDelete() {
    this.potDeleted.emit();
  }
}

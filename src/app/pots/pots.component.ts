import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { PotsService } from './pots.service';
import { Pots } from './pots.interface';
import { PotsmodalComponent } from './potsmodal/potsmodal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pots',
  standalone: true,
  imports: [PotsmodalComponent, MatProgressBarModule, CommonModule],
  templateUrl: './pots.component.html',
  styleUrls: ['./pots.component.scss'],
})
export class PotsComponent implements OnInit {
  @ViewChildren('menuContainer') menuContainers:
    | QueryList<ElementRef>
    | never[] = [];
  progressBarHeight: string = '12px';
  dotsUrl: string = 'assets/dots.png';
  openDropDownIndex: number | null = null;
  modalTitle: string = '';
  modalContent: string = '';
  isModalVisible: boolean = false;
  potsData!: Pots | object;
  selectedPotId: number | null = null;
  pots: (Pots & { animatedWidth?: string })[] = [];

  constructor(
    private potsService: PotsService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPotsData();
  }

  calculateBufferValue(pot: any): number {
    return Math.min(((pot.current + (pot.buffer || 0)) / pot.total) * 100, 100);
  }

  calculatePercentageWidth(pot: Pots): string {
    const percentage = (pot.total / pot.target) * 100;
    return percentage.toFixed(2) + '%';
  }

  getPotsData() {
    this.potsService.getPots().subscribe((data: Pots[]) => {
      this.pots = data.map((p) => ({
        ...p,
        animatedValue: 0,
      }));

      this.pots.forEach((pot) => {
        const targetValue = this.calculatePercentageValue(pot);
        this.animateProgress(pot, targetValue);
      });
    });
  }

  calculatePercentageValue(pot: Pots): number {
    if (!pot?.target || pot.target === 0) return 0;
    return Math.min((pot.total / pot.target) * 100, 100);
  }

  private animateProgress(pot: Pots, target: number) {
    let current = 0;

    const step = () => {
      current += 5;
      pot.animatedValue = Math.min(current, target);

      this.cdr.detectChanges();

      if (current < target) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  addMoney() {
    console.log('moeny is being added');
  }

  withDrawMoney() {
    console.log('money is withdrawing');
  }

  toggleMenu(index: number) {
    if (this.openDropDownIndex === index) {
      this.openDropDownIndex = null;
    } else {
      this.openDropDownIndex = index;
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }

  openEditPotModal(pot: object) {
    this.modalTitle = 'Edit Pot';
    this.modalContent = `As your pot change, feel free to update your spending limits.`;
    this.isModalVisible = false;
    this.potsData = pot;
  }

  openDeletePotModal(potId: number) {
    console.log('Opening modal for pot ID:', potId);
    this.selectedPotId = potId;
    this.isModalVisible = true;
  }

  confirmDeletePot() {
    if (!this.selectedPotId) {
      console.error('Error: pot ID is undefined');
      return;
    }

    this.potsService.deletePot(this.selectedPotId).subscribe({
      next: () => {
        this.pots = this.pots.filter((p) => p.id !== this.selectedPotId);
        this.toastr.success('Pot deleted successfully!');
        this.isModalVisible = false;
        this.selectedPotId = null;
      },
      error: (err) => {
        console.error('Error deleting pot:', err);
        this.toastr.error('Failed to delete pot');
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    let clickedInside = false;

    this.menuContainers.forEach(
      (menu: {
        nativeElement: { contains: (arg0: EventTarget | null) => any };
      }) => {
        if (menu.nativeElement.contains(event.target)) {
          clickedInside = true;
        }
      }
    );

    if (!clickedInside && this.openDropDownIndex !== null) {
      this.openDropDownIndex = null;
    }
  }
}

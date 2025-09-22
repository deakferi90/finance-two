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
  pots: Pots[] = [];
  progressBarHeight: string = '12px';
  dotsUrl: string = 'assets/dots.png';
  openDropDownIndex: number | null = null;
  modalTitle: string = '';
  modalContent: string = '';
  isModalVisible: boolean = false;
  potsData!: Pots | object;

  constructor(
    private potsService: PotsService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPotsData();
  }

  calculatePercentageWidth(pot: Pots): string {
    const percentage = (pot.total / pot.target) * 100;
    return percentage.toFixed(2) + '%';
  }

  getPotsData() {
    this.potsService.getPots().subscribe((data) => {
      this.pots = data;
    });
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

  deletePot(potId: number) {
    console.log(potId);
  }

  openDeletePotModal(potId: any) {
    this.isModalVisible = true;
    // this.potsService.deletePot(potId).subscribe({
    //   next: () => {
    //     const deletedPot = this.pots.find(
    //       (b: { id: number }) => b.id === potId
    //     );
    //     this.pots = this.pots.filter((b: { id: number }) => b.id !== potId);
    //     this.pots.sort((a: Pots, b: Pots) => a.id - b.id);
    //     this.isModalVisible = true;
    //     this.cdr.detectChanges();
    //     this.toastr.success('Pot deleted successfully!');
    //   },
    //   error: (err) => {
    //     console.error('Error deleting pot:', err);
    //     this.toastr.error('Failed to delete pot');
    //   },
    // });
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

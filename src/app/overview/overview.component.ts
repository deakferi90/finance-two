import { Component, HostListener, Input, OnInit } from '@angular/core';
import { OverviewService } from './overview.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  @Input() showFiller: 'open' | 'closed' = 'closed';
  isPortrait = window.matchMedia('(orientation: portrait)').matches;
  balance: any = {};
  constructor(private overviewService: OverviewService) {}
  ngOnInit(): void {
    this.displayData();
    this.handleOrientationChange();
  }

  handleOrientationChange() {
    const contentContainer = document.querySelector('.content-container');

    if (window.matchMedia('(orientation: portrait)').matches) {
      contentContainer?.classList.remove('shifted');
    }
  }

  displayData() {
    this.overviewService
      .getOverviewBudgets()
      .subscribe((data) => (this.balance = data[0].balance));
  }
}

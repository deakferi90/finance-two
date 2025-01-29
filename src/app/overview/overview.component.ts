import { Component, OnInit } from '@angular/core';
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
  balance: any = {};
  constructor(private overviewService: OverviewService) {}

  ngOnInit(): void {
    this.displayData();
  }

  displayData() {
    this.overviewService
      .getOverviewBudgets()
      .subscribe((data) => (this.balance = data[0].balance));
  }
}

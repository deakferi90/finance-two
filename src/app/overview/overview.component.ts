import { Component, Input, OnInit } from '@angular/core';
import { OverviewService } from './overview.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PotsComponent } from '../pots/pots.component';
import { BudgetsComponent } from '../budgets/budgets.component';
import { PotsSharedService } from '../shared/pots-shared.service';
import { Pots } from '../pots/pots.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, HttpClientModule, PotsComponent, BudgetsComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent implements OnInit {
  @Input() showFiller: 'open' | 'closed' = 'closed';
  moneyBag: string = 'assets/money-bag.png';
  isPortrait = window.matchMedia('(orientation: portrait)').matches;

  balance: any = {};

  // ✅ Use Observables instead of local variables
  totalSaved$!: Observable<number>;
  totalPots$!: Observable<Pots[]>;

  constructor(
    private overviewService: OverviewService,
    private sharedService: PotsSharedService
  ) {}

  ngOnInit(): void {
    this.displayData();

    // ✅ Assign observables directly (no subscribe)
    this.totalSaved$ = this.sharedService.totalSaved$;
    this.totalPots$ = this.sharedService.totalPotsData$;
  }

  displayData() {
    this.overviewService
      .getOverviewBudgets()
      .subscribe((data) => (this.balance = data[0].balance));
  }
}

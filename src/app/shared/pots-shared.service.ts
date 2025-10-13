import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pots } from '../pots/pots.interface';
import { Budget } from '../budgets/budgets.interface';

@Injectable({ providedIn: 'root' })
export class PotsSharedService {
  private totalSavedSource = new BehaviorSubject<number>(0);
  private totalPots = new BehaviorSubject<Pots[]>([]);
  private totalBudgets = new BehaviorSubject<Budget[]>([]);
  totalSaved$ = this.totalSavedSource.asObservable();
  totalPotsData$ = this.totalPots.asObservable();

  sendTotalSaved(value: number) {
    this.totalSavedSource.next(value);
  }

  sendTotalPots(potsObjects: Pots[]) {
    this.totalPots.next(potsObjects);
  }

  sendBudgets(budgets: Budget[]) {
    this.totalBudgets.next(budgets);
  }
}

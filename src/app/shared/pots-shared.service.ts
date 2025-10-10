import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pots } from '../pots/pots.interface';

@Injectable({ providedIn: 'root' })
export class PotsSharedService {
  private totalSavedSource = new BehaviorSubject<number>(0);
  private totalPots = new BehaviorSubject<Pots[]>([]);
  totalSaved$ = this.totalSavedSource.asObservable();
  totalPotsData$ = this.totalPots.asObservable();

  sendTotalSaved(value: number) {
    this.totalSavedSource.next(value);
  }

  sendTotalPots(potsObjects: Pots[]) {
    this.totalPots.next(potsObjects);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShowFillerService {
  private showFillerSource = new BehaviorSubject<'open' | 'closed'>('closed');
  showFiller$ = this.showFillerSource.asObservable();

  setShowFiller(value: 'open' | 'closed') {
    this.showFillerSource.next(value);
  }
}

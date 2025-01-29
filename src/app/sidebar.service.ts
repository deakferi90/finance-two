import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private showFillerSubject = new BehaviorSubject<'open' | 'closed'>('closed');

  showFiller$ = this.showFillerSubject.asObservable();

  toggleFiller() {
    this.showFillerSubject.next(
      this.showFillerSubject.value === 'open' ? 'closed' : 'open'
    );
  }

  setFiller(state: 'open' | 'closed') {
    this.showFillerSubject.next(state);
  }

  getFillerState(): 'open' | 'closed' {
    return this.showFillerSubject.value;
  }
}

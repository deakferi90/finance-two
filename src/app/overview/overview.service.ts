import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Overview } from './overview.interface';

@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  dataUrl = 'assets/data.json';
  constructor(private http: HttpClient) {}

  getOverviewBudgets() {
    return this.http.get<Overview[]>(this.dataUrl);
  }
}

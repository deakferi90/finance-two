import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BudgetsService {
  dataUrl = 'assets/data.json';
  constructor(private http: HttpClient) {}

  getBudgets() {
    return this.http.get(this.dataUrl);
  }
}

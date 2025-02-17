import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = 'http://localhost:3000/api/budgets';

  constructor(private http: HttpClient) {}

  updateBudget(updatedBudget: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, updatedBudget);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private apiUrl = 'assets/data.json';

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching budgets:', error);
        return of([]);
      })
    );
  }

  updateBudget(updatedBudget: any): Observable<any> {
    return this.getBudgets().pipe(
      map((budgets: any[]) => {
        const index = budgets.findIndex(
          (budget) => budget.id === updatedBudget.id
        );

        if (index !== -1) {
          budgets[index] = { ...budgets[index], ...updatedBudget };
          this.saveUpdatedBudgets(budgets);
        }

        return updatedBudget;
      }),
      catchError((error) => {
        console.error('Error updating budget:', error);
        return of(null);
      })
    );
  }

  private saveUpdatedBudgets(updatedBudgets: any[]) {
    console.log('Updated Budgets:', updatedBudgets);
  }
}

import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private apiUrl = 'http://localhost:3000/api/budgets';
  private localBudgets: any[] = [];

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((budgets) => {
        this.localBudgets = budgets;
        return budgets;
      }),
      catchError((error) => {
        console.error('Error fetching budgets:', error);
        return of([]);
      })
    );
  }

  updateBudget(updatedBudget: any): Observable<any> {
    this.localBudgets = updatedBudget;
    return this.http
      .put(`${this.apiUrl}/${updatedBudget.id}`, updatedBudget, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Error updating budget:', error);
          return throwError(() => new Error('Update failed'));
        })
      );
  }

  resetBudgets(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset`, {}).pipe(
      map((response) => {
        console.log('✅ Budgets reset:', response);
        return response;
      }),
      catchError((error) => {
        console.error('❌ Error resetting budgets:', error);
        return throwError(() => new Error('Reset failed'));
      })
    );
  }

  deleteBudget(id: string): Observable<any> {
    this.localBudgets = this.localBudgets.filter((budget) => budget.id !== id);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting budget:', error);
        return of(null);
      })
    );
  }

  addBudget(newBudget: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, newBudget).pipe(
      map((budget) => {
        this.localBudgets.push(budget);
        return budget;
      }),
      catchError((error) => {
        console.error('Error adding budget:', error);
        return of(null);
      })
    );
  }
}

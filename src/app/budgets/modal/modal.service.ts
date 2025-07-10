import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Budget } from '../budgets.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private apiUrl = 'http://localhost:3000/api/budgets';
  private localBudgets: any[] = [];

  constructor(private http: HttpClient) {}

  getBudgets(): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.apiUrl}`);
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
    return this.http.post<Budget>(`${this.apiUrl}`, newBudget).pipe(
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

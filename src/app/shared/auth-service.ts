import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthModal } from './auth-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient, private router: Router) {}

  signup(data: AuthModal) {
    return this.httpClient.post(`${this.baseUrl}/register`, data).pipe(
      catchError((error) => {
        // Handle errors properly
        console.error('Signup failed:', error);
        return throwError(
          'Something went wrong during signup. Please try again.'
        );
      })
    );
  }

  login(data: object) {
    return this.httpClient.post(`${this.baseUrl}/login`, data).pipe(
      tap((result: any) => {
        localStorage.setItem('authUser', JSON.stringify(result));
        this.router.navigate(['/overview']);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError('Invalid email or password. Please try again.');
      })
    );
  }

  logout() {
    localStorage.removeItem('authUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authUser') !== null;
  }
}

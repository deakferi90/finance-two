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
  private baseUrl = 'http://localhost:3000'; // You can move this to environment variables for flexibility

  constructor(private httpClient: HttpClient, private router: Router) {}

  // Sign up method
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

  // Login method
  login(data: object) {
    return this.httpClient.post(`${this.baseUrl}/login`, data).pipe(
      tap((result: any) => {
        // Store user data and token in localStorage
        localStorage.setItem('authUser', JSON.stringify(result));
        this.router.navigate(['/overview']); // Redirect to the overview page
      }),
      catchError((error) => {
        // Handle errors properly
        console.error('Login failed:', error);
        return throwError('Invalid email or password. Please try again.');
      })
    );
  }

  // Logout method
  logout() {
    localStorage.removeItem('authUser');
    this.router.navigate(['/login']); // Redirect to login after logout
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem('authUser') !== null;
  }
}

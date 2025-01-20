import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient, private router: Router) {}

  signup(data: { name: string; email: string; password: string }) {
    return this.httpClient.post(`${this.baseUrl}/register`, data);
  }

  login(data: { email: string; password: string }) {
    return this.httpClient.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        localStorage.setItem('authUser', JSON.stringify(response.user));
        this.router.navigate(['/transactions']);
      })
    );
  }

  logout() {
    localStorage.removeItem('authUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('authUser');
  }
}

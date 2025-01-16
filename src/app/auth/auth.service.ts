import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  httpClient = inject(HttpClient);
  router = inject(Router);
  baseUrl = 'http://localhost:3000/api';

  signup(data: any) {
    return this.httpClient.post(`${this.baseUrl}/register`, data);
  }

  login(data: any) {
    return this.httpClient.post(`${this.baseUrl}/login`, data).pipe(
      tap((result) => {
        localStorage.setItem('authUser', JSON.stringify(result));
        this.router.navigate(['/overview']);
      })
    );
  }

  logout() {
    localStorage.removeItem('authUser');
  }

  isLoggedIn() {
    return localStorage.getItem('authUser') !== null;
  }
}

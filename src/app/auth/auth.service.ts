import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: any): any {
    console.log(data);
    return this.http.post(`${this.baseUrl}/signup`, data).pipe(
      tap((result: any) => {
        this.router.navigate(['/login']);
      })
    );
  }

  login(data: any): any {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((result: any) => {
        localStorage.setItem('authUser', JSON.stringify(result));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authUser') !== null;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // Replace with your API base URL

  constructor(private httpClient: HttpClient) {}

  // Existing signup method
  signup(data: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/register`, data);
  }

  // New login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/login`, credentials);
  }
}

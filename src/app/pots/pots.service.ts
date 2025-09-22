import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pots } from './pots.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PotsService {
  potsUrl = 'http://localhost:3000/api/pots';
  constructor(private http: HttpClient) {}

  getPots(): Observable<any[]> {
    return this.http.get<Pots[]>(this.potsUrl);
  }
}

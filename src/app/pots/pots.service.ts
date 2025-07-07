import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pots } from './pots.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PotsService {
  dataUrl = 'assets/data.json';
  constructor(private http: HttpClient) {}

  getPots(): Observable<any[]> {
    return this.http.get<Pots[]>(this.dataUrl);
  }
}

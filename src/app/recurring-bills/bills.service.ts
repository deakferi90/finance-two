import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { recurringBills } from './recurringBills.interface';

@Injectable({
  providedIn: 'root',
})
export class BillsService {
  billsUrl = 'http://localhost:3000/api/recurringBills';
  constructor(private http: HttpClient) {}

  getBillsTotalValue() {
    return this.http.get<recurringBills[]>(this.billsUrl);
  }
}

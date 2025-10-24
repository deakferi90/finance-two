import { Component, Input, OnInit } from '@angular/core';
import { BillsService } from './bills.service';
import { recurringBills } from './recurringBills.interface';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recurring-bills',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './recurring-bills.component.html',
  styleUrl: './recurring-bills.component.scss',
})
export class RecurringBillsComponent implements OnInit {
  @Input() hideButton: boolean = true;
  totalBills: number = 0;
  billsUrl: string = 'assets/recurring-bills.svg';
  allBills: recurringBills[] = [];
  sortOrder: 'latest' | 'oldest' = 'latest';
  searchText: string = '';
  calculatedBills: object[] = [];
  reducedAll: number = 0;
  totals: { ok: number; bad: number; neutral: number; all: number } | null =
    null;

  constructor(private billsService: BillsService) {}

  ngOnInit(): void {
    this.getTotalBillsPrice();
    this.getBillsAmountByStatus();
  }

  getDayFromDueDate(dueDate: string): number {
    const match = dueDate.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  filterTable(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchText = input.value;
  }

  get displayedBills(): recurringBills[] {
    let filterTable = this.allBills.filter((bill) => {
      return bill.title.toLowerCase().includes(this.searchText.toLowerCase());
    });

    return filterTable.slice().sort((a, b) => {
      const dayA = this.getDayFromDueDate(a.dueDate);
      const dayB = this.getDayFromDueDate(b.dueDate);
      return this.sortOrder === 'oldest' ? dayB - dayA : dayA - dayB;
    });
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'oldest' ? 'latest' : 'oldest';
  }

  sendRecurringBillsData(bills: any) {
    this.reducedAll = bills.reduce(
      (prev: any, cur: any) => prev + cur.amount,
      0
    );
  }

  getTotalBillsPrice() {
    this.billsService
      .getBillsTotalValue()
      .subscribe((bills: recurringBills[]) => {
        this.allBills = bills;
        this.sendRecurringBillsData(this.allBills);
        this.totalBills = bills.reduce((prev, cur) => prev + cur.amount, 0);
      });
  }

  getBillsAmountByStatus() {
    this.billsService.getBillsTotals().subscribe((data) => {
      this.totals = data;
    });
  }

  getAvatarUrl(title: string): string {
    const map: Record<string, string> = {
      Elevate: 'Elevate.png',
      Spark: 'Spark.png',
      Serenity: 'Serenity.png',
      Pixel: 'Pixel.png',
      Nimbus: 'Nimbus.png',
      ByteWise: 'ByteWise.png',
      EcoFuel: 'EcoFuel.png',
      AquaFlow: 'AquaFlow.png',
    };

    const key = Object.keys(map).find((k) => title.includes(k));
    return key ? `assets/${map[key]}` : 'assets/Elevate.png';
  }
}

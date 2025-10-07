import { Component, OnInit } from '@angular/core';
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
  totalBills: number = 0;
  billsUrl: string = 'assets/recurring-bills.svg';
  allBills: recurringBills[] = [];
  sortOrder: 'latest' | 'oldest' = 'latest';

  constructor(private billsService: BillsService) {}

  ngOnInit(): void {
    this.getTotalBillsPrice();
  }

  getDayFromDueDate(dueDate: string): number {
    const match = dueDate.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  get sortedBills(): recurringBills[] {
    return this.allBills.slice().sort((a, b) => {
      const dayA = this.getDayFromDueDate(a.dueDate);
      const dayB = this.getDayFromDueDate(b.dueDate);
      return this.sortOrder === 'oldest' ? dayB - dayA : dayA - dayB;
    });
  }

  getTotalBillsPrice() {
    this.billsService
      .getBillsTotalValue()
      .subscribe((bills: recurringBills[]) => {
        this.allBills = bills;
        this.totalBills = bills.reduce((prev, cur) => prev + cur.amount, 0);
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

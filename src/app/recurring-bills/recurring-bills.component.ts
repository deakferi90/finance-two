import { Component, OnInit } from '@angular/core';
import { BillsService } from './bills.service';
import { recurringBills } from './recurringBills.interface';
import { MatSelect, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-recurring-bills',
  standalone: true,
  imports: [MatSelectModule],
  templateUrl: './recurring-bills.component.html',
  styleUrl: './recurring-bills.component.scss',
})
export class RecurringBillsComponent implements OnInit {
  totalBills: number = 0;
  billsUrl: string = 'assets/recurring-bills.svg';

  constructor(private billsService: BillsService) {}

  ngOnInit(): void {
    this.getTotalBillsPrice();
  }

  getTotalBillsPrice() {
    this.billsService
      .getBillsTotalValue()
      .subscribe((bills: recurringBills[]) => {
        console.log(bills);

        this.totalBills = bills.reduce((prev, cur) => prev + cur.amount, 0);
      });
  }
}

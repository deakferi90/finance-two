import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { HttpClientModule } from '@angular/common/http';
import { Transaction } from './transaction.interface';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  selectedTransaction: string | undefined;
  selectedTimeline: string | undefined;
  pages: number[] = [];
  timeLines: { id: number; value: string }[] = [
    {
      id: 1,
      value: 'Latest',
    },
    {
      id: 2,
      value: 'Oldest',
    },
  ];

  categories: { id: number; value: string }[] = [
    {
      id: 3,
      value: 'All Transactions',
    },
    {
      id: 4,
      value: 'Small Transactions',
    },
    {
      id: 5,
      value: 'Large Transactions',
    },
  ];
  sidenavOpen: boolean = false;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  type: any;

  constructor(private transactionService: TransactionsService) {}

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.updatePageData(event.pageIndex);
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredTransactions.length / this.pageSize
    );

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    if (this.totalPages === 0) {
      this.pages = [];
    }
  }

  updatePageData(pageIndex = 0) {
    const startIndex = pageIndex * this.pageSize;
    this.paginatedData = this.filteredTransactions.slice(
      startIndex,
      startIndex + this.pageSize
    );
    this.currentPage = pageIndex;
  }

  paginatedData: any = [];
  pageSize = 10;
  totalPages = Math.ceil(this.transactions.length / this.pageSize);
  currentPage = 0;

  onPrevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePageData(this.currentPage);
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePageData(this.currentPage);
    }
  }

  showData() {
    this.transactionService.getTransactions().subscribe((data) => {
      this.transactions = data[0]['transactions'];
      this.filteredTransactions = this.transactions;
      console.log(this.filteredTransactions);
      this.totalPages = Math.ceil(this.transactions.length / this.pageSize);
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.updatePageData();
    });
  }

  ngOnInit(): void {
    this.showData();
  }

  filterTable(event: Event) {
    console.log('no changes');
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();
    this.filteredTransactions = this.transactions.filter((item) =>
      item.name.toLowerCase().includes(value)
    );

    this.currentPage = 0;

    this.totalPages = Math.ceil(
      this.filteredTransactions.length / this.pageSize
    );

    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePageData();
  }

  showPage(pageNumber: number): void {
    this.updatePageData(pageNumber);
  }

  onTimelineChange(selectedTimeline: string) {
    if (selectedTimeline === 'Latest') {
      this.filteredTransactions.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else {
      this.filteredTransactions.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    }
    this.updatePagination();
    this.updatePageData();
  }

  onCategoryChange(selectedCategory: string) {
    if (selectedCategory === 'All Transactions') {
      this.filteredTransactions = [...this.transactions];
    } else if (selectedCategory === 'Small Transactions') {
      this.filteredTransactions = this.transactions.filter((item) => {
        return item.amount < 0 && item.amount >= -50;
      });
    } else if (selectedCategory === 'Large Transactions') {
      this.filteredTransactions = this.transactions.filter((item) => {
        return item.amount >= 50 || item.amount < -50;
      });
    }

    this.filteredTransactions.sort((a, b) => b.amount - a.amount);

    if (selectedCategory === 'Small Transactions') {
      this.filteredTransactions.sort((a, b) => a.amount - b.amount);
    }

    this.updatePagination();
    this.updatePageData();
  }
}

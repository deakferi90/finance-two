import { Component, OnInit, ViewChild } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { HttpClientModule } from '@angular/common/http';
import { Transaction } from './transaction.interface';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelect, MatSelectModule } from '@angular/material/select';
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
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  svgSortMobile: string = 'assets/icon-sort-mobile.svg';
  selectedTransaction: string | undefined;
  selectedTimeline: string | undefined;
  pages: (number | string)[] = [];
  timeLines: { id: number; value: string }[] = [
    { id: 1, value: 'Latest' },
    { id: 2, value: 'Oldest' },
  ];
  categories: { id: number; value: string }[] = [
    { id: 3, value: 'All Transactions' },
    { id: 4, value: 'Small Transactions' },
    { id: 5, value: 'Large Transactions' },
  ];
  sidenavOpen: boolean = false;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  type: any;
  selectedTimeLine: string | null = null;
  selectedCategory: string | null = null;

  @ViewChild('sortSelect') sortSelect!: MatSelect;
  @ViewChild('categorySelect') categorySelect!: MatSelect;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  paginatedData: any = [];
  pageSize = 10;
  totalPages = 0;
  currentPage = 0;

  constructor(private transactionService: TransactionsService) {}

  ngOnInit(): void {
    this.showPagination();
    this.showData();
  }

  showData() {
    this.transactionService.getTransactions().subscribe((data) => {
      this.transactions = data[0]['transactions'];
      this.filteredTransactions = this.transactions;
      this.updatePagination();
      this.updatePageData();
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.updatePageData(event.pageIndex);
    this.showPagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredTransactions.length / this.pageSize
    );
    this.showPagination();
  }

  updatePageData(pageIndex = this.currentPage) {
    const startIndex = pageIndex * this.pageSize;
    this.paginatedData = this.filteredTransactions.slice(
      startIndex,
      startIndex + this.pageSize
    );
    this.currentPage = pageIndex;
  }

  onPrevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePageData(this.currentPage);
      this.showPagination();
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updatePageData(this.currentPage);
      this.showPagination();
    }
  }

  filterTable(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.toLowerCase();
    this.filteredTransactions = this.transactions.filter((item) =>
      item.name.toLowerCase().includes(value)
    );
    this.currentPage = 0;
    this.updatePagination();
    this.updatePageData();
  }

  showPage(pageNumber: number): void {
    this.updatePageData(pageNumber);
    this.showPagination();
  }

  onTimelineChange(selectedTimeline: string) {
    this.selectedTimeline = selectedTimeline;
    if (selectedTimeline === 'Latest') {
      this.filteredTransactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      this.filteredTransactions.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
    this.updatePagination();
    this.updatePageData();
  }

  onCategoryChange(selectedCategory: string) {
    this.selectedCategory = selectedCategory;
    if (selectedCategory === 'All Transactions') {
      this.filteredTransactions = [...this.transactions];
    } else if (selectedCategory === 'Small Transactions') {
      this.filteredTransactions = this.transactions.filter(
        (item) => item.amount < 0 && item.amount >= -50
      );
    } else if (selectedCategory === 'Large Transactions') {
      this.filteredTransactions = this.transactions.filter(
        (item) => item.amount >= 50 || item.amount < -50
      );
    }
    this.filteredTransactions.sort((a, b) => b.amount - a.amount);
    if (selectedCategory === 'Small Transactions') {
      this.filteredTransactions.sort((a, b) => a.amount - b.amount);
    }
    this.updatePagination();
    this.updatePageData();
  }

  showPagination() {
    if (this.totalPages <= 4) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    } else {
      if (this.currentPage === 0) {
        this.pages = [1, 2, 3, 4];
      } else if (this.currentPage === 1) {
        this.pages = [1, 2, 3, '...'];
      } else if (this.currentPage === 2) {
        this.pages = [1, 2, 3, '...'];
      } else if (this.currentPage === this.totalPages - 2) {
        this.pages = [1, '...', this.totalPages - 2, this.totalPages - 1];
      } else if (this.currentPage === this.totalPages - 1) {
        this.pages = [
          '...',
          this.totalPages - 2,
          this.totalPages - 1,
          this.totalPages,
        ];
        console.log('is this the step');
      } else if (this.currentPage === this.totalPages - 1) {
        this.pages = [1, 2, '...'];
      } else {
        this.pages = [1, '...', this.currentPage - 1];
      }
    }
  }
}

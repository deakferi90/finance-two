import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from 'chart.js';
import { Budget } from '../budgets.interface';
import { HttpClientModule } from '@angular/common/http';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('myDonutChart') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() budgets: Budget[] = [];
  @Input() spent: number[] = [];
  @Output() spentValues = new EventEmitter<number[]>();
  @Output() chartRedraw = new EventEmitter<void>();

  chart: Chart | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    Chart.register({
      id: 'centerText',
      afterDraw: (chart: any) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        const dataset = chart.data.datasets[0];
        const totalSpent = dataset.data.reduce(
          (acc: number, val: number) => acc + Math.abs(val),
          0
        );

        const totalBudget = this.budgets
          .filter((b) => !b.optional)
          .reduce((acc, b) => acc + b.amount, 0);

        const bigText = `$${Math.floor(totalSpent)}`;
        const smallText = `of $${totalBudget} limit`;

        ctx.save();
        ctx.font = `${Math.min(width / 6, 30)}px Arial`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bigText, width / 2, height / 2 - 10);

        ctx.font = `${Math.min(width / 2, 16)}px Arial`;
        ctx.fillStyle = 'gray';
        ctx.fillText(smallText, width / 2, height / 2 + 20);
        ctx.restore();
      },
    });
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['budgets'] || changes['spent']) {
      this.refreshChart();
    }
  }

  private getFilteredBudgets() {
    return this.budgets.filter((b) => !b.optional);
  }

  createChart() {
    if (!this.canvasRef?.nativeElement) return;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) this.chart.destroy();

    const filteredBudgets = this.budgets.filter((b) => !b.optional);
    const filteredSpent = this.spent.slice(0, filteredBudgets.length);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: filteredBudgets.map((b) => b.category),
        datasets: [
          {
            label: 'Spent',
            data: filteredSpent,
            backgroundColor: filteredBudgets.map((b) => b.theme),
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        responsive: false,
        cutout: '65%',
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
      },
    });
  }

  refreshChart() {
    // Force Angular to detect changes and recreate chart
    setTimeout(() => {
      this.spentValues.emit(this.spent);
      this.createChart();
      this.chartRedraw.emit();
      this.cdr.detectChanges();
    }, 0);
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
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
export class DonutChartComponent implements AfterViewInit {
  @ViewChild('myDonutChart') private canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() budgets: Budget[] = [];
  @Input() spent: any[] = [];
  @Input() getAbsoluteSpent!: (budget: Budget) => number;
  @Output() spentValues = new EventEmitter<any>();

  chart: Chart | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    this.createChart();
    this.spentData();
  }

  spentData() {
    this.spent = this.spent.map((value) =>
      isNaN(value) ? 0 : Math.abs(value)
    );
    this.spentValues.emit(this.spent);
  }

  createChart() {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      const ctx = this.canvasRef.nativeElement.getContext('2d');

      const filteredBudgets = this.budgets.filter((budget) => !budget.optional);

      const totalBudget = filteredBudgets.reduce(
        (acc, budget) => acc + budget.maximum,
        0
      );

      const filteredSpent = this.spent.slice(0, filteredBudgets.length);

      const totalSpent = filteredSpent.reduce(
        (acc, spent) => acc + Math.abs(spent),
        0
      );

      const bigText = `$${Math.floor(Number(totalSpent))}`;

      const centerTextPlugin = {
        id: 'centerText',
        afterDraw(chart: { width: any; height: any; ctx: any }) {
          const { width, height, ctx } = chart;
          ctx.save();
          const smallText = `of $${totalBudget} limit`;
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
      };

      Chart.register(centerTextPlugin);

      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: filteredBudgets.map((budget) => budget.category),
            datasets: [
              {
                label: 'Spent',
                data: filteredSpent,
                backgroundColor: filteredBudgets.map((budget) => budget.theme),
                hoverOffset: 4,
              },
            ],
          },
          options: {
            aspectRatio: 2.25,
            responsive: false,
            cutout: '65%',
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: (tooltipItem: any) => {
                    const value = Math.abs(tooltipItem.raw);
                    return `${tooltipItem.label}: $${Math.floor(value)}`;
                  },
                },
              },
            },
            layout: {
              padding: 20,
            },
          },
        });
      } else {
        console.error('Canvas context not found');
      }
    } else {
      console.error('Canvas element not available');
    }
  }
}

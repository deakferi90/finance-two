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
  @Input() filteredBudgets: Budget[] = [];
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
    this.spent = this.spent.map(Math.abs);
    this.spentValues.emit(this.spent);
  }

  createChart() {
    if (this.canvasRef && this.canvasRef.nativeElement) {
      const ctx = this.canvasRef.nativeElement.getContext('2d');

      const totalBudget = this.filteredBudgets.reduce(
        (acc, budget) => acc + budget.maximum,
        0
      );

      const totalSpent = this.spent.reduce(
        (acc: any, budget: any) => acc + Math.abs(budget)
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
            labels: [
              'Entertainment',
              'Bills',
              'Groceries',
              'Dining Out',
              'Transportation',
              'Personal Care',
              'Education',
            ],
            datasets: [
              {
                label: 'Spent',
                data: this.spent,
                backgroundColor: [
                  '#277C78',
                  '#82C9D7',
                  '#426CD5',
                  '#F2CDAC',
                  '#FFA500b3',
                  '#626070',
                  '#FFB6C1CC',
                ],
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
                    const integerValue = Math.floor(value);
                    return `${tooltipItem.label}: $${integerValue}`;
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

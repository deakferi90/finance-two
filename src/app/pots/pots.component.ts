import { Component, OnInit } from '@angular/core';
import { PotsService } from './pots.service';
import { Pots } from './pots.interface';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pots',
  standalone: true,
  imports: [MatProgressBarModule, CommonModule],
  templateUrl: './pots.component.html',
  styleUrls: ['./pots.component.scss'],
})
export class PotsComponent implements OnInit {
  pots: Pots[] = [];
  progressBarHeight: string = '12px';

  constructor(private potsService: PotsService) {}

  ngOnInit(): void {
    this.getPotsData();
  }

  calculatePercentageWidth(pot: Pots): string {
    const percentage = (pot.total / pot.target) * 100;
    return percentage.toFixed(2) + '%';
  }

  getPotsData() {
    this.potsService.getPots().subscribe((data) => {
      this.pots = data[0]?.pots || [];
      console.log(this.pots);
    });
  }

  addMoney() {
    console.log('moeny is being added');
  }

  withDrawMoney() {
    console.log('money is withdrawing');
  }
}

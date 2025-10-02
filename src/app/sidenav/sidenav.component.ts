import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('drawerAnimation', [
      state(
        'open',
        style({
          transform: 'translateX(0)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'translateX(-250px)',
        })
      ),
      transition('closed <=> open', [animate('0.5s ease-out')]),
    ]),
  ],
})
export class SidenavComponent implements OnInit {
  svgLogoUrl!: SafeResourceUrl;
  selectedMenuItem: any = null;
  hoveredItem: any = null;
  arrow!: SafeResourceUrl;
  @Input() showFiller: 'open' | 'closed' = 'closed';
  @Input() isOpen: boolean = false;
  active: boolean = true;
  currentTitle = '';

  menuItems = [
    {
      id: 1,
      label: 'Overview',
      imgUrl: 'assets/home.svg',
      activeImgUrl: 'assets/home-active.svg',
      link: 'overview',
    },
    {
      id: 2,
      label: 'Transactions',
      imgUrl: 'assets/transactions.svg',
      activeImgUrl: 'assets/transactions-active.svg',
      link: 'transactions',
    },
    {
      id: 3,
      label: 'Budgets',
      imgUrl: 'assets/chart-logo.svg',
      activeImgUrl: 'assets/chart-logo-active.svg',
      link: 'budgets',
    },
    {
      id: 4,
      label: 'Pots',
      imgUrl: 'assets/pots.svg',
      activeImgUrl: 'assets/pots-active.svg',
      link: 'pots',
    },
    {
      id: 5,
      label: 'Recurring Bills',
      imgUrl: 'assets/bills.svg',
      activeImgUrl: 'assets/bills-active.svg',
      link: 'recurring-bills',
    },
  ];

  constructor(private sanitizer: DomSanitizer, private router: Router) {
    this.svgLogoUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/logo.svg');
    this.arrow = this.sanitizer.bypassSecurityTrustResourceUrl(
      'assets/minimize.svg'
    );
  }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.updateActiveMenu();
      const currentRoute = this.router.url.split('/').pop();
      const activeItem = this.menuItems.find(
        (item) => item.link === currentRoute
      );
      this.currentTitle = activeItem ? activeItem.label : '';
    });
  }

  onHoverItem(item: any): void {
    this.hoveredItem = item;
  }

  toggleSidenav(): void {
    this.showFiller = this.showFiller === 'closed' ? 'open' : 'closed';
    const logo = document.querySelector('.btn-logo');
    if (this.showFiller === 'open') {
      logo?.classList.add('left');
    } else {
      logo?.classList.remove('left');
    }
  }

  trackById(item: any): any {
    return item.id;
  }

  onLinkClick(item: any): void {
    this.selectedMenuItem = item;
    this.router.navigate([item.link]);
  }

  updateActiveMenu(): void {
    const currentUrl = this.router.url.slice(1);
    this.selectedMenuItem =
      this.menuItems.find((item) => item.link === currentUrl) || null;
  }
}

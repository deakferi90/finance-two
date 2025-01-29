import { Component, Input } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ShowFillerService } from './show-filler.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidenavComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showFiller: 'open' | 'closed' = 'closed';
  isOpen: boolean = false;
  title = 'personal-finance';
  showLayout = true;

  constructor(
    private router: Router,
    private showFillerService: ShowFillerService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url;
        if (
          currentRoute === '/login' ||
          currentRoute === '/signup' ||
          currentRoute === '/'
        ) {
          this.showLayout = false;
        } else {
          this.showLayout = true;
        }
      });
  }

  updateShowFiller(value: 'open' | 'closed') {
    this.showFillerService.setShowFiller(value);
  }
}

import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { PotsComponent } from './pots/pots.component';
import { RecurringBillsComponent } from './recurring-bills/recurring-bills.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard] },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'budgets', component: BudgetsComponent, canActivate: [AuthGuard] },
  { path: 'pots', component: PotsComponent, canActivate: [AuthGuard] },
  {
    path: 'recurring-bills',
    component: RecurringBillsComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/overview' },
];

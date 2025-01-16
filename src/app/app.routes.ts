import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { PotsComponent } from './pots/pots.component';
import { RecurringBillsComponent } from './recurring-bills/recurring-bills.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

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
  { path: 'overview', component: OverviewComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'pots', component: PotsComponent },
  { path: 'recurring-bills', component: RecurringBillsComponent },
  { path: '**', redirectTo: '/overview' },
];

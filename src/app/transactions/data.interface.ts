import { Transaction } from './transaction.interface';

interface Data {
  balance: {
    current: number;
    income: number;
    expenses: number;
  };
  budgets: object[];
  pots: object[];
  transactions: Transaction[];
}

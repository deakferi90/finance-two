export interface recurringBills {
  id: number;
  _id: string;
  avatar: string;
  title: string;
  dueDate: string;
  status: 'ok' | 'bad' | 'neutral';
  amount: number;
}

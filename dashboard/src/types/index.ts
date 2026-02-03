export interface Transaction {
  id: number;
  date: string;
  user: string;
  category: string;
  amount: number;
  merchant: string;
  note?: string;
  source: string;
  confirmed: boolean;
  streak?: number;
}

export interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  budgetAmount?: number;
  totalSpent?: number;
  remaining?: number;
  percentUsed?: number;
}

export interface Budget {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentUsed: number;
  daysLeftInMonth: number;
  dailyBudget: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  targetDate: string;
  percentComplete: number;
  remaining: number;
  monthsToGo: number;
}

export interface DashboardData {
  month: string;
  budget: Budget;
  categories: Category[];
  recentTransactions: Transaction[];
  savingsGoal?: SavingsGoal;
}

export type Theme = 'light' | 'dark';

export interface User {
  name: string;
  initial: string;
}

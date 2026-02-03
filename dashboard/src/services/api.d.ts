import { AxiosInstance } from 'axios';
import { DashboardData, Transaction, Category, SavingsGoal } from '../types';

export interface CreateTransactionRequest {
  user: string;
  category: string;
  amount: number;
  merchant?: string;
  note?: string;
}

// Declare the API instance
declare const api: AxiosInstance;

// Export functions with proper return types
export function getOverview(): Promise<Partial<DashboardData>>;
export function getCategories(): Promise<Category[]>;
export function getTransactions(category?: string): Promise<Transaction[]>;
export function addTransaction(transaction: CreateTransactionRequest): Promise<Transaction>;
export function getGoal(): Promise<SavingsGoal | null>;

export default api;

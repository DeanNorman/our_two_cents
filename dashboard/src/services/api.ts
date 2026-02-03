import axios from 'axios';
import { DashboardData, Transaction, Category, SavingsGoal } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/dashboard';
const TOKEN = import.meta.env.VITE_DASHBOARD_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  if (TOKEN) {
    config.headers['Authorization'] = `Bearer ${TOKEN}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getOverview = async (): Promise<Partial<DashboardData>> => {
  const response = await api.get('/overview');
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const getTransactions = async (category?: string): Promise<Transaction[]> => {
  const url = category ? `/transactions/${category}` : '/transactions';
  const response = await api.get(url);
  return response.data;
};

export type CreateTransactionRequest = {
  user: string;
  category: string;
  amount: number;
  merchant?: string;
  note?: string;
};

export const addTransaction = async (
  transaction: CreateTransactionRequest
): Promise<Transaction> => {
  const response = await api.post('/transactions', transaction);
  return response.data;
};

export const getGoal = async (): Promise<SavingsGoal | null> => {
  const response = await api.get('/goal');
  return response.data;
};

export default api;

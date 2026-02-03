import { DashboardData, Transaction, Category } from '../types';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: formatDate(today),
    user: 'Dean',
    category: 'groceries',
    amount: 245,
    merchant: 'Woolworths',
    note: '',
    source: 'bot',
    confirmed: true,
  },
  {
    id: 2,
    date: formatDate(today),
    user: 'Abigail',
    category: 'dining',
    amount: 65,
    merchant: 'Vida e Caffè',
    note: '',
    source: 'bot',
    confirmed: true,
  },
  {
    id: 3,
    date: formatDate(yesterday),
    user: 'Dean',
    category: 'transport',
    amount: 850,
    merchant: 'Engen',
    note: 'Petrol',
    source: 'bot',
    confirmed: true,
  },
  {
    id: 4,
    date: formatDate(yesterday),
    user: 'Abigail',
    category: 'groceries',
    amount: 180,
    merchant: 'Spar',
    note: '',
    source: 'bot',
    confirmed: true,
  },
  {
    id: 5,
    date: formatDate(yesterday),
    user: 'Dean',
    category: 'entertainment',
    amount: 120,
    merchant: 'Netflix',
    note: 'Monthly subscription',
    source: 'bot',
    confirmed: true,
  },
  {
    id: 6,
    date: formatDate(twoDaysAgo),
    user: 'Abigail',
    category: 'shopping',
    amount: 450,
    merchant: 'Zara',
    note: '',
    source: 'bot',
    confirmed: true,
  },
  {
    id: 7,
    date: formatDate(twoDaysAgo),
    user: 'Dean',
    category: 'dining',
    amount: 320,
    merchant: 'Ocean Basket',
    note: 'Date night',
    source: 'bot',
    confirmed: true,
  },
  {
    id: 8,
    date: formatDate(twoDaysAgo),
    user: 'Abigail',
    category: 'transport',
    amount: 85,
    merchant: 'Uber',
    note: '',
    source: 'bot',
    confirmed: true,
  },
];

export const mockCategories: Category[] = [
  {
    id: 'groceries',
    name: 'groceries',
    displayName: 'Groceries',
    icon: '🛒',
    color: '#7CB87A',
    budgetAmount: 5000,
    totalSpent: 1800,
    remaining: 3200,
    percentUsed: 36,
  },
  {
    id: 'dining',
    name: 'dining',
    displayName: 'Dining Out',
    icon: '🍽️',
    color: '#C47FD4',
    budgetAmount: 2500,
    totalSpent: 2300,
    remaining: 200,
    percentUsed: 92,
  },
  {
    id: 'transport',
    name: 'transport',
    displayName: 'Transport',
    icon: '🚗',
    color: '#4A90E2',
    budgetAmount: 2000,
    totalSpent: 1200,
    remaining: 800,
    percentUsed: 60,
  },
  {
    id: 'entertainment',
    name: 'entertainment',
    displayName: 'Entertainment',
    icon: '🎬',
    color: '#F5A623',
    budgetAmount: 1500,
    totalSpent: 850,
    remaining: 650,
    percentUsed: 57,
  },
  {
    id: 'shopping',
    name: 'shopping',
    displayName: 'Shopping',
    icon: '🛍️',
    color: '#BD10E0',
    budgetAmount: 1000,
    totalSpent: 450,
    remaining: 550,
    percentUsed: 45,
  },
  {
    id: 'home',
    name: 'home',
    displayName: 'Home & Bills',
    icon: '🏠',
    color: '#D0021B',
    budgetAmount: 12000,
    totalSpent: 12000,
    remaining: 0,
    percentUsed: 100,
  },
  {
    id: 'health',
    name: 'health',
    displayName: 'Health',
    icon: '🏥',
    color: '#7ED321',
    budgetAmount: 500,
    totalSpent: 0,
    remaining: 500,
    percentUsed: 0,
  },
  {
    id: 'other',
    name: 'other',
    displayName: 'Other',
    icon: '📦',
    color: '#9013FE',
    budgetAmount: 500,
    totalSpent: 150,
    remaining: 350,
    percentUsed: 30,
  },
];

export const mockDashboardData: DashboardData = {
  month: '2026-02',
  budget: {
    totalBudget: 25000,
    totalSpent: 12450,
    remaining: 12550,
    percentUsed: 50,
    daysLeftInMonth: 18,
    dailyBudget: 697,
  },
  categories: mockCategories,
  recentTransactions: mockTransactions,
  savingsGoal: {
    id: 'house-deposit',
    name: 'House Deposit',
    icon: '🏠',
    targetAmount: 500000,
    currentSavings: 45000,
    monthlyContribution: 8000,
    targetDate: '2031-06-01',
    percentComplete: 9,
    remaining: 455000,
    monthsToGo: 57,
  },
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const getDateLabel = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${daysAgo} days ago`;
  }
};

export const groupTransactionsByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
  return transactions.reduce((groups, transaction) => {
    const label = getDateLabel(transaction.date);
    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);
};

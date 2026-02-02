import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/dashboard';
const DASHBOARD_TOKEN = import.meta.env.VITE_DASHBOARD_TOKEN || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-dashboard-token': DASHBOARD_TOKEN,
  },
});

export const getOverview = async () => {
  const response = await api.get('/overview');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};

export const getGoal = async () => {
  const response = await api.get('/goal');
  return response.data;
};

export default api;

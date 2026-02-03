import React, { useEffect, useState } from 'react';
import { getOverview, getGoal } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import TransactionList from '../components/TransactionList';
import SavingsGoal from '../components/SavingsGoal';
import { Wallet, TrendingDown, Calendar, AlertCircle } from 'lucide-react';

const Overview = () => {
  const [data, setData] = useState(null);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewData, goalData] = await Promise.all([
          getOverview(),
          getGoal()
        ]);
        setData(overviewData);
        setGoal(goalData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">
        <div className="flex flex-col items-center gap-2">
            <AlertCircle size={48} />
            <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const { month, totalBudget, totalSpent, percentUsed, categories, recentTransactions } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Our Two Cents</h1>
            <p className="text-gray-600">Overview for {month}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={18} />
            <span>{new Date().toLocaleDateString('en-ZA', { dateStyle: 'full' })}</span>
          </div>
        </div>

        {/* Savings Goal - Center Stage */}
        <SavingsGoal goal={goal} />

        {/* Monthly Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">R{totalBudget.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">R{totalSpent.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <TrendingDown size={24} className="rotate-180" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">R{(totalBudget - totalSpent).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Category Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.categoryId} category={cat} />
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <TransactionList transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default Overview;

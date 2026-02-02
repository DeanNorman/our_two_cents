import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Calendar, RefreshCw } from 'lucide-react';
import CategoryCard from './components/CategoryCard';
import TransactionList from './components/TransactionList';
import SavingsGoal from './components/SavingsGoal';
import { getOverview } from './services/api';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const overview = await getOverview();
      setData(overview);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 2 minutes to avoid Google Sheets API rate limiting
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <p className="text-gray-600 text-lg">Loading your budget data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { month, totalSpent, totalBudget, percentUsed, categories, recentTransactions, savingsGoal } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="text-blue-500" size={36} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Our Two Cents</h1>
                <p className="text-sm text-gray-600">Budget Dashboard</p>
              </div>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="text-blue-500" size={24} />
              <h3 className="text-sm font-medium text-gray-600">Current Month</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-500" size={24} />
              <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">R{totalSpent.toLocaleString()}</p>
            <p className="text-sm text-gray-500 mt-1">of R{totalBudget.toLocaleString()} budget</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="text-purple-500" size={24} />
              <h3 className="text-sm font-medium text-gray-600">Budget Used</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{percentUsed}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  percentUsed >= 90 ? 'bg-red-500' : percentUsed >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Savings Goal */}
        {savingsGoal && (
          <div className="mb-8">
            <SavingsGoal goal={savingsGoal} />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.category} category={category} />
            ))}
          </div>
        </div>

        <div>
          <TransactionList transactions={recentTransactions} />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          {lastUpdated && (
            <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
          )}
          <p className="mt-2">Log spends via WhatsApp: +1 415 523 8886</p>
        </div>
      </main>
    </div>
  );
}

export default App;

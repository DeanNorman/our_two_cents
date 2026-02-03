import React, { useState, useEffect, useMemo } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategories, getTransactions } from '../services/api';
import { TransactionsList } from '../components/TransactionsList';
import { GlassCard } from '../components/ui/GlassCard';
import { AddTransactionModal, FloatingActionButton } from '../components/AddTransactionModal';
import { WhatsAppQuickActions } from '../components/WhatsAppQuickActions';
import { Category, Transaction } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export const DashboardHome: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  
  // Fetch real data from API with auto-refresh
  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      setLoading(true);

      const [categoriesResult, transactionsResult] = await Promise.allSettled([
        getCategories(),
        getTransactions(),
      ]);

      if (cancelled) {
        return;
      }

      if (categoriesResult.status === 'fulfilled') {
        setCategories(categoriesResult.value);
      } else {
        setError(categoriesResult.reason?.message || 'Failed to fetch categories');
      }

      if (transactionsResult.status === 'fulfilled') {
        setRecentTransactions(transactionsResult.value);
      } else {
        setError(transactionsResult.reason?.message || 'Failed to fetch transactions');
      }

      if (categoriesResult.status === 'fulfilled' && transactionsResult.status === 'fulfilled') {
        setError(null);
      }

      setLoading(false);
    };

    const refreshTransactions = async () => {
      try {
        const transactionsData = await getTransactions();
        if (cancelled) {
          return;
        }
        setRecentTransactions(transactionsData);
        setError(null);
      } catch (err: any) {
        if (cancelled) {
          return;
        }
        setError(err?.message || 'Failed to fetch transactions');
      }
    };

    loadInitial();

    const refreshInterval = setInterval(() => {
      refreshTransactions();
    }, 10000);

    return () => {
      cancelled = true;
      clearInterval(refreshInterval);
    };
  }, []);

  const categoriesForDisplay = useMemo<Category[]>(() => {
    if (categories.length > 0) {
      return categories;
    }

    const ids = Array.from(
      new Set(recentTransactions.map((t) => t.category).filter(Boolean))
    );

    return ids.map((id) => ({
      id,
      name: id,
      displayName: id,
      icon: '📦',
      color: '#ffffff',
    }));
  }, [categories, recentTransactions]);

  const categorySpentById = useMemo<Record<string, number>>(() => {
    return recentTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [recentTransactions]);

  const maxCategorySpent = useMemo(() => {
    const values = Object.values(categorySpentById);
    return values.length > 0 ? Math.max(...values) : 0;
  }, [categorySpentById]);

  const filteredTransactions = selectedCategory 
    ? recentTransactions.filter((t) => t.category === selectedCategory)
    : recentTransactions;
    
  // Calculate simple monthly totals for Phase 1
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  const totalSpent = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
  const transactionCount = recentTransactions.length;
  
  // Calculate days tracked based on unique dates in transactions
  const uniqueDates = new Set(recentTransactions.map((t) => t.date.split('T')[0]));
  const daysTracked = uniqueDates.size;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        Loading dashboard data...
      </div>
    );
  }


  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col lg:flex-row gap-6 pb-24 md:pb-6"
    >
      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {error && (
          <div className="text-xs text-white/70 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            {error}
          </div>
        )}
        {/* Phase 1: Simple Monthly Summary Card */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl backdrop-blur-xl border border-white/20 p-8 shadow-2xl bg-gradient-to-br from-blue-500/20 via-blue-400/20 to-cyan-500/20"
        >
          {/* Simple background without warnings */}
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-blue-300" />
                <p className="text-sm font-medium text-white/70">{currentMonth} {currentYear}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-5xl font-bold text-white mb-2">
                R{totalSpent.toLocaleString()}
              </p>
              <p className="text-lg text-white/60">
                Total Spent This Month
              </p>
            </div>

            {/* Phase 1 Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/60 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-white">{transactionCount}</p>
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/60 mb-1">Days Tracked</p>
                <p className="text-2xl font-bold text-white">{daysTracked} / {daysInMonth}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown - Simplified for Phase 1 */}
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-4">This Month's Spending</h3>
            
            {categoriesForDisplay.map((category) => {
              const categorySpent = categorySpentById[category.id] ?? 0;
              const barWidth = maxCategorySpent > 0 ? (categorySpent / maxCategorySpent) * 100 : 0;
              
              return (
                <div
                  key={category.id}
                  className="mb-3 cursor-pointer"
                  onClick={() =>
                    setSelectedCategory((prev) => (prev === category.id ? null : category.id))
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm font-medium text-white">{category.displayName || category.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">R{categorySpent.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-blue-500 rounded-full" 
                    />
                  </div>
                </div>
              );
            })}
            
            {/* Total at bottom */}
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between">
              <span className="font-medium text-white">TOTAL</span>
              <span className="font-bold text-white">R{totalSpent.toLocaleString()}</span>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Sidebar Widget Area (Right Side on Desktop) */}
      <div className="w-full lg:w-80 space-y-6">
        <motion.div variants={itemVariants}>
          <WhatsAppQuickActions />
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <TransactionsList 
            transactions={filteredTransactions} 
            categories={categoriesForDisplay}
            limit={selectedCategory ? undefined : 5}
            showViewAll={!selectedCategory}
            selectedCategory={selectedCategory}
            onClearFilter={() => setSelectedCategory(null)}
          />
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categoriesForDisplay}
        onTransactionAdded={(transaction: Transaction) => {
          setRecentTransactions((prev) =>
            [transaction, ...prev].slice().sort((a, b) => b.id - a.id)
          );
        }}
      />
    </motion.div>
  );
};

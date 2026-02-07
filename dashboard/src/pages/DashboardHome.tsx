import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCategories, getTransactions } from '../services/api';
import { TransactionsList } from '../components/TransactionsList';
import { GlassCard } from '../components/ui/GlassCard';
import { AddTransactionModal, FloatingActionButton } from '../components/AddTransactionModal';
import { WhatsAppQuickActions } from '../components/WhatsAppQuickActions';
import { CategoryVisualizer } from '../components/CategoryVisualizer';
import { MonthlyWins } from '../components/MonthlyWins';
import { InsightsList } from '../components/InsightsList';
import { PhaseGate } from '../components/PhaseGate';
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
  const uniqueDates = useMemo(
    () => new Set(recentTransactions.map((t) => t.date.split('T')[0])),
    [recentTransactions]
  );
  const daysTracked = uniqueDates.size;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

  // Calculate a simple tracking streak (consecutive days ending today or yesterday)
  const trackingStreak = useMemo(() => {
    if (uniqueDates.size === 0) return 0;
    const sorted = Array.from(uniqueDates).sort().reverse();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = new Date(today.getTime() - 86400000).toISOString().split('T')[0];
    if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) return 0;
    let streak = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1] + 'T00:00:00');
      const curr = new Date(sorted[i] + 'T00:00:00');
      const diffDays = (prev.getTime() - curr.getTime()) / 86400000;
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [uniqueDates]);
  
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
            <div className="grid grid-cols-3 gap-4">
              <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/60 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-white">{transactionCount}</p>
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-white/60 mb-1">Days Tracked</p>
                <p className="text-2xl font-bold text-white">{daysTracked} / {daysInMonth}</p>
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-1 mb-1">
                  <Flame size={12} className="text-orange-400" />
                  <p className="text-xs text-white/60">Streak</p>
                </div>
                <p className="text-2xl font-bold text-white">{trackingStreak}<span className="text-sm font-normal text-white/50"> days</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phase 2+: Pie Chart Visualizer */}
        <PhaseGate minPhase={2}>
          <motion.div variants={itemVariants}>
            <CategoryVisualizer
              categories={categoriesForDisplay.map((c) => ({
                ...c,
                totalSpent: categorySpentById[c.id] ?? 0,
              }))}
              selectedCategory={selectedCategory}
              onCategorySelect={(name) =>
                setSelectedCategory((prev) => (prev === name ? null : name))
              }
            />
          </motion.div>
        </PhaseGate>

        {/* Category Breakdown - All phases, simplified bars */}
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

        {/* Phase 2+: Monthly Wins */}
        <PhaseGate minPhase={2}>
          <motion.div variants={itemVariants}>
            <MonthlyWins
              categories={categoriesForDisplay.map((c) => ({
                ...c,
                totalSpent: categorySpentById[c.id] ?? 0,
              }))}
              trackingStreak={trackingStreak}
            />
          </motion.div>
        </PhaseGate>

        {/* Phase 3+: Insights & Suggestions */}
        <PhaseGate minPhase={3}>
          <motion.div variants={itemVariants}>
            <InsightsList
              categories={categoriesForDisplay.map((c) => ({
                ...c,
                totalSpent: categorySpentById[c.id] ?? 0,
              }))}
              onCategorySelect={(name) =>
                setSelectedCategory((prev) => (prev === name ? null : name))
              }
            />
          </motion.div>
        </PhaseGate>

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

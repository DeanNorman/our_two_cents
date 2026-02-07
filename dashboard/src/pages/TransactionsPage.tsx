import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Users,
  Calendar,
  TrendingUp,
  Filter,
  X,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react';
import { getCategories, getTransactions, deleteTransaction as apiDeleteTransaction } from '../services/api';
import { GlassCard } from '../components/ui/GlassCard';
import { PhaseGate } from '../components/PhaseGate';
import { AddTransactionModal, FloatingActionButton } from '../components/AddTransactionModal';
import { EditTransactionModal } from '../components/EditTransactionModal';
import { usePhase } from '../contexts/PhaseContext';
import { Category, Transaction } from '../types';
import { getDateLabel } from '../services/mockData';

type SortField = 'date' | 'amount' | 'category' | 'user';
type SortDirection = 'asc' | 'desc';
type UserFilter = 'all' | 'Dean' | 'Abigail';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export const TransactionsPage: React.FC = () => {
  const { phase } = usePhase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  // CRUD state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [swipedId, setSwipedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userFilter, setUserFilter] = useState<UserFilter>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Fetch data
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      const [catResult, txnResult] = await Promise.allSettled([
        getCategories(),
        getTransactions(),
      ]);

      if (cancelled) return;

      if (catResult.status === 'fulfilled') setCategories(catResult.value);
      if (txnResult.status === 'fulfilled') setAllTransactions(txnResult.value);

      if (catResult.status === 'rejected' || txnResult.status === 'rejected') {
        setError('Failed to load data. Is the backend running?');
      } else {
        setError(null);
      }
      setLoading(false);
    };

    loadData();

    const interval = setInterval(async () => {
      try {
        const txns = await getTransactions();
        if (!cancelled) setAllTransactions(txns);
      } catch {}
    }, 15000);

    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  // Helpers
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId || c.name === categoryId);
  };

  const getCategoryIcon = (categoryId: string) => getCategoryInfo(categoryId)?.icon || '📦';
  const getCategoryDisplayName = (categoryId: string) => getCategoryInfo(categoryId)?.displayName || categoryId;
  const getCategoryColor = (categoryId: string) => getCategoryInfo(categoryId)?.color || '#9013FE';

  // Month navigation
  const navigateMonth = (direction: -1 | 1) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const date = new Date(year, month - 1 + direction, 1);
    setSelectedMonth(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
  };

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return selectedMonth === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, [selectedMonth]);

  // Filter & sort transactions
  const filteredTransactions = useMemo(() => {
    let txns = allTransactions.filter(t => t.date?.startsWith(selectedMonth));

    if (userFilter !== 'all') {
      txns = txns.filter(t => t.user === userFilter);
    }

    if (selectedCategory) {
      txns = txns.filter(t => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      txns = txns.filter(t =>
        t.merchant?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q) ||
        getCategoryDisplayName(t.category).toLowerCase().includes(q) ||
        t.user?.toLowerCase().includes(q) ||
        t.note?.toLowerCase().includes(q) ||
        `r${t.amount}`.includes(q) ||
        String(t.amount).includes(q)
      );
    }

    txns.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date': cmp = new Date(a.date).getTime() - new Date(b.date).getTime(); break;
        case 'amount': cmp = a.amount - b.amount; break;
        case 'category': cmp = a.category.localeCompare(b.category); break;
        case 'user': cmp = a.user.localeCompare(b.user); break;
      }
      return sortDirection === 'desc' ? -cmp : cmp;
    });

    return txns;
  }, [allTransactions, selectedMonth, userFilter, selectedCategory, searchQuery, sortField, sortDirection, categories]);

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    for (const txn of filteredTransactions) {
      const label = getDateLabel(txn.date);
      if (!groups[label]) groups[label] = [];
      groups[label].push(txn);
    }
    return groups;
  }, [filteredTransactions]);

  // Stats
  const stats = useMemo(() => {
    const txns = allTransactions.filter(t => t.date?.startsWith(selectedMonth));
    const total = txns.reduce((sum, t) => sum + t.amount, 0);
    const deanTotal = txns.filter(t => t.user === 'Dean').reduce((sum, t) => sum + t.amount, 0);
    const abigailTotal = txns.filter(t => t.user === 'Abigail').reduce((sum, t) => sum + t.amount, 0);
    const uniqueDays = new Set(txns.map(t => t.date)).size;
    const daysInMonth = new Date(
      parseInt(selectedMonth.split('-')[0]),
      parseInt(selectedMonth.split('-')[1]),
      0
    ).getDate();

    // Category breakdown for filter chips
    const categoryTotals: Record<string, number> = {};
    txns.forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    // Weekly breakdown
    const weeklyTotals = [0, 0, 0, 0, 0];
    txns.forEach(t => {
      const day = new Date(t.date).getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
      weeklyTotals[weekIndex] += t.amount;
    });

    return { total, deanTotal, abigailTotal, count: txns.length, uniqueDays, daysInMonth, categoryTotals, weeklyTotals };
  }, [allTransactions, selectedMonth]);

  const activeFiltersCount = [
    userFilter !== 'all',
    selectedCategory !== null,
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setUserFilter('all');
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getUserColor = (user: string) =>
    user === 'Dean' ? 'from-blue-500 to-purple-500' : 'from-pink-500 to-rose-500';

  // Budget color for Phase 3+
  const getAmountColor = (transaction: Transaction): string => {
    if (phase < 3) return 'text-white';
    const cat = getCategoryInfo(transaction.category);
    if (!cat?.budgetAmount || !cat?.percentUsed) return 'text-white';
    if (cat.percentUsed >= 100) return 'text-red-400';
    if (cat.percentUsed >= 80) return 'text-amber-400';
    return 'text-white';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <p className="text-white/50 text-sm">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard>
        <div className="text-center py-12">
          <p className="text-red-400 text-lg">Something went wrong</p>
          <p className="text-white/50 text-sm mt-2">{error}</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-4 pb-24 md:pb-6"
    >
      {/* Month Navigator + Summary */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold text-white">{monthLabel}</h2>
              <p className="text-xs text-white/50">
                {stats.count} transactions · {stats.uniqueDays}/{stats.daysInMonth} days tracked
              </p>
            </div>

            <button
              onClick={() => navigateMonth(1)}
              disabled={isCurrentMonth}
              className={`p-2 rounded-xl border border-white/10 transition-all ${
                isCurrentMonth
                  ? 'opacity-30 cursor-not-allowed bg-white/5'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              aria-label="Next month"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
              <p className="text-2xl font-bold text-white">R{stats.total.toLocaleString()}</p>
              <p className="text-xs text-white/40">Total Spent</p>
            </div>

            <PhaseGate minPhase={2} fallback={
              <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-white">{stats.count}</p>
                <p className="text-xs text-white/40">Transactions</p>
              </div>
            }>
              <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">D</div>
                  <span className="text-lg font-bold text-white">R{stats.deanTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-white/40">Dean</p>
              </div>
            </PhaseGate>

            <PhaseGate minPhase={2} fallback={null}>
              <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-[10px] text-white font-bold">A</div>
                  <span className="text-lg font-bold text-white">R{stats.abigailTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-white/40">Abigail</p>
              </div>
            </PhaseGate>
          </div>

          {/* Phase 2+: Weekly Breakdown Mini Chart */}
          <PhaseGate minPhase={2} fallback={null}>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-white/40 mb-2 flex items-center gap-1">
                <Calendar size={12} /> Weekly Breakdown
              </p>
              <div className="flex items-end gap-1 h-12">
                {stats.weeklyTotals.map((weekTotal, i) => {
                  const maxWeek = Math.max(...stats.weeklyTotals, 1);
                  const height = Math.max((weekTotal / maxWeek) * 100, 4);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-500/60 to-purple-500/60 transition-all duration-500"
                        style={{ height: `${height}%` }}
                        title={`Week ${i + 1}: R${weekTotal.toLocaleString()}`}
                      />
                      <span className="text-[9px] text-white/30">W{i + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </PhaseGate>
        </GlassCard>
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={itemVariants}>
        <GlassCard className="!p-4">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Phase 2+: User Filter Pills */}
          <PhaseGate minPhase={2} fallback={null}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-white/30 flex-shrink-0" />
              {(['all', 'Dean', 'Abigail'] as UserFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setUserFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    userFilter === filter
                      ? filter === 'Dean'
                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white border border-blue-400/30'
                        : filter === 'Abigail'
                        ? 'bg-gradient-to-r from-pink-500/30 to-rose-500/30 text-white border border-pink-400/30'
                        : 'bg-white/15 text-white border border-white/20'
                      : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  {filter === 'all' ? 'Both' : filter}
                </button>
              ))}
            </div>
          </PhaseGate>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                !selectedCategory
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const catTotal = stats.categoryTotals[cat.id] || stats.categoryTotals[cat.name] || 0;
              if (catTotal === 0 && selectedCategory !== cat.id) return null;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    isActive
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{cat.displayName}</span>
                  <PhaseGate minPhase={3} fallback={
                    <span className="text-white/30 ml-0.5">R{catTotal.toLocaleString()}</span>
                  }>
                    <span className="text-white/30 ml-0.5">
                      R{catTotal.toLocaleString()}
                      {cat.budgetAmount ? ` / R${cat.budgetAmount.toLocaleString()}` : ''}
                    </span>
                  </PhaseGate>
                </button>
              );
            })}
          </div>

          {/* Active filters indicator */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-white/40">
                <Filter size={10} className="inline mr-1" />
                {filteredTransactions.length} of {stats.count} transactions
              </p>
              <button
                onClick={clearAllFilters}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Sort Controls */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 px-1">
        <ArrowUpDown size={12} className="text-white/30" />
        {[
          { field: 'date' as SortField, label: 'Date' },
          { field: 'amount' as SortField, label: 'Amount' },
          { field: 'category' as SortField, label: 'Category' },
        ].map(({ field, label }) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`text-xs px-2 py-1 rounded-md transition-all ${
              sortField === field
                ? 'text-white bg-white/10'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {label}
            {sortField === field && (
              <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
        ))}
        <PhaseGate minPhase={2} fallback={null}>
          <button
            onClick={() => toggleSort('user')}
            className={`text-xs px-2 py-1 rounded-md transition-all ${
              sortField === 'user'
                ? 'text-white bg-white/10'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            User
            {sortField === 'user' && (
              <span className="ml-1">{sortDirection === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
        </PhaseGate>
      </motion.div>

      {/* Transactions List */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <AnimatePresence mode="wait">
            {filteredTransactions.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <p className="text-4xl mb-3">
                  {searchQuery || selectedCategory || userFilter !== 'all' ? '🔍' : '📭'}
                </p>
                <p className="text-white/50">
                  {searchQuery || selectedCategory || userFilter !== 'all'
                    ? 'No transactions match your filters'
                    : 'No transactions this month yet'
                  }
                </p>
                <p className="text-sm text-white/30 mt-1">
                  {searchQuery || selectedCategory || userFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Tap + to log your first spend'
                  }
                </p>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {Object.entries(groupedTransactions).map(([dateLabel, txns]) => (
                  <div key={dateLabel}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                        {dateLabel}
                      </p>
                      <p className="text-xs text-white/30">
                        {txns.length} {txns.length === 1 ? 'transaction' : 'transactions'} · R{txns.reduce((s, t) => s + t.amount, 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {txns.map((transaction, index) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group relative"
                          onClick={() => setSwipedId(swipedId === transaction.id ? null : transaction.id)}
                        >
                          {/* Category Icon */}
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${getCategoryColor(transaction.category)}20` }}
                          >
                            {getCategoryIcon(transaction.category)}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white truncate">
                                {transaction.merchant || getCategoryDisplayName(transaction.category)}
                              </p>
                              <div
                                className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${getUserColor(transaction.user)} flex items-center justify-center text-[10px] text-white font-semibold`}
                              >
                                {transaction.user[0]}
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-white/40">
                                {getCategoryDisplayName(transaction.category)}
                              </span>
                              {transaction.note && (
                                <>
                                  <span className="text-white/20">·</span>
                                  <span className="text-xs text-white/30 truncate">{transaction.note}</span>
                                </>
                              )}
                              {transaction.source === 'bot' && (
                                <span className="text-[10px] text-green-400/50 bg-green-400/10 px-1.5 py-0.5 rounded-md">
                                  WhatsApp
                                </span>
                              )}
                              {transaction.source === 'manual' && (
                                <span className="text-[10px] text-blue-400/50 bg-blue-400/10 px-1.5 py-0.5 rounded-md">
                                  Manual
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Amount + Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Action buttons — visible on hover (desktop) or tap (mobile) */}
                            <div className={`flex items-center gap-1 transition-all duration-200 ${
                              swipedId === transaction.id
                                ? 'opacity-100 w-auto'
                                : 'opacity-0 w-0 overflow-hidden md:group-hover:opacity-100 md:group-hover:w-auto'
                            }`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingTransaction(transaction);
                                  setSwipedId(null);
                                }}
                                className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition-all"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingId(transaction.id);
                                  setSwipedId(null);
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className={`text-base font-bold ${getAmountColor(transaction)}`}>
                                R{transaction.amount.toLocaleString()}
                              </p>
                              {/* Phase 3+: Show category budget context */}
                              <PhaseGate minPhase={3} fallback={null}>
                                {(() => {
                                  const cat = getCategoryInfo(transaction.category);
                                  if (!cat?.budgetAmount) return null;
                                  const pct = cat.percentUsed || 0;
                                  return (
                                    <p className={`text-[10px] ${
                                      pct >= 100 ? 'text-red-400/60' :
                                      pct >= 80 ? 'text-amber-400/60' :
                                      'text-white/30'
                                    }`}>
                                      {pct}% of budget
                                    </p>
                                  );
                                })()}
                              </PhaseGate>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Phase 2+: Category Summary at bottom */}
      <PhaseGate minPhase={2} fallback={null}>
        <motion.div variants={itemVariants}>
          <GlassCard>
            <h3 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-1.5">
              <TrendingUp size={14} />
              Category Summary — {monthLabel}
            </h3>
            <div className="space-y-2">
              {categories
                .filter(c => (stats.categoryTotals[c.id] || stats.categoryTotals[c.name] || 0) > 0)
                .sort((a, b) => {
                  const aTotal = stats.categoryTotals[a.id] || stats.categoryTotals[a.name] || 0;
                  const bTotal = stats.categoryTotals[b.id] || stats.categoryTotals[b.name] || 0;
                  return bTotal - aTotal;
                })
                .map((cat) => {
                  const catTotal = stats.categoryTotals[cat.id] || stats.categoryTotals[cat.name] || 0;
                  const maxCatTotal = Math.max(...Object.values(stats.categoryTotals), 1);
                  const barWidth = (catTotal / maxCatTotal) * 100;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`w-full text-left rounded-xl p-2.5 transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-white/10 border border-white/15'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{cat.icon}</span>
                          <span className="text-xs font-medium text-white/80">{cat.displayName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-white">
                            R{catTotal.toLocaleString()}
                          </span>
                          {/* Phase 3+: budget info */}
                          <PhaseGate minPhase={3} fallback={null}>
                            {cat.budgetAmount ? (
                              <span className={`text-[10px] ml-1.5 ${
                                catTotal > cat.budgetAmount ? 'text-red-400' :
                                catTotal > cat.budgetAmount * 0.8 ? 'text-amber-400' :
                                'text-white/30'
                              }`}>
                                / R{cat.budgetAmount.toLocaleString()}
                              </span>
                            ) : null}
                          </PhaseGate>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      </div>
                    </button>
                  );
                })}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/50">TOTAL</span>
              <span className="text-sm font-bold text-white">R{stats.total.toLocaleString()}</span>
            </div>
          </GlassCard>
        </motion.div>
      </PhaseGate>
      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deletingId !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm backdrop-blur-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 rounded-2xl shadow-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Delete Transaction?</h3>
                <p className="text-sm text-white/50 mb-6">This can't be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-sm font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await apiDeleteTransaction(deletingId);
                        setAllTransactions(prev => prev.filter(t => t.id !== deletingId));
                        setDeletingId(null);
                      } catch (err: any) {
                        setError(err?.message || 'Failed to delete');
                        setDeletingId(null);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 text-sm font-medium transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        categories={categories}
        onClose={() => setEditingTransaction(null)}
        onUpdated={(updated) => {
          setAllTransactions(prev =>
            prev.map(t => t.id === updated.id ? updated : t)
          );
        }}
        onDeleted={(id) => {
          setAllTransactions(prev => prev.filter(t => t.id !== id));
        }}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onTransactionAdded={(transaction) => {
          setAllTransactions(prev => [transaction, ...prev]);
        }}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />
    </motion.div>
  );
};

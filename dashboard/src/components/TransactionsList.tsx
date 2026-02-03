import React from 'react';
import { motion } from 'framer-motion';
import { Category, Transaction } from '../types';
import { groupTransactionsByDate } from '../services/mockData';
import { GlassCard } from './ui/GlassCard';

interface TransactionsListProps {
  transactions: Transaction[];
  categories: Category[];
  limit?: number;
  showViewAll?: boolean;
  selectedCategory?: string | null;
  onClearFilter?: () => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  categories,
  limit,
  showViewAll = false,
  selectedCategory,
  onClearFilter
}) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;
  const groupedTransactions = groupTransactionsByDate(displayTransactions);

  const getCategoryIcon = (categoryName: string): string => {
    const category = categories.find(cat => cat.id === categoryName || cat.name === categoryName);
    return category?.icon || '📦';
  };

  const getCategoryDisplayName = (categoryName: string): string => {
    const category = categories.find(cat => cat.id === categoryName || cat.name === categoryName);
    return category?.displayName || categoryName;
  };

  const emptyTitle = selectedCategory
    ? `No spends in ${getCategoryDisplayName(selectedCategory)} yet`
    : 'No spends logged yet';

  const emptySubtitle = selectedCategory
    ? "Log one in WhatsApp and we'll see it here."
    : "Log our first spend in WhatsApp — it will show up here.";

  const getUserColor = (user: string): string => {
    return user === 'Dean' ? 'from-blue-500 to-purple-500' : 'from-pink-500 to-rose-500';
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white">
            {selectedCategory ? (
              <span className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">{getCategoryIcon(selectedCategory)}</span>
                <span>{getCategoryDisplayName(selectedCategory)}</span>
              </span>
            ) : (
              'Recent Spends'
            )}
          </h3>
          {selectedCategory && (
            <button 
              onClick={onClearFilter}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors bg-white/5 px-2 py-1 rounded-lg"
            >
              Clear filter
            </button>
          )}
        </div>
        {showViewAll && (
          <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View All →
          </button>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTransactions).map(([dateLabel, txns], groupIndex) => (
          <div key={dateLabel}>
            <p className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
              {dateLabel}
            </p>
            
            <div className="space-y-2">
              {txns.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                >
                  {/* Category Icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {getCategoryIcon(transaction.category)}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-white truncate">
                        {transaction.merchant}
                      </p>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${getUserColor(transaction.user)} flex items-center justify-center text-xs text-white font-semibold`}>
                        {transaction.user[0]}
                      </div>
                    </div>
                    <p className="text-xs text-white/50 capitalize">
                      {getCategoryDisplayName(transaction.category)}
                      {transaction.note && ` • ${transaction.note}`}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-lg font-bold text-red-400">
                      -R{transaction.amount.toFixed(0)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {displayTransactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50">{emptyTitle}</p>
          <p className="text-sm text-white/30 mt-2">{emptySubtitle}</p>
        </div>
      )}
    </GlassCard>
  );
};

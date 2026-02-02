import React from 'react';
import { Calendar, User, Tag, DollarSign } from 'lucide-react';

const TransactionList = ({ transactions }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      groceries: '🛒',
      transport: '🚗',
      dining: '🍽️',
      entertainment: '🎬',
      utilities: '💡',
      housing: '🏠',
      shopping: '🛍️',
      health: '🏥',
      savings: '💰',
      other: '📦',
    };
    return icons[category] || '📦';
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No transactions yet. Start logging via WhatsApp!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <span className="text-3xl">{getCategoryIcon(transaction.category)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {transaction.category}
                    </h3>
                    {transaction.merchant && (
                      <span className="text-sm text-gray-500">• {transaction.merchant}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User size={14} />
                      {transaction.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    {transaction.note && (
                      <span className="text-gray-500 italic">{transaction.note}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  R{transaction.amount.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 capitalize">{transaction.source}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;

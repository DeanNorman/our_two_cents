import React from 'react';

const CategoryCard = ({ category }) => {
  const { icon, displayName, totalSpent, budgetAmount, remaining, percentUsed, color } = category;

  const getWarningColor = (percent) => {
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-orange-500';
    if (percent >= 80) return 'bg-yellow-500';
    if (percent >= 60) return 'bg-blue-400';
    return 'bg-green-500';
  };

  const getTextColor = (percent) => {
    if (percent >= 100) return 'text-red-600';
    if (percent >= 90) return 'text-orange-600';
    if (percent >= 80) return 'text-yellow-600';
    return 'text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
            <p className="text-sm text-gray-500">
              R{totalSpent.toFixed(0)} / R{budgetAmount.toFixed(0)}
            </p>
          </div>
        </div>
        <div className={`text-2xl font-bold ${getTextColor(percentUsed)}`}>
          {percentUsed}%
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className={`h-3 rounded-full transition-all ${getWarningColor(percentUsed)}`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          {remaining >= 0 ? `R${remaining.toFixed(0)} left` : `R${Math.abs(remaining).toFixed(0)} over`}
        </span>
        {percentUsed >= 90 && (
          <span className="text-red-600 font-semibold">
            {percentUsed >= 100 ? '🛑 Over budget!' : '⚠️ Almost there!'}
          </span>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;

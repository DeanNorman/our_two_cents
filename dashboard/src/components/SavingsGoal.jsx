import React from 'react';
import { Home, TrendingUp, Calendar } from 'lucide-react';

const SavingsGoal = ({ goal }) => {
  if (!goal) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Savings Goal</h2>
        <p className="text-gray-500">No savings goal set yet.</p>
      </div>
    );
  }

  const { goalName, targetAmount, currentSavings, percentComplete, remaining, monthsToGo } = goal;

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Home className="text-green-600" size={32} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{goalName}</h2>
          <p className="text-sm text-gray-600">Your journey to homeownership</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Target</p>
          <p className="text-2xl font-bold text-gray-900">
            R{targetAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Current</p>
          <p className="text-2xl font-bold text-green-600">
            R{currentSavings.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">{percentComplete}% Complete</span>
          <span className="text-gray-600">R{remaining.toLocaleString()} to go</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all"
            style={{ width: `${Math.min(percentComplete, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={18} />
          <span className="text-sm">
            {monthsToGo !== null ? `~${monthsToGo} months to go` : 'Set monthly contribution'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp size={18} />
          <span className="text-sm font-semibold">On track!</span>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoal;

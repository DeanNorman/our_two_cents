import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trophy } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { Category } from '../types';

interface Win {
  icon: string;
  text: string;
  type: 'budget' | 'habit' | 'improvement' | 'savings';
}

interface MonthlyWinsProps {
  categories: Category[];
  trackingStreak?: number;
  savingsThisMonth?: number;
}

const generateWins = (
  categories: Category[],
  trackingStreak: number,
  savingsThisMonth: number
): Win[] => {
  const wins: Win[] = [];

  // Win: Under budget in any category
  categories.forEach(cat => {
    const remaining = cat.remaining ?? 0;
    const percentUsed = cat.percentUsed ?? 0;
    const totalSpent = cat.totalSpent ?? 0;
    if (remaining > 0 && percentUsed < 90 && totalSpent > 0) {
      wins.push({
        icon: '✓',
        text: `${cat.displayName}: R${remaining.toLocaleString()} under budget`,
        type: 'budget'
      });
    }
  });

  // Win: Tracking consistency
  if (trackingStreak >= 7) {
    wins.push({
      icon: '✓',
      text: `${trackingStreak}-day tracking streak`,
      type: 'habit'
    });
  }

  // Win: Savings contribution
  if (savingsThisMonth > 0) {
    wins.push({
      icon: '✓',
      text: `Added R${savingsThisMonth.toLocaleString()} to our house fund`,
      type: 'savings'
    });
  }

  return wins.slice(0, 4); // Show top 4 wins
};

export const MonthlyWins: React.FC<MonthlyWinsProps> = ({
  categories,
  trackingStreak = 18,
  savingsThisMonth = 8000
}) => {
  const wins = generateWins(categories, trackingStreak, savingsThisMonth);

  if (wins.length === 0) {
    return (
      <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-green-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">This Month's Wins</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-white/60 text-sm">🌱 Our wins will appear here as the month progresses.</p>
          <p className="text-white/40 text-xs mt-2">Keep tracking—this is how we stay aligned.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-green-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={20} className="text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">This Month's Wins 🎉</h3>
      </div>
      
      <div className="space-y-3">
        {wins.map((win, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-green-500/10"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={14} className="text-green-400" />
            </div>
            <p className="text-sm text-white/80">{win.text}</p>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

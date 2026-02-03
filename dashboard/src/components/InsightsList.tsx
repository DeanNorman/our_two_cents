import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp, Target } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { Category } from '../types';

interface Insight {
  type: 'positive' | 'nudge' | 'celebration';
  icon: React.ReactNode;
  message: string;
  action?: string;
  actionCategory?: string;
}

interface InsightsListProps {
  categories: Category[];
  savingsPercentComplete?: number;
  monthlyContribution?: number;
  onCategorySelect?: (categoryName: string) => void;
}

const generateInsights = (
  categories: Category[],
  savingsPercentComplete: number,
  monthlyContribution: number
): Insight[] => {
  const insights: Insight[] = [];

  // Find categories that are doing well
  const underBudgetCategories = categories.filter((cat) => {
    const remaining = cat.remaining ?? 0;
    const percentUsed = cat.percentUsed ?? 0;
    const totalSpent = cat.totalSpent ?? 0;
    return remaining > 0 && percentUsed < 70 && totalSpent > 0;
  });
  
  if (underBudgetCategories.length > 0) {
    const bestCategory = underBudgetCategories.reduce((prev, curr) =>
      ((curr.remaining ?? 0) > (prev.remaining ?? 0)) ? curr : prev
    );
    insights.push({
      type: 'positive',
      icon: <Lightbulb size={18} className="text-yellow-400" />,
      message: `We're spending wisely on ${bestCategory.displayName}. R${(bestCategory.remaining ?? 0).toLocaleString()} left gives us extra room for savings.`
    });
  }

  // Find categories that need attention (gentle nudge)
  const nearLimitCategories = categories.filter((cat) => {
    const percentUsed = cat.percentUsed ?? 0;
    return percentUsed >= 80 && percentUsed < 100;
  });
  
  if (nearLimitCategories.length > 0) {
    const category = nearLimitCategories[0];
    insights.push({
      type: 'nudge',
      icon: <TrendingUp size={18} className="text-blue-400" />,
      message: `We're at ${(category.percentUsed ?? 0)}% of our ${category.displayName} budget. Let's slow down a bit to stay on track.`,
      action: `View ${category.displayName}`,
      actionCategory: category.name
    });
  }

  // Savings milestone celebration
  if (savingsPercentComplete > 0 && savingsPercentComplete % 5 === 0) {
    insights.push({
      type: 'celebration',
      icon: <Target size={18} className="text-green-400" />,
      message: `Amazing! We're ${savingsPercentComplete}% of the way to our house deposit. Keep going! 🎉`
    });
  }

  // Monthly contribution insight
  if (monthlyContribution > 0) {
    insights.push({
      type: 'positive',
      icon: <Lightbulb size={18} className="text-yellow-400" />,
      message: `We're contributing R${monthlyContribution.toLocaleString()}/month to our goal. That's R${(monthlyContribution * 12).toLocaleString()} per year.`
    });
  }

  return insights.slice(0, 2); // Show max 2 insights
};

export const InsightsList: React.FC<InsightsListProps> = ({
  categories,
  savingsPercentComplete = 9,
  monthlyContribution = 8000,
  onCategorySelect
}) => {
  const insights = generateInsights(categories, savingsPercentComplete, monthlyContribution);

  if (insights.length === 0) {
    return null;
  }

  return (
    <GlassCard className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={20} className="text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Insights for Us</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className={`p-4 rounded-xl border ${
              insight.type === 'positive' ? 'bg-green-500/5 border-green-500/10' :
              insight.type === 'nudge' ? 'bg-blue-500/5 border-blue-500/10' :
              'bg-yellow-500/5 border-yellow-500/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {insight.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/80 leading-relaxed">{insight.message}</p>
                {insight.action && insight.actionCategory && onCategorySelect && (
                  <button
                    type="button"
                    onClick={() => onCategorySelect(insight.actionCategory!)}
                    className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {insight.action} →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};

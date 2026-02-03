import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Category } from '../types';
import { GlassCard } from './ui/GlassCard';
import { motion } from 'framer-motion';

interface CategoryVisualizerProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryName: string) => void;
}

export const CategoryVisualizer: React.FC<CategoryVisualizerProps> = ({ 
  categories, 
  selectedCategory,
  onCategorySelect 
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = categories
    .filter(cat => (cat.totalSpent ?? 0) > 0)
    .map(cat => ({
      id: cat.name,
      name: cat.displayName,
      value: cat.totalSpent ?? 0,
      color: cat.color,
      icon: cat.icon,
      budget: cat.budgetAmount ?? 0,
      remaining: cat.remaining ?? 0,
      percentUsed: cat.percentUsed ?? 0,
    }));

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const onPieClick = (_: any, index: number) => {
    onCategorySelect(chartData[index].id);
  };

  const CustomTooltip = ({ active, payload }: any): React.JSX.Element | null => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-xl p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{data.icon}</span>
            <p className="text-sm font-semibold text-white">{data.name}</p>
          </div>
          <div className="space-y-1 text-xs">
            <p className="text-white/70">
              Spent: <span className="text-white font-semibold">R{data.value.toFixed(0)}</span>
            </p>
            <p className="text-white/70">
              Budget: <span className="text-white font-semibold">R{data.budget.toFixed(0)}</span>
            </p>
            <p className="text-white/70">
              Remaining: <span className={`font-semibold ${data.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                R{Math.abs(data.remaining).toFixed(0)}
              </span>
            </p>
            <div className="pt-2 border-t border-white/20">
              <p className="text-white/70">
                {data.percentUsed}% used
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-3 mt-6">
        {chartData.map((entry: any, index: number) => (
          <motion.div
            key={`legend-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
              selectedCategory === entry.id 
                ? 'bg-white/20 ring-2 ring-white/30' 
                : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'
            }`}
            onClick={() => onCategorySelect(entry.id)}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{entry.name}</p>
              <p className="text-xs text-white/50">R{entry.value.toFixed(0)}</p>
            </div>
            <span className="text-lg">{entry.icon}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <GlassCard className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Our Spending Breakdown</h3>
          <p className="text-xs text-white/40 mt-1">Tap a category to filter recent spends</p>
        </div>
        {selectedCategory && (
          <button 
            type="button"
            onClick={() => onCategorySelect(selectedCategory)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {chartData.length > 0 ? (
        <div className="flex flex-col">
          <div className="relative w-full" style={{ height: '256px', minHeight: '256px' }}>
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  onClick={onPieClick}
                  style={{ cursor: 'pointer' }}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      opacity={
                        selectedCategory 
                          ? (selectedCategory === entry.id ? 1 : 0.3)
                          : (activeIndex === null || activeIndex === index ? 1 : 0.3)
                      }
                      stroke={selectedCategory === entry.id ? 'white' : 'none'}
                      strokeWidth={2}
                      style={{ 
                        filter: activeIndex === index ? 'brightness(1.2)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={(props) => <CustomTooltip {...props} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <CustomLegend />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/50">No spends logged yet</p>
          <p className="text-sm text-white/30 mt-2">Log our first spend in WhatsApp and we'll see the breakdown here</p>
        </div>
      )}
    </GlassCard>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  gradient?: string;
  healthStatus?: 'good' | 'warning' | 'danger';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  gradient = 'from-blue-500 to-purple-500',
  healthStatus = 'good',
}) => {
  const getHealthColor = () => {
    switch (healthStatus) {
      case 'good':
        return 'from-green-500 to-emerald-500';
      case 'warning':
        return 'from-yellow-500 to-orange-500';
      case 'danger':
        return 'from-red-500 to-pink-500';
      default:
        return gradient;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/10 p-6 hover:bg-white/15 transition-all duration-300 group"
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getHealthColor()} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${getHealthColor()} shadow-lg`}>
            <Icon size={24} className="text-white" />
          </div>
          
          {trend && trendValue && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              trend === 'up' ? 'bg-green-500/20 text-green-300' :
              trend === 'down' ? 'bg-red-500/20 text-red-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-white/50">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
    </motion.div>
  );
};

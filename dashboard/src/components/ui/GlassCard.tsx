import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  gradient = false,
  onClick 
}) => {
  const baseClasses = gradient
    ? 'backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10'
    : 'backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/5';

  const hoverClasses = hover 
    ? 'hover:bg-white/15 dark:hover:bg-black/15 hover:border-white/20 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer' 
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl p-6 ${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const GlassCardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const GlassCardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h3 className={`text-lg font-semibold text-white/90 ${className}`}>
      {children}
    </h3>
  );
};

export const GlassCardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

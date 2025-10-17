import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  tooltip?: string;
  badge?: number;
  pulse?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  className = '',
  size = 'md',
  variant = 'primary',
  tooltip,
  badge,
  pulse = false
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-br from-purple-600 to-indigo-700 shadow-purple-500/50',
    secondary: 'bg-gradient-to-br from-gray-600 to-gray-800 shadow-gray-500/50',
    success: 'bg-gradient-to-br from-emerald-600 to-green-700 shadow-emerald-500/50',
    danger: 'bg-gradient-to-br from-red-600 to-pink-700 shadow-red-500/50'
  };

  return (
    <div className="relative group">
      <motion.button
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          rounded-full text-white shadow-2xl
          backdrop-blur-sm border border-white/20
          flex items-center justify-center
          transition-all duration-300
          hover:shadow-3xl hover:border-white/30
          focus:outline-none focus:ring-4 focus:ring-white/20
          ${pulse ? 'animate-pulse' : ''}
          ${className}
        `}
        onClick={onClick}
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          y: -2
        }}
        whileTap={{ 
          scale: 0.95,
          rotate: -5
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17 
        }}
      >
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-110 transition-transform duration-500 ease-out" />
        
        {/* Icon */}
        <div className={`relative z-10 ${iconSizes[size]}`}>
          {icon}
        </div>

        {/* Badge */}
        <AnimatePresence>
          {badge && badge > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
            >
              {badge > 99 ? '99+' : badge}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg backdrop-blur-sm border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          >
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionButton;

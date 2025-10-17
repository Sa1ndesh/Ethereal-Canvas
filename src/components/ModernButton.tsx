import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  gradient?: boolean;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  glow = false,
  gradient = true
}) => {
  const baseClasses = "relative overflow-hidden font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantClasses = {
    primary: gradient 
      ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-500 hover:via-purple-600 hover:to-indigo-600 text-white focus:ring-purple-500'
      : 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500',
    secondary: gradient
      ? 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 text-white focus:ring-gray-500'
      : 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: gradient
      ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:via-green-500 hover:to-teal-500 text-white focus:ring-emerald-500'
      : 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    warning: gradient
      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 text-white focus:ring-amber-500'
      : 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-500',
    danger: gradient
      ? 'bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 hover:from-red-500 hover:via-pink-500 hover:to-rose-500 text-white focus:ring-red-500'
      : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 focus:ring-white/50 backdrop-blur-sm'
  };

  const glowClasses = {
    primary: 'shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70',
    secondary: 'shadow-lg shadow-gray-500/50 hover:shadow-gray-500/70',
    success: 'shadow-lg shadow-emerald-500/50 hover:shadow-emerald-500/70',
    warning: 'shadow-lg shadow-amber-500/50 hover:shadow-amber-500/70',
    danger: 'shadow-lg shadow-red-500/50 hover:shadow-red-500/70',
    ghost: 'shadow-lg shadow-white/20 hover:shadow-white/30'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${glow ? glowClasses[variant] : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.05,
        y: disabled || loading ? 0 : -2
      }}
      whileTap={{ 
        scale: disabled || loading ? 1 : 0.95,
        y: disabled || loading ? 0 : 0
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17 
      }}
    >
      {/* Ripple effect background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700 ease-out" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading ? (
          <Loader className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className={iconSizes[size]}>{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className={iconSizes[size]}>{icon}</span>
            )}
          </>
        )}
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};

export default ModernButton;

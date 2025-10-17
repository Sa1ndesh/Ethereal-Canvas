import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: 'purple' | 'blue' | 'pink' | 'cyan' | 'emerald';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  blur = 'md',
  gradient = 'purple'
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  const gradientClasses = {
    purple: 'from-purple-500/10 via-purple-400/5 to-transparent',
    blue: 'from-blue-500/10 via-blue-400/5 to-transparent',
    pink: 'from-pink-500/10 via-pink-400/5 to-transparent',
    cyan: 'from-cyan-500/10 via-cyan-400/5 to-transparent',
    emerald: 'from-emerald-500/10 via-emerald-400/5 to-transparent'
  };

  const glowClasses = {
    purple: 'shadow-purple-500/20',
    blue: 'shadow-blue-500/20',
    pink: 'shadow-pink-500/20',
    cyan: 'shadow-cyan-500/20',
    emerald: 'shadow-emerald-500/20'
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl
        ${blurClasses[blur]}
        bg-gradient-to-br ${gradientClasses[gradient]}
        border border-white/20
        ${glow ? `shadow-2xl ${glowClasses[gradient]}` : 'shadow-xl shadow-black/10'}
        ${className}
      `}
      whileHover={hover ? { 
        scale: 1.02,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        boxShadow: glow 
          ? `0 25px 50px -12px ${gradient === 'purple' ? 'rgba(168, 85, 247, 0.4)' : 
              gradient === 'blue' ? 'rgba(59, 130, 246, 0.4)' :
              gradient === 'pink' ? 'rgba(236, 72, 153, 0.4)' :
              gradient === 'cyan' ? 'rgba(6, 182, 212, 0.4)' :
              'rgba(16, 185, 129, 0.4)'}`
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      } : {}}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
      </div>

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </motion.div>
  );
};

export default GlassCard;

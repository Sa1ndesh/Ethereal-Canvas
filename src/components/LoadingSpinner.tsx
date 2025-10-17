import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'rainbow' | 'pulse' | 'dots' | 'orbit';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-6 h-6'} bg-gradient-to-r from-purple-500 to-pink-500 rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className={`text-white/80 font-medium ${textSizes[size]}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'orbit') {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <div className={`relative ${sizeClasses[size]}`}>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-pink-500/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-blue-500/70"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
        </div>
        {text && (
          <p className={`text-white/80 font-medium ${textSizes[size]}`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {text && (
          <motion.p
            className={`text-white/80 font-medium ${textSizes[size]}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === 'rainbow') {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full`}
          style={{
            background: 'conic-gradient(from 0deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
            padding: '2px'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
            <div className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-6 h-6'} bg-white rounded-full`} />
          </div>
        </motion.div>
        {text && (
          <p className={`text-white/80 font-medium ${textSizes[size]}`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  // Default spinner variants
  const spinnerColors = {
    primary: 'border-purple-500',
    secondary: 'border-gray-500'
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-4 border-white/20 ${spinnerColors[variant as 'primary' | 'secondary']} border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <motion.p
          className={`text-white/80 font-medium ${textSizes[size]}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;

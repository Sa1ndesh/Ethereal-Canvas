import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Palette, Images, Wallet, BookOpen, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';
import WalletConnectButton from './WalletConnectButton';
import AnimatedBackground from './AnimatedBackground';
import GlassCard from './GlassCard';

interface LayoutProps {
  children: React.ReactNode;
  onTutorialModeToggle?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onTutorialModeToggle }) => {
  const location = useLocation();
  const { wallet } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/60 to-indigo-900/80 z-10" />
      
      {/* Navigation */}
      <nav className="relative z-20 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 text-white font-bold text-xl group">
                <motion.div
                  className="relative"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Palette className="w-8 h-8 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <motion.span
                  className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Ethereal Canvas
                </motion.span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/') 
                      ? 'bg-purple-600/50 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Generate</span>
                </Link>
                
                <Link
                  to="/gallery"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/gallery') 
                      ? 'bg-purple-600/50 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Images className="w-4 h-4" />
                  <span>Gallery</span>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {wallet.connected && (
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-300">
                  <Wallet className="w-4 h-4" />
                  <span>{wallet.balance} ETH</span>
                </div>
              )}
              {onTutorialModeToggle && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onTutorialModeToggle}
                  className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  title="Switch to Tutorial Mode"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Tutorial</span>
                </motion.button>
              )}
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GlassCard className="p-8" blur="lg" glow>
          {children}
        </GlassCard>
      </main>
    </div>
  );
};

export default Layout;

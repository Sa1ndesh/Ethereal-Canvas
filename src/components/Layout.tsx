import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Palette, Images, Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import WalletConnectButton from './WalletConnectButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { wallet } = useWallet();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-white font-bold text-xl">
                <Palette className="w-8 h-8 text-purple-400" />
                <span>Ethereal Canvas</span>
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
              <WalletConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

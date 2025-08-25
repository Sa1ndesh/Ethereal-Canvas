import React from 'react';
import { Wallet, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';

const WalletConnectButton: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet, connecting, isMetaMaskInstalled } = useWallet();

  if (wallet.connected) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:block text-sm text-gray-300">
          <div className="font-mono">
            {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={disconnectWallet}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connectWallet}
      disabled={connecting}
      className={`flex items-center space-x-2 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors ${
        isMetaMaskInstalled 
          ? 'bg-purple-600 hover:bg-purple-700' 
          : 'bg-orange-600 hover:bg-orange-700'
      }`}
    >
      <Wallet className="w-4 h-4" />
      <span>
        {connecting ? 'Connecting...' : 
         isMetaMaskInstalled ? 'Connect Wallet' : 'Install MetaMask'}
      </span>
    </motion.button>
  );
};

export default WalletConnectButton;

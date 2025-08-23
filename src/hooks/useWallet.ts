import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import type { WalletState } from '../types';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: '0.0'
  });
  const [connecting, setConnecting] = useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock wallet connection
    const mockAddress = faker.finance.ethereumAddress();
    const mockBalance = faker.number.float({ min: 0.1, max: 5.0, fractionDigits: 4 }).toString();
    
    setWallet({
      connected: true,
      address: mockAddress,
      balance: mockBalance
    });
    
    setConnecting(false);
  };

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      balance: '0.0'
    });
  };

  return {
    wallet,
    connectWallet,
    disconnectWallet,
    connecting
  };
};

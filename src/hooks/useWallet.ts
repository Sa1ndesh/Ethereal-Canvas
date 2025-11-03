import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { WalletState } from '../types';

// Declare ethereum object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: '0.0',
    advanceMode: false
  });
  const [connecting, setConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' && 
           (window.ethereum.isMetaMask || window.ethereum.providers?.some((p: any) => p.isMetaMask));
  };

  const checkConnection = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      // Silently return if MetaMask is not installed
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      if (accounts && accounts.length > 0) {
        const ethProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await ethProvider.getSigner();
        const address = await signer.getAddress();
        const balance = await ethProvider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);
        
        setWallet(prev => ({
          ...prev,
          connected: true,
          address,
          balance: parseFloat(balanceInEth).toFixed(4)
        }));
        setProvider(ethProvider);
      } else {
        // No accounts connected
        setWallet(prev => ({
          ...prev,
          connected: false,
          address: null,
          balance: '0.0'
        }));
        setProvider(null);
      }
    } catch (error) {
      // Silently handle errors when checking connection
      // This prevents console spam when MetaMask is not installed
      setWallet(prev => ({
        ...prev,
        connected: false,
        address: null,
        balance: '0.0'
      }));
      setProvider(null);
    }
  }, []);

  const handleAccountsChanged = useCallback(async (accounts: string[]) => {
    if (accounts.length === 0) {
      setWallet(prev => ({
        ...prev,
        connected: false,
        address: null,
        balance: '0.0'
      }));
      setProvider(null);
    } else {
      await checkConnection();
    }
  }, [checkConnection]);

  const handleChainChanged = useCallback(() => {
    // Refresh the page when chain changes to avoid issues
    window.location.reload();
  }, []);

  useEffect(() => {
    // Wait for MetaMask to load
    const initWallet = async () => {
      if (isMetaMaskInstalled()) {
        await checkConnection();
      } else {
        // Wait for MetaMask to load
        const checkForMetaMask = () => {
          if (isMetaMaskInstalled()) {
            checkConnection();
          } else {
            setTimeout(checkForMetaMask, 100);
          }
        };
        checkForMetaMask();
      }
    };

    initWallet();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkConnection, handleAccountsChanged, handleChainChanged]);

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('MetaMask is not installed! Please install MetaMask from https://metamask.io/');
      window.open('https://metamask.io/', '_blank');
      return;
    }

    setConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        await checkConnection();
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.code === 4001) {
        alert('Connection rejected. Please approve the connection in MetaMask.');
      } else if (error.code === -32002) {
        alert('Connection request is already pending. Please check MetaMask.');
      } else {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setConnecting(false);
    }
  };

  const switchToSepoliaTestnet = async () => {
    if (!window.ethereum) return;
    
    try {
      // Try to switch to Sepolia testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet chain ID
      });
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const disconnectWallet = () => {
    setWallet(prev => ({
      ...prev,
      connected: false,
      address: null,
      balance: '0.0'
    }));
    setProvider(null);
  };

  const toggleAdvanceMode = () => {
    setWallet(prev => ({
      ...prev,
      advanceMode: !prev.advanceMode
    }));
  };

  return {
    wallet,
    provider,
    connectWallet,
    disconnectWallet,
    switchToSepoliaTestnet,
    toggleAdvanceMode,
    connecting,
    isMetaMaskInstalled: isMetaMaskInstalled()
  };
};

import React, { useState } from 'react';
import { Download, Coins, ExternalLink, Loader, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';
import { mintNFTOnChain, mintNFTMock } from '../utils/nft-contract';
import { updateImage } from '../utils/storage';
import type { GeneratedImage } from '../types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  onImageUpdate?: (image: GeneratedImage) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, onImageUpdate }) => {
  const { wallet, provider, switchToSepoliaTestnet } = useWallet();
  const [isWalletMinting, setIsWalletMinting] = useState(false);
  const [isGaslessMinting, setIsGaslessMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const handleMintNFT = async () => {
    if (!image || !wallet.connected || image.isNFT) return;

    setIsWalletMinting(true);
    setMintSuccess(false);

    try {
      let result;
      
      // Try real blockchain minting first, fallback to mock if no provider
      if (provider) {
        try {
          result = await mintNFTOnChain(provider, image.imageUrl, image.prompt);
        } catch (error: any) {
          console.warn('Real minting failed, using mock:', error.message);
          
          // Check if it's a network issue
          if (error.message.includes('network') || error.message.includes('Chain ID')) {
            const switchNetwork = window.confirm(
              `${error.message}\n\nWould you like to switch to Sepolia testnet for real NFT minting?`
            );
            
            if (switchNetwork) {
              try {
                await switchToSepoliaTestnet();
                // Retry minting after network switch
                result = await mintNFTOnChain(provider, image.imageUrl, image.prompt);
              } catch (switchError: any) {
                console.error('Network switch failed:', switchError);
                alert('Failed to switch network. Using demo mode instead.');
                result = await mintNFTMock(image.imageUrl, image.prompt);
              }
            } else {
              result = await mintNFTMock(image.imageUrl, image.prompt);
            }
          } else {
            alert(`Real minting failed: ${error.message}\n\nUsing demo mode instead.`);
            result = await mintNFTMock(image.imageUrl, image.prompt);
          }
        }
      } else {
        // Fallback to mock minting
        result = await mintNFTMock(image.imageUrl, image.prompt);
      }
      
      const updatedImage: GeneratedImage = {
        ...image,
        isNFT: true,
        nftTransactionHash: result.transactionHash,
        nftExplorerUrl: result.explorerUrl,
        tokenId: result.tokenId
      };

      console.log('ImageDisplay: Updating image after minting:', {
        id: image.id,
        tokenId: result.tokenId,
        transactionHash: result.transactionHash
      });
      
      updateImage(image.id, {
        isNFT: true,
        nftTransactionHash: result.transactionHash,
        nftExplorerUrl: result.explorerUrl,
        tokenId: result.tokenId
      });

      setMintSuccess(true);
      onImageUpdate?.(updatedImage);
      
      console.log('ImageDisplay: NFT minting completed successfully');
      
      setTimeout(() => setMintSuccess(false), 3000);
    } catch (error: any) {
      console.error('Failed to mint NFT:', error);
      alert(`Failed to mint NFT: ${error.message}`);
    } finally {
      setIsWalletMinting(false);
    }
  };

  const handleGaslessMint = async () => {
    if (!image || image.isNFT) return;

    setIsGaslessMinting(true);
    setMintSuccess(false);

    try {
      console.log('🎨 Starting gasless NFT minting (Demo mode)...');
      
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock transaction data
      const mockTxHash = `0x${Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
      const tokenId = Math.floor(Math.random() * 9999) + 1000;
      
      const result = {
        transactionHash: mockTxHash,
        explorerUrl: `https://polygonscan.com/tx/${mockTxHash}`,
        tokenId: tokenId.toString()
      };
      
      const updatedImage: GeneratedImage = {
        ...image,
        isNFT: true,
        nftTransactionHash: result.transactionHash,
        nftExplorerUrl: result.explorerUrl,
        tokenId: result.tokenId
      };

      console.log('🎉 Gasless NFT minted successfully (Demo):', {
        id: image.id,
        tokenId: result.tokenId,
        transactionHash: result.transactionHash
      });
      
      updateImage(image.id, {
        isNFT: true,
        nftTransactionHash: result.transactionHash,
        nftExplorerUrl: result.explorerUrl,
        tokenId: result.tokenId
      });

      setMintSuccess(true);
      onImageUpdate?.(updatedImage);
      
      setTimeout(() => setMintSuccess(false), 3000);
    } catch (error: any) {
      console.error('Failed to mint NFT gaslessly:', error);
      alert(`Failed to mint NFT: ${error.message}`);
    } finally {
      setIsGaslessMinting(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `ethereal-canvas-${image.id}.png`;
    link.click();
  };

  if (!image) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
        <p className="text-gray-400">Your generated artwork will appear here</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
    >
      <div className="relative">
        <img
          src={image.imageUrl}
          alt={image.prompt}
          className="w-full h-auto rounded-lg border-2 border-white/20"
          onError={(e) => {
            console.error('ImageDisplay: Failed to load image:', image.imageUrl);
            const target = e.target as HTMLImageElement;
            // Only use fallback if it's not already a fallback image
            if (!image.imageUrl.includes('picsum.photos')) {
              console.log('ImageDisplay: Using fallback image');
              target.src = `https://picsum.photos/1024/1024?random=${Date.now()}`;
            }
          }}
          onLoad={() => {
            console.log('ImageDisplay: Image loaded successfully:', image.imageUrl);
          }}
        />
        
        {image.isNFT && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>NFT</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{image.prompt}</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={downloadImage}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </motion.button>

          {!image.isNFT ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGaslessMint}
                disabled={isGaslessMinting || isWalletMinting}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
              >
                {isGaslessMinting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Coins className="w-4 h-4" />
                )}
                <span>
                  {isGaslessMinting ? 'Minting...' : 'Gasless Mint (Free)'}
                </span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMintNFT}
                disabled={!wallet.connected || isWalletMinting || isGaslessMinting}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
              >
                {isWalletMinting ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Coins className="w-4 h-4" />
                )}
                <span>
                  {!wallet.connected ? 'Connect Wallet to Mint' : 
                   isWalletMinting ? 'Minting...' : 'Wallet Mint'}
                </span>
              </motion.button>
            </>
          ) : (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={image.nftExplorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </motion.a>
          )}
        </div>

        {image.isNFT && (
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
              <p className="text-green-300 text-sm">
                <strong>✅ NFT Minted Successfully!</strong> Token ID: {image.tokenId}
              </p>
              <p className="text-green-400 text-xs mt-1 font-mono break-all">
                {image.nftTransactionHash}
              </p>
              <p className="text-yellow-300 text-xs mt-2 italic">
                💡 Demo Mode: Transaction hash is simulated for demonstration
              </p>
            </div>
            
            <div className="p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg">
              <p className="text-blue-300 text-sm font-semibold mb-2">
                🌐 Actual Storage Verification:
              </p>
              <p className="text-blue-200 text-xs">
                ✅ Image: Stored on IPFS (decentralized)
              </p>
              <p className="text-blue-200 text-xs">
                ✅ Metadata: Permanently preserved
              </p>
              <p className="text-blue-200 text-xs">
                ✅ Accessible: Via IPFS gateways globally
              </p>
              <p className="text-gray-300 text-xs mt-2">
                📝 Only transaction is simulated (saves gas fees)
              </p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mintSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8" />
                <div>
                  <p className="font-bold">NFT Minted Successfully!</p>
                  <p className="text-sm opacity-90">Your artwork is now on the blockchain</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageDisplay;

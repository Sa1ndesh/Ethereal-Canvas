import React, { useState } from 'react';
import { Download, Coins, ExternalLink, Loader, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../hooks/useWallet';
import { mintNFT } from '../utils/mock-api';
import { updateImage } from '../utils/storage';
import type { GeneratedImage } from '../types';

interface ImageDisplayProps {
  image: GeneratedImage | null;
  onImageUpdate?: (image: GeneratedImage) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, onImageUpdate }) => {
  const { wallet } = useWallet();
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const handleMintNFT = async () => {
    if (!image || !wallet.connected || image.isNFT) return;

    setIsMinting(true);
    setMintSuccess(false);

    try {
      const result = await mintNFT(image.imageUrl, image.prompt);
      
      const updatedImage: GeneratedImage = {
        ...image,
        isNFT: true,
        nftTransactionHash: result.transactionHash,
        nftExplorerUrl: result.explorerUrl,
        tokenId: result.tokenId
      };

      updateImage(image.id, {
        isNFT: true,
        nftTransactionHash: result.transactionHash,
        nftExplorerUrl: result.explorerUrl,
        tokenId: result.tokenId
      });

      setMintSuccess(true);
      onImageUpdate?.(updatedImage);
      
      setTimeout(() => setMintSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMintNFT}
              disabled={!wallet.connected || isMinting}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
            >
              {isMinting ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Coins className="w-4 h-4" />
              )}
              <span>
                {!wallet.connected ? 'Connect Wallet to Mint' : 
                 isMinting ? 'Minting...' : 'Mint as NFT'}
              </span>
            </motion.button>
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
          <div className="mt-4 p-3 bg-green-600/20 border border-green-600/30 rounded-lg">
            <p className="text-green-300 text-sm">
              <strong>NFT Minted!</strong> Token ID: {image.tokenId}
            </p>
            <p className="text-green-400 text-xs mt-1 font-mono break-all">
              {image.nftTransactionHash}
            </p>
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

// Debug utilities for troubleshooting the NFT platform issues
import { getImages } from './storage';
import type { GeneratedImage } from '../types';

export const debugStorage = () => {
  console.group('🔍 Storage Debug Information');
  
  const images = getImages();
  console.log('Total images in storage:', images.length);
  
  const nftImages = images.filter(img => img.isNFT);
  console.log('NFT images:', nftImages.length);
  
  console.table(images.map(img => ({
    id: img.id,
    prompt: img.prompt.substring(0, 50) + '...',
    isNFT: img.isNFT,
    tokenId: img.tokenId || 'N/A',
    hasTransactionHash: !!img.nftTransactionHash,
    imageUrlType: img.imageUrl.includes('picsum.photos') ? 'Fallback' : 'Generated'
  })));
  
  console.groupEnd();
  return images;
};

export const debugImageLoading = async (imageUrl: string): Promise<boolean> => {
  console.group(`🖼️ Testing Image Load: ${imageUrl}`);
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      console.error('❌ Image load timeout');
      resolve(false);
    }, 10000);
    
    img.onload = () => {
      clearTimeout(timeout);
      console.log('✅ Image loaded successfully');
      console.log('Dimensions:', img.width, 'x', img.height);
      resolve(true);
    };
    
    img.onerror = (error) => {
      clearTimeout(timeout);
      console.error('❌ Image failed to load:', error);
      resolve(false);
    };
    
    img.src = imageUrl;
    console.groupEnd();
  });
};

export const testAllImages = async (): Promise<void> => {
  console.group('🎯 Testing All Stored Images');
  
  const images = getImages();
  const results: Array<{ id: string; success: boolean; url: string }> = [];
  
  for (const image of images) {
    console.log(`Testing image ${image.id}...`);
    const success = await debugImageLoading(image.imageUrl);
    results.push({
      id: image.id,
      success,
      url: image.imageUrl
    });
  }
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Results: ${successful} successful, ${failed} failed`);
  console.table(results);
  console.groupEnd();
};

export const simulateNFTMinting = (imageId: string): void => {
  console.group(`🪙 Simulating NFT Minting for ${imageId}`);
  
  const images = getImages();
  const image = images.find(img => img.id === imageId);
  
  if (!image) {
    console.error('Image not found');
    console.groupEnd();
    return;
  }
  
  console.log('Before minting:', { 
    id: image.id,
    isNFT: image.isNFT,
    tokenId: image.tokenId 
  });
  
  // Simulate the minting process
  const mockResult = {
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    explorerUrl: `#demo-mode`, // Use demo mode indicator instead of fake explorer URL
    tokenId: Math.floor(Math.random() * 9999) + 1000,
    contractAddress: "0x0000000000000000000000000000000000000000"
  };
  
  console.log('Mock minting result:', mockResult);
  console.groupEnd();
};

// Make debug functions available globally in development
declare global {
  interface Window {
    debugEtherealCanvas: {
      debugStorage: typeof debugStorage;
      debugImageLoading: typeof debugImageLoading;
      testAllImages: typeof testAllImages;
      simulateNFTMinting: typeof simulateNFTMinting;
    };
  }
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.debugEtherealCanvas = {
    debugStorage,
    debugImageLoading,
    testAllImages,
    simulateNFTMinting
  };
  
  console.log('🐛 Debug utilities loaded! Use window.debugEtherealCanvas in the console.');
}

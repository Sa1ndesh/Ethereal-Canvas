import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Calendar, Coins, Filter, Trash2, CheckSquare, Square, X } from 'lucide-react';
import { getImages, deleteImage, deleteMultipleImages } from '../utils/storage';
import type { GeneratedImage } from '../types';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [filter, setFilter] = useState<'all' | 'nfts'>('all');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadImages = () => {
      const allImages = getImages();
      console.log('Gallery: Loading images from storage:', allImages.length);
      setImages(allImages);
    };

    loadImages();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      console.log('Gallery: Storage changed, reloading images');
      loadImages();
    };
    
    // Listen for custom events when images are updated
    const handleImageUpdate = () => {
      console.log('Gallery: Image update event received');
      loadImages();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ethereal_canvas_image_updated', handleImageUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ethereal_canvas_image_updated', handleImageUpdate);
    };
  }, []);

  const filteredImages = images.filter(image => 
    filter === 'all' || (filter === 'nfts' && image.isNFT)
  );

  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `ethereal-canvas-${image.id}.png`;
    link.click();
  };

  const handleDeleteImage = (image: GeneratedImage) => {
    const confirmMessage = image.isNFT 
      ? `Are you sure you want to delete this NFT artwork? This action cannot be undone.\n\nPrompt: "${image.prompt}"`
      : `Are you sure you want to delete this artwork? This action cannot be undone.\n\nPrompt: "${image.prompt}"`;
    
    if (window.confirm(confirmMessage)) {
      deleteImage(image.id);
      console.log('Gallery: Image deleted:', image.id);
    }
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedImages(new Set());
  };

  const toggleImageSelection = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const selectAllImages = () => {
    const allImageIds = new Set(filteredImages.map(img => img.id));
    setSelectedImages(allImageIds);
  };

  const deselectAllImages = () => {
    setSelectedImages(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedImages.size === 0) return;
    
    const selectedImagesList = Array.from(selectedImages);
    const nftCount = selectedImagesList.filter(id => 
      images.find(img => img.id === id)?.isNFT
    ).length;
    
    const confirmMessage = `Are you sure you want to delete ${selectedImages.size} selected artwork${selectedImages.size > 1 ? 's' : ''}?${nftCount > 0 ? ` (${nftCount} NFT${nftCount > 1 ? 's' : ''} included)` : ''} This action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      deleteMultipleImages(selectedImagesList);
      setSelectedImages(new Set());
      setSelectMode(false);
      console.log('Gallery: Bulk delete completed:', selectedImagesList.length, 'images');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Gallery</h1>
          <p className="text-gray-400">
            {filteredImages.length} {filter === 'nfts' ? 'NFTs' : 'artworks'} created
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'nfts')}
              className="px-3 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Artworks</option>
              <option value="nfts">NFTs Only</option>
            </select>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSelectMode}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectMode 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            {selectMode ? <X className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
            <span>{selectMode ? 'Cancel' : 'Select'}</span>
          </motion.button>
        </div>
      </div>

      {selectMode && filteredImages.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-purple-600/20 border border-purple-600/30 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">
              {selectedImages.size} of {filteredImages.length} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllImages}
                className="text-purple-300 hover:text-purple-200 text-sm underline"
              >
                Select All
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={deselectAllImages}
                className="text-purple-300 hover:text-purple-200 text-sm underline"
              >
                Deselect All
              </button>
            </div>
          </div>
          
          {selectedImages.size > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Selected ({selectedImages.size})</span>
            </motion.button>
          )}
        </div>
      )}

      {filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {filter === 'nfts' 
              ? "You haven't minted any NFTs yet" 
              : "You haven't created any artworks yet"
            }
          </p>
          <p className="text-gray-500 mt-2">
            Start generating AI art to see your creations here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:border-white/30 transition-colors group"
            >
              <div className="relative mb-4">
                <img
                  src={image.imageUrl}
                  alt={image.prompt}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Gallery: Failed to load image:', image.imageUrl);
                    const target = e.target as HTMLImageElement;
                    // Only use fallback if it's not already a fallback image
                    if (!image.imageUrl.includes('picsum.photos')) {
                      console.log('Gallery: Using fallback image for', image.id);
                      target.src = `https://picsum.photos/400/300?random=${image.id}`;
                    }
                  }}
                  onLoad={() => {
                    console.log('Gallery: Image loaded successfully:', image.id, image.imageUrl);
                  }}
                />
                
                {selectMode && (
                  <div className="absolute top-2 left-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleImageSelection(image.id)}
                      className="p-1 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      {selectedImages.has(image.id) ? (
                        <CheckSquare className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                )}
                
                {image.isNFT && (
                  <div className={`absolute top-2 ${selectMode ? 'right-2' : 'right-2'} bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1`}>
                    <Coins className="w-3 h-3" />
                    <span>NFT</span>
                  </div>
                )}

                {!selectMode && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => downloadImage(image)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    title="Download image"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteImage(image)}
                    className="p-2 bg-red-600/60 backdrop-blur-sm rounded-full text-white hover:bg-red-600/80 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                  
                  {image.isNFT && image.nftExplorerUrl && 
                   image.nftExplorerUrl !== '#demo-mode' && 
                   !image.nftExplorerUrl.includes('sepolia.etherscan.io') && 
                   !image.nftExplorerUrl.includes('polygonscan.com') && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={image.nftExplorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                      title="View on blockchain explorer"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.a>
                  )}
                  
                  {image.isNFT && (image.nftExplorerUrl === '#demo-mode' || 
                   image.nftExplorerUrl?.includes('sepolia.etherscan.io') || 
                   image.nftExplorerUrl?.includes('polygonscan.com')) && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        alert('🎭 Demo NFT\n\nThis NFT was created in demo mode.\n\n• Transaction is simulated\n• No real blockchain costs\n• Great for testing!\n\nDeploy a real contract to mint actual NFTs.');
                      }}
                      className="p-2 bg-orange-600/60 hover:bg-orange-600/80 backdrop-blur-sm rounded-full text-white transition-colors"
                      title="Demo NFT - Click for info"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {image.prompt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(image.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {image.isNFT && image.tokenId && (
                    <span className="font-mono">
                      #{image.tokenId}
                    </span>
                  )}
                </div>

                {image.isNFT && image.nftTransactionHash && (
                  <div className="mt-2 p-2 bg-green-600/20 border border-green-600/30 rounded text-xs">
                    <p className="text-green-300 font-mono break-all">
                      {image.nftTransactionHash.slice(0, 10)}...{image.nftTransactionHash.slice(-8)}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;

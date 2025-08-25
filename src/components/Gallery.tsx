import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, ExternalLink, Calendar, Coins, Filter } from 'lucide-react';
import { getImages } from '../utils/storage';
import type { GeneratedImage } from '../types';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [filter, setFilter] = useState<'all' | 'nfts'>('all');

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Your Gallery</h1>
          <p className="text-gray-400">
            {filteredImages.length} {filter === 'nfts' ? 'NFTs' : 'artworks'} created
          </p>
        </div>

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
      </div>

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
                
                {image.isNFT && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Coins className="w-3 h-3" />
                    <span>NFT</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => downloadImage(image)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  
                  {image.isNFT && image.nftExplorerUrl && (
                    <motion.a
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      href={image.nftExplorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.a>
                  )}
                </div>
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

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GeneratorForm from '../components/GeneratorForm';
import ImageDisplay from '../components/ImageDisplay';
import { generateImage } from '../utils/gemini-api';
import { saveImage } from '../utils/storage';
import type { GeneratedImage } from '../types';

const GeneratePage: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    
    try {
      const imageUrl = await generateImage(prompt);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        imageUrl,
        timestamp: Date.now(),
        isNFT: false
      };

      saveImage(newImage);
      setCurrentImage(newImage);
    } catch (error) {
      console.error('Failed to generate image:', error);
      // Show error to user
      alert(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpdate = (updatedImage: GeneratedImage) => {
    setCurrentImage(updatedImage);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Create Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ethereal</span> Art
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Transform your imagination into stunning AI-generated artwork and mint them as unique NFTs on the blockchain
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ImageDisplay image={currentImage} onImageUpdate={handleImageUpdate} />
        </motion.div>
      </div>

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Generating your artwork...</p>
            <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GeneratePage;

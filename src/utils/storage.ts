import type { GeneratedImage } from '../types';

const STORAGE_KEY = 'ethereal_canvas_images';

export const saveImage = (image: GeneratedImage): void => {
  const existingImages = getImages();
  const updatedImages = [image, ...existingImages];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
};

export const getImages = (): GeneratedImage[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const updateImage = (imageId: string, updates: Partial<GeneratedImage>): void => {
  const images = getImages();
  const updatedImages = images.map(img => 
    img.id === imageId ? { ...img, ...updates } : img
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
};

export const getUserNFTs = (userAddress: string): GeneratedImage[] => {
  return getImages().filter(img => img.isNFT);
};

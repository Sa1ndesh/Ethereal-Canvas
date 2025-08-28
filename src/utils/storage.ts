import type { GeneratedImage } from '../types';

const STORAGE_KEY = 'ethereal_canvas_images';

export const saveImage = (image: GeneratedImage): void => {
  const existingImages = getImages();
  const updatedImages = [image, ...existingImages];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
  
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('ethereal_canvas_image_updated'));
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
  
  console.log('Storage: Image updated', { imageId, updates });
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('ethereal_canvas_image_updated'));
};

export const deleteImage = (imageId: string): void => {
  const images = getImages();
  const updatedImages = images.filter(img => img.id !== imageId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
  
  console.log('Storage: Image deleted', { imageId });
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('ethereal_canvas_image_updated'));
};

export const getUserNFTs = (userAddress: string): GeneratedImage[] => {
  return getImages().filter(img => img.isNFT);
};

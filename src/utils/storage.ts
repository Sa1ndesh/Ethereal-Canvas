import type { GeneratedImage } from '../types';

const STORAGE_KEY = 'ethereal_canvas_images';
const PROMPT_HISTORY_KEY = 'ethereal_canvas_prompt_history';
const FAVORITE_PROMPTS_KEY = 'ethereal_canvas_favorite_prompts';
const MAX_HISTORY_LENGTH = 50;

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

export const deleteMultipleImages = (imageIds: string[]): void => {
  const images = getImages();
  const updatedImages = images.filter(img => !imageIds.includes(img.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
  
  console.log('Storage: Multiple images deleted', { imageIds, count: imageIds.length });
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('ethereal_canvas_image_updated'));
};

export const getUserNFTs = (): GeneratedImage[] => {
  return getImages().filter(img => img.isNFT);
};

// Prompt History Management
export const savePromptToHistory = (prompt: string): void => {
  if (!prompt || prompt.length < 10) return;
  let history = getPromptHistory();
  // Avoid duplicates
  history = history.filter(p => p !== prompt);
  const updatedHistory = [prompt, ...history].slice(0, MAX_HISTORY_LENGTH);
  localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const getPromptHistory = (): string[] => {
  const stored = localStorage.getItem(PROMPT_HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Favorite Prompts Management
export const getFavoritePrompts = (): string[] => {
  const stored = localStorage.getItem(FAVORITE_PROMPTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addPromptToFavorites = (prompt: string): void => {
  const favorites = getFavoritePrompts();
  if (!favorites.includes(prompt)) {
    const updatedFavorites = [prompt, ...favorites];
    localStorage.setItem(FAVORITE_PROMPTS_KEY, JSON.stringify(updatedFavorites));
  }
};

export const removePromptFromFavorites = (prompt: string): void => {
  const favorites = getFavoritePrompts();
  const updatedFavorites = favorites.filter(p => p !== prompt);
  localStorage.setItem(FAVORITE_PROMPTS_KEY, JSON.stringify(updatedFavorites));
};

export const isPromptFavorite = (prompt: string): boolean => {
  const favorites = getFavoritePrompts();
  return favorites.includes(prompt);
};

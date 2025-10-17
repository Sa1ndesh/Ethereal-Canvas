import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Book, Star, Trash2, Copy } from 'lucide-react';

interface PromptHistoryProps {
  history: string[];
  favorites: string[];
  onSelect: (prompt: string) => void;
  onFavoriteToggle: (prompt: string) => void;
  onClearHistory: () => void;
  isOpen: boolean;
}

const PromptHistory: React.FC<PromptHistoryProps> = ({ history, favorites, onSelect, onFavoriteToggle, onClearHistory, isOpen }) => {
  const [activeTab, setActiveTab] = useState('history');

  if (!isOpen) return null;

  const promptsToShow = activeTab === 'history' ? history : favorites;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute bottom-full mb-2 w-full z-20 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl max-h-80 flex flex-col"
      >
        <div className="flex border-b border-gray-700 p-2">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex-1 p-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'history' ? 'bg-purple-600/50 text-white' : 'text-gray-400 hover:bg-gray-800/50'
            }`}>
            <Book size={16} /> History ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 p-2 text-sm font-medium rounded-md flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'favorites' ? 'bg-purple-600/50 text-white' : 'text-gray-400 hover:bg-gray-800/50'
            }`}>
            <Star size={16} /> Favorites ({favorites.length})
          </button>
        </div>

        <div className="overflow-y-auto p-2 flex-1">
          {promptsToShow.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">
              <p>No prompts in {activeTab}.</p>
              {activeTab === 'history' && <p>Generated prompts will appear here.</p>}
              {activeTab === 'favorites' && <p>Click the star icon to save prompts.</p>}
            </div>
          ) : (
            <ul className="space-y-2">
              {promptsToShow.map((prompt, index) => (
                <li key={index} className="p-2 bg-gray-800/50 rounded-md group">
                  <p className="text-xs text-gray-300 mb-2 leading-relaxed break-words">{prompt}</p>
                  <div className="flex items-center justify-end space-x-2">
                    <button type="button" onClick={() => onSelect(prompt)} title="Use this prompt" className="p-1 text-gray-400 hover:text-purple-400 transition-colors"><Copy size={14} /></button>
                    <button type="button" onClick={() => onFavoriteToggle(prompt)} title={favorites.includes(prompt) ? 'Remove from favorites' : 'Add to favorites'} className={`p-1 transition-colors ${favorites.includes(prompt) ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-400 hover:text-yellow-400'}`}>
                      <Star size={14} fill={favorites.includes(prompt) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <div className="border-t border-gray-700 p-2">
            <button type="button" onClick={onClearHistory} className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:bg-red-500/10 p-2 rounded-md transition-colors">
              <Trash2 size={14} /> Clear History
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PromptHistory;

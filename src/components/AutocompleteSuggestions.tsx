import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutocompleteSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  isOpen: boolean;
}

const AutocompleteSuggestions: React.FC<AutocompleteSuggestionsProps> = ({ suggestions, onSelect, isOpen }) => {
  if (!isOpen || suggestions.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto"
      >
        <ul className="py-1">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onSelect(suggestion)}
              className="px-4 py-2 text-sm text-gray-300 hover:bg-purple-600/50 hover:text-white cursor-pointer transition-colors"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
};

export default AutocompleteSuggestions;

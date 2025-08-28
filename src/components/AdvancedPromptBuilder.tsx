import React from 'react';
import { motion } from 'framer-motion';
import { Target, Palette, Camera, Brush, Zap } from 'lucide-react';
import { ART_STYLES, QUALITY_MODIFIERS, LIGHTING_TERMS, COMPOSITION_TERMS } from '../utils/promptEngineering';

interface AdvancedPromptBuilderProps {
  onAppend: (text: string) => void;
}

const builderSections = [
  { name: 'Subject', icon: Target, terms: ['character', 'landscape', 'cityscape', 'animal', 'vehicle', 'building'] },
  { name: 'Style', icon: Brush, terms: Object.values(ART_STYLES).flat().slice(0, 6) },
  { name: 'Quality', icon: Zap, terms: QUALITY_MODIFIERS.slice(0, 6) },
  { name: 'Lighting', icon: Camera, terms: LIGHTING_TERMS.slice(0, 6) },
  { name: 'Composition', icon: Palette, terms: COMPOSITION_TERMS.slice(0, 6) },
];

const AdvancedPromptBuilder: React.FC<AdvancedPromptBuilderProps> = ({ onAppend }) => {
  return (
    <div className="mt-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
      <h3 className="text-sm font-medium text-purple-300 mb-3">Advanced Prompt Builder</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {builderSections.map((section) => (
          <div key={section.name}>
            <div className="flex items-center space-x-2 mb-2">
              <section.icon className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-semibold text-gray-300">{section.name}</h4>
            </div>
            <div className="flex flex-wrap gap-1">
              {section.terms.map((term) => (
                <motion.button
                  key={term}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAppend(`, ${term}`)}
                  className="px-2 py-1 bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white rounded text-xs transition-colors"
                >
                  {term}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvancedPromptBuilder;

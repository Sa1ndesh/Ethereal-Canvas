import React, { useState } from 'react';
import { Wand2, Loader, Sparkles, Lightbulb, RefreshCw, ChevronsUpDown, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { enhancePrompt, generatePromptSuggestions, PROMPT_TEMPLATES, validatePrompt, calculatePromptStrength, getAutocompleteSuggestions } from '../utils/promptEngineering';
import { savePromptToHistory, getPromptHistory, getFavoritePrompts, addPromptToFavorites, removePromptFromFavorites } from '../utils/storage';
import AdvancedPromptBuilder from './AdvancedPromptBuilder';
import AutocompleteSuggestions from './AutocompleteSuggestions';
import PromptHistory from './PromptHistory';

interface GeneratorFormProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>(getPromptHistory());
  const [favoritePrompts, setFavoritePrompts] = useState<string[]>(getFavoritePrompts());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (trimmedPrompt && !isGenerating) {
      savePromptToHistory(trimmedPrompt);
      setPromptHistory(getPromptHistory());
      onGenerate(trimmedPrompt);
    }
  };

  const handleEnhancePrompt = () => {
    if (prompt.trim()) {
      const enhanced = enhancePrompt(prompt);
      setPrompt(enhanced.enhanced);
    }
  };

  const handleGenerateSuggestions = () => {
    if (prompt.trim()) {
      const newSuggestions = generatePromptSuggestions(prompt);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setPrompt(template);
    setShowTemplates(false);
  };

  const handleAppendToPrompt = (text: string) => {
    setPrompt(prev => prev ? `${prev}${text}` : text.trim());
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    const newSuggestions = getAutocompleteSuggestions(value);
    setAutocompleteSuggestions(newSuggestions);
    setIsAutocompleteOpen(newSuggestions.length > 0);
  };

  const handleAutocompleteSelect = (suggestion: string) => {
    setPrompt(prev => {
      const words = prev.split(/\s+/);
      words.pop(); // Remove the partially typed word
      return `${words.join(' ')} ${suggestion}, `;
    });
    setIsAutocompleteOpen(false);
  };

  const handleFavoriteToggle = (promptToToggle: string) => {
    const isFavorite = favoritePrompts.includes(promptToToggle);
    if (isFavorite) {
      removePromptFromFavorites(promptToToggle);
    } else {
      addPromptToFavorites(promptToToggle);
    }
    setFavoritePrompts(getFavoritePrompts());
  };

  const handleSelectFromHistory = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('ethereal_canvas_prompt_history'); // A bit direct, but effective for this scope
    setPromptHistory([]);
  };

  const examplePrompts = [
    "A mystical forest with glowing mushrooms and ethereal spirits, digital art, high quality, detailed",
    "Cyberpunk cityscape with neon lights reflecting in rain, futuristic concept art, vibrant colors",
    "Abstract representation of consciousness in cosmic colors, surreal digital art, masterpiece",
    "Steampunk dragon with mechanical wings and golden gears, fantasy art, detailed, dramatic lighting",
    "Underwater palace made of coral and bioluminescent plants, fantasy art, cinematic, photorealistic"
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Generate AI Art
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Describe your vision
          </label>
          <div className="relative">
            <AutocompleteSuggestions
              suggestions={autocompleteSuggestions}
              onSelect={handleAutocompleteSelect}
              isOpen={isAutocompleteOpen}
            />
            <textarea
              id="prompt"
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Enter a detailed description of the artwork you want to create... (e.g., 'A majestic dragon flying over a medieval castle, fantasy art, detailed, vibrant colors')"
              className="w-full h-28 px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 resize-none"
              disabled={isGenerating}
            />
            
            {/* Prompt Engineering Tools */}
            <div className="absolute top-2 right-2 flex space-x-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleEnhancePrompt}
                disabled={!prompt.trim() || isGenerating}
                className="p-1.5 bg-purple-600/80 hover:bg-purple-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                title="Enhance prompt"
              >
                <Sparkles className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleGenerateSuggestions}
                disabled={!prompt.trim() || isGenerating}
                className="p-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                title="Get suggestions"
              >
                <Lightbulb className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                disabled={isGenerating}
                className="p-1.5 bg-green-600/80 hover:bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                title="Browse templates"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setShowAdvancedBuilder(!showAdvancedBuilder)}
                disabled={isGenerating}
                className="p-1.5 bg-gray-600/80 hover:bg-gray-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                title="Advanced Builder"
              >
                <ChevronsUpDown className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Prompt Strength Meter */}
            <div className="absolute bottom-2 left-3 right-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-400">Prompt Strength</span>
                <span className={`text-xs font-bold ${calculatePromptStrength(prompt).color}`}>
                  {calculatePromptStrength(prompt).feedback}
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${calculatePromptStrength(prompt).score}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
          
          {/* Prompt validation */}
          {prompt && (() => {
            const validation = validatePrompt(prompt);
            return !validation.isValid && (
              <div className="mt-2 p-2 bg-yellow-600/20 border border-yellow-600/30 rounded text-xs text-yellow-300">
                <p className="font-medium mb-1">💡 Suggestions to improve your prompt:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {validation.suggestions.map((suggestion, idx) => (
                    <li key={idx}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* Advanced Prompt Builder */}
          {showAdvancedBuilder && <AdvancedPromptBuilder onAppend={handleAppendToPrompt} />}
        </div>

        <div className="relative flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
          >
            {isGenerating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Wand2 className="w-5 h-5" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate Art'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-3 bg-gray-700/50 hover:bg-gray-700/80 text-white rounded-lg"
            title="Prompt History"
          >
            <History className="w-5 h-5" />
          </motion.button>

          <PromptHistory
            isOpen={showHistory}
            history={promptHistory}
            favorites={favoritePrompts}
            onSelect={handleSelectFromHistory}
            onFavoriteToggle={handleFavoriteToggle}
            onClearHistory={handleClearHistory}
          />
        </div>
      </form>

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-blue-300">✨ AI-Enhanced Suggestions</h3>
            <button
              onClick={() => setShowSuggestions(false)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setPrompt(suggestion);
                  setShowSuggestions(false);
                }}
                disabled={isGenerating}
                className="w-full text-left p-2 bg-black/20 hover:bg-black/30 border border-blue-600/30 hover:border-blue-500 rounded text-xs text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Templates */}
      {showTemplates && (
        <div className="mt-4 p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-green-300">🎨 Prompt Templates</h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-green-400 hover:text-green-300 text-sm"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PROMPT_TEMPLATES.map((template) => (
              <div key={template.id} className="p-3 bg-black/20 border border-green-600/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-green-300">{template.name}</h4>
                  <span className="text-xs text-gray-400">{template.category}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{template.description}</p>
                <button
                  onClick={() => handleTemplateSelect(template.template)}
                  disabled={isGenerating}
                  className="w-full text-xs p-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-3">Try these example prompts:</p>
        <div className="space-y-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isGenerating}
              className="w-full text-left p-3 bg-black/20 hover:bg-black/30 border border-gray-600 hover:border-gray-500 rounded-lg text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneratorForm;

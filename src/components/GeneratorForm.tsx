import React, { useState } from 'react';
import { Wand2, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface GeneratorFormProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim());
    }
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
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a detailed description of the artwork you want to create... (e.g., 'A majestic dragon flying over a medieval castle, fantasy art, detailed, vibrant colors')"
            className="w-full h-32 px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 resize-none"
            disabled={isGenerating}
          />
        </div>

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
      </form>

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

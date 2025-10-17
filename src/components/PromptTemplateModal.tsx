import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Copy, Sparkles } from 'lucide-react';
import { PROMPT_TEMPLATES, PromptTemplate } from '../utils/promptEngineering';

interface PromptTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string) => void;
}

const PromptTemplateModal: React.FC<PromptTemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(PROMPT_TEMPLATES.map(t => t.category)))];

  const filteredTemplates = PROMPT_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: PromptTemplate) => {
    onSelectTemplate(template.template);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[80vh] bg-gray-900/95 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Prompt Templates</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search and Filter */}
            <div className="p-6 border-b border-white/10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {template.name}
                        </h3>
                        <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                          {template.category}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(template.template)}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="Copy template"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    
                    <div className="p-2 bg-black/30 rounded text-xs text-gray-300 font-mono mb-3 border-l-2 border-purple-400/50">
                      {template.template}
                    </div>
                    
                    <button
                      onClick={() => handleTemplateSelect(template)}
                      className="w-full py-2 px-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Use This Template
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400">No templates found matching your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PromptTemplateModal;

// Prompt Engineering Utilities for AI Art Generation

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  template: string;
  description: string;
}

export interface PromptEnhancement {
  original: string;
  enhanced: string;
  improvements: string[];
}

// Art style keywords and modifiers
export const ART_STYLES = {
  digital: ['digital art', 'concept art', 'digital painting', 'matte painting'],
  traditional: ['oil painting', 'watercolor', 'acrylic painting', 'pencil drawing'],
  photography: ['photorealistic', 'cinematic', 'portrait photography', 'macro photography'],
  fantasy: ['fantasy art', 'magical realism', 'mythological', 'ethereal'],
  scifi: ['cyberpunk', 'futuristic', 'sci-fi concept art', 'space art'],
  abstract: ['abstract art', 'surreal', 'psychedelic', 'geometric abstract']
};

export const QUALITY_MODIFIERS = [
  'high quality', 'detailed', 'masterpiece', 'award winning',
  '8k resolution', 'ultra detailed', 'professional', 'stunning'
];

export const LIGHTING_TERMS = [
  'dramatic lighting', 'soft lighting', 'golden hour', 'volumetric lighting',
  'rim lighting', 'ambient lighting', 'cinematic lighting', 'natural lighting'
];

export const COMPOSITION_TERMS = [
  'rule of thirds', 'dynamic composition', 'centered composition',
  'wide angle', 'close-up', 'bird\'s eye view', 'low angle'
];

// Prompt templates by category
export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'fantasy-landscape',
    name: 'Fantasy Landscape',
    category: 'Fantasy',
    template: 'A {adjective} {landscape_type} with {magical_elements}, {art_style}, {quality_modifiers}, {lighting}',
    description: 'Creates mystical and magical landscapes'
  },
  {
    id: 'portrait-character',
    name: 'Character Portrait',
    category: 'Portrait',
    template: 'Portrait of a {character_type} {character_details}, {art_style}, {quality_modifiers}, {lighting}',
    description: 'Generates detailed character portraits'
  },
  {
    id: 'cyberpunk-scene',
    name: 'Cyberpunk Scene',
    category: 'Sci-Fi',
    template: 'Cyberpunk {scene_type} with {tech_elements}, neon lights, {weather}, {art_style}, {quality_modifiers}',
    description: 'Creates futuristic cyberpunk environments'
  },
  {
    id: 'abstract-concept',
    name: 'Abstract Concept',
    category: 'Abstract',
    template: 'Abstract representation of {concept} using {colors} and {shapes}, {art_style}, {quality_modifiers}',
    description: 'Visualizes abstract concepts and emotions'
  },
  {
    id: 'nature-scene',
    name: 'Nature Scene',
    category: 'Nature',
    template: 'Beautiful {nature_element} in {environment}, {time_of_day}, {art_style}, {quality_modifiers}, {lighting}',
    description: 'Creates stunning natural environments'
  }
];

// Enhance a basic prompt with additional details
export const enhancePrompt = (originalPrompt: string): PromptEnhancement => {
  let enhanced = originalPrompt.trim();
  const improvements: string[] = [];

  // Add quality modifiers if not present
  const hasQuality = QUALITY_MODIFIERS.some(modifier => 
    enhanced.toLowerCase().includes(modifier.toLowerCase())
  );
  
  if (!hasQuality) {
    enhanced += ', high quality, detailed';
    improvements.push('Added quality modifiers');
  }

  // Add art style if not specified
  const hasArtStyle = Object.values(ART_STYLES).flat().some(style =>
    enhanced.toLowerCase().includes(style.toLowerCase())
  );

  if (!hasArtStyle) {
    enhanced += ', digital art';
    improvements.push('Added art style specification');
  }

  // Add lighting if not mentioned
  const hasLighting = LIGHTING_TERMS.some(term =>
    enhanced.toLowerCase().includes(term.toLowerCase())
  );

  if (!hasLighting && enhanced.length < 100) {
    enhanced += ', dramatic lighting';
    improvements.push('Added lighting description');
  }

  // Remove redundant commas and clean up
  enhanced = enhanced.replace(/,\s*,/g, ',').replace(/,\s*$/, '');

  return {
    original: originalPrompt,
    enhanced,
    improvements
  };
};

// Generate prompt suggestions based on input
export const generatePromptSuggestions = (basePrompt: string): string[] => {
  const suggestions: string[] = [];
  const lower = basePrompt.toLowerCase();

  // Style variations
  if (lower.includes('landscape') || lower.includes('nature')) {
    suggestions.push(`${basePrompt}, photorealistic, golden hour lighting, cinematic`);
    suggestions.push(`${basePrompt}, fantasy art, magical atmosphere, ethereal`);
    suggestions.push(`${basePrompt}, oil painting style, impressionist, masterpiece`);
  }

  if (lower.includes('portrait') || lower.includes('character')) {
    suggestions.push(`${basePrompt}, professional portrait photography, studio lighting`);
    suggestions.push(`${basePrompt}, fantasy character art, detailed, dramatic lighting`);
    suggestions.push(`${basePrompt}, digital painting, concept art, high quality`);
  }

  if (lower.includes('city') || lower.includes('urban')) {
    suggestions.push(`${basePrompt}, cyberpunk aesthetic, neon lights, futuristic`);
    suggestions.push(`${basePrompt}, architectural photography, golden hour, cinematic`);
    suggestions.push(`${basePrompt}, concept art, matte painting, detailed`);
  }

  // If no specific suggestions, provide general enhancements
  if (suggestions.length === 0) {
    suggestions.push(`${basePrompt}, digital art, high quality, detailed`);
    suggestions.push(`${basePrompt}, concept art, cinematic lighting, masterpiece`);
    suggestions.push(`${basePrompt}, photorealistic, 8k resolution, professional`);
  }

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

// Extract keywords from prompt for categorization
export const extractPromptKeywords = (prompt: string): string[] => {
  const keywords: string[] = [];
  const lower = prompt.toLowerCase();

  // Check for art styles
  Object.entries(ART_STYLES).forEach(([category, styles]) => {
    if (styles.some(style => lower.includes(style.toLowerCase()))) {
      keywords.push(category);
    }
  });

  // Check for common subjects
  const subjects = ['portrait', 'landscape', 'abstract', 'character', 'animal', 'building', 'vehicle'];
  subjects.forEach(subject => {
    if (lower.includes(subject)) {
      keywords.push(subject);
    }
  });

  return keywords;
};

// Validate prompt quality
export const validatePrompt = (prompt: string): { isValid: boolean; suggestions: string[] } => {
  const suggestions: string[] = [];
  
  if (prompt.length < 10) {
    suggestions.push('Add more descriptive details to your prompt');
  }

  if (!prompt.includes(',') && prompt.length > 20) {
    suggestions.push('Consider adding style modifiers (e.g., "digital art, high quality")');
  }

  const hasQuality = QUALITY_MODIFIERS.some(modifier => 
    prompt.toLowerCase().includes(modifier.toLowerCase())
  );
  
  if (!hasQuality) {
    suggestions.push('Add quality modifiers like "high quality" or "detailed"');
  }

  return {
    isValid: suggestions.length === 0,
    suggestions
  };
};

// Calculate prompt strength for meter UI
export const calculatePromptStrength = (prompt: string): { score: number; feedback: string; color: string } => {
  let score = 0;
  const lower = prompt.toLowerCase();

  // Length score (up to 30 points)
  if (prompt.length > 150) score += 30;
  else if (prompt.length > 100) score += 25;
  else if (prompt.length > 50) score += 20;
  else if (prompt.length > 20) score += 10;
  else if (prompt.length > 5) score += 5;

  // Keyword scores (up to 70 points)
  const keywordChecks = [
    { terms: QUALITY_MODIFIERS, points: 20 },
    { terms: Object.values(ART_STYLES).flat(), points: 20 },
    { terms: LIGHTING_TERMS, points: 15 },
    { terms: COMPOSITION_TERMS, points: 15 },
  ];

  keywordChecks.forEach(({ terms, points }) => {
    if (terms.some(term => lower.includes(term.toLowerCase()))) {
      score += points;
    }
  });

  score = Math.min(score, 100); // Cap score at 100

  let feedback = 'Weak';
  let color = 'text-red-400';

  if (score > 80) {
    feedback = 'Excellent';
    color = 'text-green-400';
  } else if (score > 60) {
    feedback = 'Strong';
    color = 'text-teal-400';
  } else if (score > 40) {
    feedback = 'Good';
    color = 'text-blue-400';
  } else if (score > 20) {
    feedback = 'Fair';
    color = 'text-yellow-400';
  }

  return { score, feedback, color };
};

// Get autocomplete suggestions
const allKeywords = [
  ...Object.values(ART_STYLES).flat(),
  ...QUALITY_MODIFIERS,
  ...LIGHTING_TERMS,
  ...COMPOSITION_TERMS,
];

export const getAutocompleteSuggestions = (prompt: string): string[] => {
  const lastWord = prompt.split(/\s+/).pop()?.toLowerCase() || '';

  if (lastWord.length < 2) {
    return [];
  }

  const suggestions = allKeywords.filter(keyword => 
    keyword.toLowerCase().startsWith(lastWord) && keyword.toLowerCase() !== lastWord
  );

  return suggestions.slice(0, 5); // Return top 5 suggestions
};

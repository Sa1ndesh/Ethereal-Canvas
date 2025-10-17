import { faker } from '@faker-js/faker';
import OpenAI from 'openai';
import Replicate from 'replicate';
import type { AIImageResponse, AIService, GenerationOptions } from '../types';

// AI Service Configuration
const AI_CONFIG = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    enabled: !!import.meta.env.VITE_OPENAI_API_KEY && import.meta.env.VITE_OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE'
  },
  stability: {
    apiKey: import.meta.env.VITE_STABILITY_API_KEY,
    endpoint: import.meta.env.VITE_STABILITY_API_URL,
    enabled: !!import.meta.env.VITE_STABILITY_API_KEY && import.meta.env.VITE_STABILITY_API_KEY !== 'YOUR_STABILITY_AI_API_KEY_HERE'
  },
  replicate: {
    apiKey: import.meta.env.VITE_REPLICATE_API_KEY,
    enabled: !!import.meta.env.VITE_REPLICATE_API_KEY && import.meta.env.VITE_REPLICATE_API_KEY !== 'YOUR_REPLICATE_API_KEY_HERE'
  },
  huggingface: {
    apiKey: import.meta.env.VITE_HUGGING_FACE_API_KEY,
    endpoint: import.meta.env.VITE_HUGGING_FACE_API_URL,
    enabled: !!import.meta.env.VITE_HUGGING_FACE_API_KEY && import.meta.env.VITE_HUGGING_FACE_API_KEY !== 'YOUR_HUGGING_FACE_API_KEY_HERE'
  }
};

// Initialize OpenAI client
let openai: OpenAI | null = null;
if (AI_CONFIG.openai.enabled) {
  try {
    openai = new OpenAI({
      apiKey: AI_CONFIG.openai.apiKey,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.warn('Failed to initialize OpenAI client:', error);
  }
}

// Initialize Replicate client
let replicate: Replicate | null = null;
if (AI_CONFIG.replicate.enabled) {
  try {
    replicate = new Replicate({
      auth: AI_CONFIG.replicate.apiKey,
    });
  } catch (error) {
    console.warn('Failed to initialize Replicate client:', error);
  }
}

// OpenAI DALL-E Image Generation
const generateWithOpenAI = async (prompt: string, options: GenerationOptions = {}): Promise<AIImageResponse> => {
  if (!openai) {
    return { success: false, error: 'OpenAI client not initialized' };
  }

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: options.quality || "standard",
      style: options.style || "vivid"
    });

    const imageUrl = response.data[0]?.url;
    if (imageUrl) {
      return { success: true, imageUrl, service: 'openai' };
    } else {
      return { success: false, error: 'No image generated', service: 'openai' };
    }
  } catch (error: any) {
    console.error('OpenAI DALL-E Error:', error);
    return { success: false, error: error.message || 'OpenAI generation failed', service: 'openai' };
  }
};

// Stability AI Image Generation
const generateWithStability = async (prompt: string, options: GenerationOptions = {}): Promise<AIImageResponse> => {
  if (!AI_CONFIG.stability.enabled) {
    return { success: false, error: 'Stability AI not configured' };
  }

  try {
    const response = await fetch(AI_CONFIG.stability.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.stability.apiKey}`
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: options.height || 1024,
        width: options.width || 1024,
        steps: options.steps || 30,
        samples: 1
      })
    });

    if (!response.ok) {
      throw new Error(`Stability AI API error: ${response.status}`);
    }

    const result = await response.json();
    const imageBase64 = result.artifacts[0]?.base64;
    
    if (imageBase64) {
      const imageUrl = `data:image/png;base64,${imageBase64}`;
      return { success: true, imageUrl, service: 'stability' };
    } else {
      return { success: false, error: 'No image generated', service: 'stability' };
    }
  } catch (error: any) {
    console.error('Stability AI Error:', error);
    return { success: false, error: error.message || 'Stability AI generation failed', service: 'stability' };
  }
};

// Replicate Image Generation
const generateWithReplicate = async (prompt: string, options: GenerationOptions = {}): Promise<AIImageResponse> => {
  if (!replicate) {
    return { success: false, error: 'Replicate client not initialized' };
  }

  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      {
        input: {
          prompt: prompt,
          width: options.width || 1024,
          height: options.height || 1024,
          num_inference_steps: options.steps || 50
        }
      }
    ) as string[];

    const imageUrl = output[0];
    if (imageUrl) {
      return { success: true, imageUrl, service: 'replicate' };
    } else {
      return { success: false, error: 'No image generated', service: 'replicate' };
    }
  } catch (error: any) {
    console.error('Replicate Error:', error);
    return { success: false, error: error.message || 'Replicate generation failed', service: 'replicate' };
  }
};

// Hugging Face Image Generation
const generateWithHuggingFace = async (prompt: string, options: GenerationOptions = {}): Promise<AIImageResponse> => {
  if (!AI_CONFIG.huggingface.enabled) {
    return { success: false, error: 'Hugging Face not configured' };
  }

  try {
    const response = await fetch(AI_CONFIG.huggingface.endpoint!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_CONFIG.huggingface.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: options.width || 512,
          height: options.height || 512,
          num_inference_steps: options.steps || 30
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    
    return { success: true, imageUrl, service: 'huggingface' };
  } catch (error: any) {
    console.error('Hugging Face Error:', error);
    return { success: false, error: error.message || 'Hugging Face generation failed', service: 'huggingface' };
  }
};

// Mock fallback
const generateWithMock = async (prompt: string): Promise<AIImageResponse> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const encodedPrompt = encodeURIComponent(prompt);
  return {
    success: true,
    imageUrl: `https://picsum.photos/1024/1024?random=${Date.now()}&text=${encodedPrompt}`,
    service: 'mock'
  };
};

// Main image generation function with fallback logic
export const generateImage = async (prompt: string, options: GenerationOptions = {}): Promise<string> => {
  const services: Array<() => Promise<AIImageResponse>> = [];

  // Add available services in order of preference
  if (AI_CONFIG.openai.enabled) {
    services.push(() => generateWithOpenAI(prompt, options));
  }
  if (AI_CONFIG.stability.enabled) {
    services.push(() => generateWithStability(prompt, options));
  }
  if (AI_CONFIG.replicate.enabled) {
    services.push(() => generateWithReplicate(prompt, options));
  }
  if (AI_CONFIG.huggingface.enabled) {
    services.push(() => generateWithHuggingFace(prompt, options));
  }
  
  // Always add mock as fallback
  services.push(() => generateWithMock(prompt));

  // Try each service until one succeeds
  for (const service of services) {
    try {
      const result = await service();
      if (result.success && result.imageUrl) {
        console.log(`✅ Image generated successfully using ${result.service}`);
        return result.imageUrl;
      }
    } catch (error) {
      console.warn('Service failed, trying next...', error);
      continue;
    }
  }

  throw new Error('All AI image generation services failed');
};

// Mock blockchain transaction
export const mintNFT = async (imageUrl: string, prompt: string): Promise<{
  transactionHash: string;
  explorerUrl: string;
  tokenId: string;
}> => {
  // Simulate transaction delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const transactionHash = faker.string.hexadecimal({ length: 64, prefix: '0x' });
  const tokenId = faker.number.int({ min: 1000, max: 9999 }).toString();
  
  return {
    transactionHash,
    explorerUrl: `#demo-mode`, // Use demo mode indicator instead of fake explorer URL
    tokenId
  };
};

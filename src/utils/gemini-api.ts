export const generateImage = async (prompt: string): Promise<string> => {
  try {
    // Enhanced prompt for better AI art generation
    const enhancedPrompt = `${prompt}, digital art, high quality, detailed, vibrant colors, professional composition, masterpiece`;
    
    console.log('Generating image with AI...');
    
    // Try multiple AI services in order of preference
    const services = [
      // Try proxy first if in development
      ...(import.meta.env.DEV ? [() => {
        const seed = Math.floor(Math.random() * 1000000);
        const url = `/api/image/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;
        console.log('Trying Pollinations via Proxy:', url);
        return testImageUrl(url, 'Pollinations Proxy');
      }] : []),
      // Pollinations AI - primary service (newer endpoint)
      () => {
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;
        console.log('Trying Pollinations AI (Enhanced):', url);
        return testImageUrl(url, 'Pollinations Enhanced');
      },
      // Try with a simpler prompt structure
      () => {
        const simplePrompt = prompt.length > 100 ? prompt.substring(0, 100) : prompt;
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(simplePrompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
        console.log('Trying Pollinations AI (Simple):', url);
        return testImageUrl(url, 'Pollinations Simple');
      },
      // Alternative endpoint without enhance
      () => {
        const seed = Math.floor(Math.random() * 1000000);
        const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}`;
        console.log('Trying Pollinations Alt:', url);
        return testImageUrl(url, 'Pollinations Alt');
      },
      // Placeholder.com as CORS-friendly fallback
      () => {
        const colors = ['ff6b6b', '4ecdc4', '45b7d1', 'f7b733', '5f27cd', 'ff6348', '7bed9f', 'ffa502'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const url = `https://via.placeholder.com/1024/${randomColor}/ffffff?text=${encodeURIComponent('AI Generated Art')}`;
        console.log('Using Placeholder fallback:', url);
        return testImageUrl(url, 'Placeholder');
      },
      // Final fallback - Lorem Picsum
      () => {
        const imageId = Math.floor(Math.random() * 1000) + 1;
        const url = `https://picsum.photos/1024/1024?random=${imageId}&blur=0`;
        console.log('Using Picsum fallback:', url);
        return testImageUrl(url, 'Picsum');
      }
    ];

    // Try each service until one works
    for (const service of services) {
      try {
        const result = await service();
        if (result) {
          console.log('Successfully generated image');
          return result;
        }
      } catch (error) {
        console.warn('Service failed, trying next...', error);
        continue;
      }
    }

    throw new Error('All image generation services failed');

  } catch (error) {
    console.error('Image Generation Error:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};

// Helper function to test if an image URL is valid and loads properly
const testImageUrl = (url: string, serviceName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For development, try to load without CORS first
    const img = new Image();
    
    const timeout = setTimeout(() => {
      console.warn(`${serviceName} timeout`);
      reject(new Error(`${serviceName} timeout`));
    }, 15000); // Increased timeout
    
    img.onload = () => {
      clearTimeout(timeout);
      console.log(`${serviceName} loaded successfully`);
      resolve(url);
    };
    
    img.onerror = (error) => {
      clearTimeout(timeout);
      console.warn(`${serviceName} failed to load:`, error);
      // Try without crossOrigin for CORS issues
      if (img.crossOrigin) {
        console.log(`${serviceName}: Retrying without CORS`);
        const img2 = new Image();
        const timeout2 = setTimeout(() => {
          reject(new Error(`${serviceName} failed`));
        }, 10000);
        
        img2.onload = () => {
          clearTimeout(timeout2);
          console.log(`${serviceName} loaded without CORS`);
          resolve(url);
        };
        
        img2.onerror = () => {
          clearTimeout(timeout2);
          reject(new Error(`${serviceName} failed`));
        };
        
        img2.src = url;
      } else {
        reject(new Error(`${serviceName} failed`));
      }
    };
    
    // Try with crossOrigin first for better compatibility
    img.crossOrigin = 'anonymous';
    img.src = url;
  });
};

// ... rest of the code remains the same ...

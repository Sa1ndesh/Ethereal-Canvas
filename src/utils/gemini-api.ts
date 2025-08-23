export const generateImage = async (prompt: string): Promise<string> => {
  try {
    // Enhanced prompt for better AI art generation
    const enhancedPrompt = `${prompt}, digital art, high quality, detailed, vibrant colors, professional composition, masterpiece`;
    
    console.log('Using Pollinations AI for reliable image generation...');
    
    // Use Pollinations AI - reliable, free, works consistently
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}&nologo=true`;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log('Successfully generated image with Pollinations AI');
        resolve(pollinationsUrl);
      };
      
      img.onerror = () => {
        console.log('Pollinations failed, using simple fallback');
        const fallbackUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        resolve(fallbackUrl);
      };
      
      setTimeout(() => {
        console.log('Image generation timeout, using fallback');
        const fallbackUrl = `https://picsum.photos/512/512?random=${Date.now()}`;
        resolve(fallbackUrl);
      }, 15000);
      
      img.src = pollinationsUrl;
    });

  } catch (error) {
    console.error('Image Generation Error:', error);
    throw new Error('Failed to generate image. Please try again.');
  }
};

// ... rest of the code remains the same ...

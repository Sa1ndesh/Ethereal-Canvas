// Netlify serverless function for AI image generation
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Enhanced prompt for better AI art generation
    const enhancedPrompt = `${prompt}, digital art, high quality, detailed, vibrant colors, professional composition, masterpiece`;

    // Use Hugging Face Inference API for image generation
    const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
    
    if (HF_API_KEY) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
          {
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: enhancedPrompt,
              parameters: {
                num_inference_steps: 50,
                guidance_scale: 7.5,
                width: 512,
                height: 512
              }
            }),
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const buffer = await blob.arrayBuffer();
          const base64 = Buffer.from(buffer).toString('base64');
          const imageUrl = `data:image/png;base64,${base64}`;
          
          return res.status(200).json({ 
            imageUrl,
            prompt: enhancedPrompt,
            source: 'huggingface'
          });
        }
      } catch (hfError) {
        console.error('Hugging Face API Error:', hfError);
      }
    }

    // Fallback to Pollinations API (free, no API key required)
    try {
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&seed=${Math.floor(Math.random() * 1000000)}`;
      
      // Test if the URL is accessible
      const testResponse = await fetch(pollinationsUrl, { method: 'HEAD' });
      
      if (testResponse.ok) {
        return res.status(200).json({ 
          imageUrl: pollinationsUrl,
          prompt: enhancedPrompt,
          source: 'pollinations'
        });
      }
    } catch (pollError) {
      console.error('Pollinations API Error:', pollError);
    }

    // Final fallback to a styled placeholder
    const fallbackUrl = `https://via.placeholder.com/512x512/6366f1/ffffff?text=${encodeURIComponent('AI Art: ' + prompt.slice(0, 20) + '...')}`;
    
    return res.status(200).json({ 
      imageUrl: fallbackUrl,
      prompt: enhancedPrompt,
      source: 'placeholder',
      message: 'Using placeholder - configure HUGGING_FACE_API_KEY for AI generation'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

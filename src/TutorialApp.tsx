import { useState } from "react";
import axios from 'axios';
import { NFTStorage } from "nft.storage";

function TutorialApp() {
  const [prompt, setPrompt] = useState("");
  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const generateArt = async () => {
    try {
      console.log('🎨 Starting AI image generation...');
      
      // Use the same proven method as the advanced mode
      const enhancedPrompt = `${prompt}, digital art, high quality, detailed, vibrant colors, professional composition, masterpiece`;
      
      // Try multiple services like the advanced mode does
      const services = [
        // Pollinations AI - primary service
        async () => {
          const seed = Math.floor(Math.random() * 1000000);
          const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=512&height=512&seed=${seed}&nologo=true&enhance=true`;
          console.log('Trying Pollinations AI:', url);
          return await testImageUrl(url, 'Pollinations AI');
        },
        // Simpler Pollinations
        async () => {
          const seed = Math.floor(Math.random() * 1000000);
          const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}`;
          console.log('Trying Simple Pollinations:', url);
          return await testImageUrl(url, 'Simple Pollinations');
        },
        // Placeholder fallback
        async () => {
          const colors = ['ff6b6b', '4ecdc4', '45b7d1', 'f7b733', '5f27cd'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const url = `https://via.placeholder.com/512x512/${color}/ffffff?text=${encodeURIComponent('AI Art: ' + prompt.slice(0, 20))}`;
          console.log('Using Placeholder:', url);
          return await testImageUrl(url, 'Placeholder');
        }
      ];
      
      // Try each service until one works
      for (const service of services) {
        try {
          const imageUrl = await service();
          if (imageUrl) {
            // Convert URL to blob for file handling
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            
            const file = new File([blob], "image.png", {
              type: "image/png",
            });
            setFile(file);
            
            const url = URL.createObjectURL(blob);
            console.log('✅ Image generation successful!');
            setImageBlob(url);
            return;
          }
        } catch (error) {
          console.warn('Service failed, trying next...', error);
          continue;
        }
      }
      
      throw new Error('All image generation services failed');
      
    } catch (err) {
      console.error('All AI generation methods failed:', err);
      
      // Final fallback - create a canvas image
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI Art Generated', 256, 200);
        
        ctx.font = '16px Arial';
        ctx.fillText('Demo Mode', 256, 240);
        ctx.fillText(`"${prompt.slice(0, 30)}..."`, 256, 280);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "image.png", {
              type: "image/png",
            });
            setFile(file);
            
            const url = URL.createObjectURL(blob);
            console.log('✅ Canvas fallback image created');
            setImageBlob(url);
          }
        }, 'image/png');
      }
    }
  };
  
  // Helper function to test if an image URL works (same as advanced mode)
  const testImageUrl = (url: string, serviceName: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      const timeout = setTimeout(() => {
        console.warn(`${serviceName} timeout`);
        reject(new Error(`${serviceName} timeout`));
      }, 10000);
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log(`${serviceName} loaded successfully`);
        resolve(url);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.warn(`${serviceName} failed to load`);
        reject(new Error(`${serviceName} failed`));
      };
      
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  };

  const cleanupIPFS = (url: string) => {
    if (url.includes("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
  };

  const uploadArtToIpfs = async () => {
    try {
      const nftstorage = new NFTStorage({
        token: import.meta.env.VITE_NFT_STORAGE || "",
      });

      const store = await nftstorage.store({
        name: "AI NFT",
        description: "AI generated NFT",
        image: file
      });

      console.log(store);
      return cleanupIPFS(store.data.image.href);
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const mintNft = async () => {
    try {
      const imageURL = await uploadArtToIpfs();
      
      // Simulate NFT minting (NFTPort alternative)
      console.log('🎨 Starting mock NFT minting process...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock NFT data
      const mockNFTData = {
        success: true,
        transaction_hash: `0x${Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`,
        token_id: Math.floor(Math.random() * 9999) + 1000,
        mint_to_address: "0x40808d4730aeAAfb44465c507499",
        contract_address: "0x1234567890123456789012345678901234567890",
        chain: "polygon",
        explorer_url: `https://polygonscan.com/tx/0x${Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`,
        opensea_url: "https://opensea.io/assets/polygon/demo"
      };
      
      console.log('🎉 Mock NFT minted successfully:', mockNFTData);
      alert(`✅ NFT Minted Successfully! (Demo Mode)\n\nToken ID: ${mockNFTData.token_id}\nChain: Polygon (Simulated)\nTransaction: ${mockNFTData.transaction_hash.slice(0, 10)}...\n\nImage uploaded to IPFS: ${imageURL}\n\n💡 Note: This is a demo - transaction hash is simulated for demonstration purposes.`);
      
    } catch (err) {
      console.log('Minting error:', err);
      alert('❌ Minting failed. Check console for details.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-4">
      <h1 className="text-4xl font-extrabold text-white mb-8">AI Art Gasless Mint</h1>
      
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Create an input box and button saying next beside it */}
        <div className="flex items-center justify-center gap-4">
          <input
            className="border-2 border-black rounded-md p-2"
            onChange={(e) => setPrompt(e.target.value)}
            type="text"
            placeholder="Enter a prompt"
          />
          <button onClick={generateArt} className="bg-black text-white rounded-md p-2">
            Next
          </button>
        </div>
        
        {imageBlob && (
          <div className="flex flex-col gap-4 items-center justify-center">
            <img src={imageBlob} alt="AI generated art" className="max-w-md rounded-lg" />
            <button
              onClick={mintNft}
              className="bg-black text-white rounded-md p-2"
            >
              Mint NFT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorialApp;

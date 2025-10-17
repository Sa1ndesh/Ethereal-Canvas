# API Keys Setup Guide for Ethereal Canvas

## Required API Keys

### 🎨 AI Image Generation APIs

#### 1. Hugging Face (Recommended - Free tier available)
- **Get API Key**: https://huggingface.co/settings/tokens
- **Add to .env**: `HUGGING_FACE_API_KEY="your_token_here"`
- **Models**: Stable Diffusion, DALL-E alternatives
- **Free tier**: 1000 requests/month

#### 2. OpenAI DALL-E (Premium)
- **Get API Key**: https://platform.openai.com/api-keys
- **Add to .env**: `OPENAI_API_KEY="sk-your_key_here"`
- **Cost**: ~$0.02 per image (1024x1024)

#### 3. Stability AI (High Quality)
- **Get API Key**: https://platform.stability.ai/account/keys
- **Add to .env**: `STABILITY_AI_API_KEY="sk-your_key_here"`
- **Cost**: ~$0.04 per image

#### 4. Replicate (Various Models)
- **Get API Key**: https://replicate.com/account/api-tokens
- **Add to .env**: `REPLICATE_API_KEY="r8_your_key_here"`
- **Pay per use**: $0.001-0.05 per image

### 🔗 Web3 & Blockchain APIs

#### 1. Alchemy (Ethereum RPC)
- **Get API Key**: https://dashboard.alchemy.com/
- **Add to .env**: `VITE_ALCHEMY_API_KEY="your_key_here"`
- **Free tier**: 300M requests/month

#### 2. Infura (Alternative RPC)
- **Get API Key**: https://infura.io/dashboard
- **Add to .env**: `VITE_INFURA_PROJECT_ID="your_project_id"`
- **Free tier**: 100k requests/day

#### 3. WalletConnect
- **Get Project ID**: https://cloud.walletconnect.com/
- **Add to .env**: `VITE_WALLET_CONNECT_PROJECT_ID="your_project_id"`
- **Free**: Unlimited connections

### 🗄️ Database & Storage

#### 1. Firebase (User data & gallery)
- **Setup**: https://console.firebase.google.com/
- **Add to .env**: All Firebase config variables
- **Free tier**: 1GB storage, 50k reads/day

#### 2. Pinata (IPFS for NFT metadata)
- **Get API Keys**: https://app.pinata.cloud/keys
- **Add to .env**: `PINATA_API_KEY` and `PINATA_SECRET_KEY`
- **Free tier**: 1GB storage

## Setup Priority

### 🚀 Essential (Start with these)
1. **HUGGING_FACE_API_KEY** - For AI image generation
2. **VITE_ALCHEMY_API_KEY** - For Web3 functionality
3. **FIREBASE_API_KEY** - For user gallery

### 📈 Enhanced Features
4. **PINATA_API_KEY** - For NFT metadata storage
5. **VITE_WALLET_CONNECT_PROJECT_ID** - For wallet connections

### 💎 Premium Options
6. **OPENAI_API_KEY** - For DALL-E quality
7. **STABILITY_AI_API_KEY** - For highest quality images

## Current Status
- ✅ **Gemini API** - Already configured
- ✅ **Pollinations AI** - Working (free, no key needed)
- ⚠️ **Other APIs** - Need configuration for enhanced features

## Quick Start
1. Get **Hugging Face API key** for better AI generation
2. Get **Alchemy API key** for Web3 features
3. Set up **Firebase project** for user galleries
4. Add keys to `.env` file
5. Restart development server

## Security Notes
- Never commit `.env` file to version control
- Use different keys for development and production
- Rotate keys regularly
- Monitor API usage and costs

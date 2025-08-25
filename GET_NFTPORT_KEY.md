# 🔑 Get Your NFTPort API Key

## Step-by-Step Instructions

### 1. **Sign Up for NFTPort**
- Go to: https://www.nftport.xyz
- Click "Get Started" or "Sign Up"
- Enter your email and create password
- **Important**: Check your email and verify your account

### 2. **Access Dashboard**
- After email verification, log into your dashboard
- You should see your API key immediately on the dashboard

### 3. **Copy Your API Key**
- Look for "API Key" section in your dashboard
- Copy the key (it usually starts with letters/numbers)

### 4. **Add to Your .env File**
Replace this line in your `.env` file:
```
REACT_APP_NFT_PORT="your_nftport_api_key_here"
```

With your actual key:
```
REACT_APP_NFT_PORT="your_actual_nftport_key_here"
```

## 🎯 **Why NFTPort is Essential**

NFTPort provides:
- ✅ **Gasless Minting**: Users don't pay gas fees
- ✅ **Easy Integration**: Simple API calls
- ✅ **Polygon Network**: Fast and cheap transactions  
- ✅ **Free Tier**: 100 free NFT mints per chain
- ✅ **No Smart Contract**: No need to deploy contracts

## 🚀 **Free Tier Limits**
- **100 free NFT mints** per blockchain per month
- Perfect for testing and small projects
- Automatic scaling available

## ⚡ **After Getting Your Key**
1. Update the `.env` file with your NFTPort key
2. Restart your development server: `npm run dev`
3. Test the tutorial mode: `http://localhost:5173?tutorial=true`
4. Try minting an NFT - it should work gasless on Polygon!

Your project will be fully functional once you add this key! 🎉

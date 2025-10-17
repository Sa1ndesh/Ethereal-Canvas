# 🚀 Ethereal Canvas - Real Blockchain Deployment Guide

This guide will help you deploy the Ethereal Canvas NFT smart contract and enable real blockchain functionality.

## 📋 Prerequisites

### 1. Required Accounts & API Keys
- **MetaMask Wallet** with Sepolia ETH for gas fees
- **Infura Account** (free tier available)
- **Etherscan Account** for contract verification (optional)

### 2. Get Sepolia Test ETH
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Or use [Alchemy Faucet](https://sepoliafaucet.com/)
- You need ~0.01 ETH for deployment

## 🛠️ Step-by-Step Deployment

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in the required values:

```env
# 🔐 Your MetaMask private key (KEEP SECURE!)
PRIVATE_KEY="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

# 🌐 Infura RPC URL
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"

# 🔍 Etherscan API key (optional, for verification)
ETHERSCAN_API_KEY="your_etherscan_api_key_here"
```

### Step 3: Compile the Smart Contract
```bash
npm run compile
```

### Step 4: Deploy to Sepolia Testnet
```bash
npm run deploy:sepolia
```

**Expected Output:**
```
🚀 Deploying Ethereal Canvas NFT Contract...
📦 Deploying contract...
✅ Contract deployed successfully!
📍 Contract address: 0x1234567890abcdef1234567890abcdef12345678
🔗 Network: sepolia
⛽ Gas used: 2,847,392

🎯 Next Steps:
1. Update CONTRACT_ADDRESSES in src/utils/nft-contract.ts
2. Replace the address for chain ID 11155111:
   11155111: "0x1234567890abcdef1234567890abcdef12345678"
3. Test minting with real blockchain!
```

### Step 5: Update Contract Configuration
1. Open `src/utils/nft-contract.ts`
2. Replace the Sepolia contract address:

```typescript
const CONTRACT_ADDRESSES = {
  // Ethereum Sepolia Testnet
  11155111: "0x1234567890abcdef1234567890abcdef12345678", // Your deployed contract
  // ... other networks
};
```

### Step 6: Test Real Blockchain Minting
1. Start your development server: `npm run dev`
2. Connect your MetaMask to Sepolia testnet
3. Generate an AI artwork
4. Click "Wallet Mint" - you should see:
   - MetaMask popup asking for transaction approval
   - Real gas fees (usually 0.001-0.003 ETH)
   - Transaction confirmation
   - Real transaction hash linking to Sepolia Etherscan

## 🔧 Contract Features

### Minting Fee
- **Default**: 0.001 ETH (1000000000000000 wei)
- **Purpose**: Prevents spam and covers gas costs
- **Owner can update**: Yes, using `setMintingFee()`

### NFT Metadata
Each NFT includes:
- **Name**: "Ethereal Canvas #[timestamp]"
- **Description**: Includes the AI prompt
- **Image**: Direct link to the generated artwork
- **Attributes**:
  - AI Prompt used
  - Creation date
  - Platform identifier

### Contract Functions
- `mintArtwork()`: Mint new NFT with prompt
- `getTokenPrompt()`: Get the prompt for a token
- `getTokenTimestamp()`: Get creation time
- `getCurrentTokenId()`: Get next token ID
- `withdraw()`: Owner can withdraw fees

## 🔍 Verification (Optional)

To verify your contract on Etherscan:

```bash
npm run verify -- --contract contracts/EtherealCanvasNFT.sol:EtherealCanvasNFT --network sepolia 0xYOUR_CONTRACT_ADDRESS
```

## 🚨 Security Best Practices

### Environment Variables
- **Never commit** `.env` file to version control
- **Use different private keys** for testnet and mainnet
- **Rotate keys regularly** for production

### Smart Contract Security
- **Audit before mainnet**: Consider professional audit
- **Test thoroughly**: Use testnet extensively
- **Monitor transactions**: Watch for unusual activity

## 🌐 Network Configuration

### Supported Networks
- **Sepolia Testnet** (Recommended for testing)
- **Ethereum Mainnet** (Production)
- **Polygon** (Lower fees, coming soon)

### Adding New Networks
1. Add network config to `hardhat.config.js`
2. Add contract address to `CONTRACT_ADDRESSES`
3. Update deployment scripts

## 📊 Cost Analysis

### Deployment Costs (Sepolia)
- **Contract Deployment**: ~0.005-0.01 ETH
- **Contract Verification**: Free

### Minting Costs (Sepolia)
- **Minting Fee**: 0.001 ETH (to contract)
- **Gas Fee**: ~0.001-0.003 ETH (to network)
- **Total per NFT**: ~0.002-0.004 ETH

### Mainnet Costs (Estimated)
- **Deployment**: $50-100 USD
- **Per NFT Mint**: $5-20 USD (depending on gas prices)

## 🐛 Troubleshooting

### Common Issues

#### "Insufficient funds for gas"
- **Solution**: Add more Sepolia ETH to your wallet

#### "Contract not deployed"
- **Solution**: Check if deployment was successful
- **Check**: Contract address in configuration

#### "Transaction reverted"
- **Possible causes**:
  - Insufficient minting fee
  - Empty prompt or tokenURI
  - Network congestion

#### "MetaMask not connecting"
- **Solution**: 
  - Switch to Sepolia network in MetaMask
  - Refresh the page
  - Clear browser cache

### Debug Commands
```bash
# Check contract compilation
npm run compile

# Test local deployment
npm run deploy:local

# View deployment info
cat deployments/sepolia-deployment.json
```

## 🎯 Next Steps After Deployment

1. **Test Extensively**: Mint several test NFTs
2. **Update UI**: Remove demo mode indicators
3. **Add Features**: 
   - IPFS metadata storage
   - Royalty system
   - Marketplace integration
4. **Monitor**: Watch contract activity on Etherscan
5. **Scale**: Consider Layer 2 solutions for lower fees

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review Hardhat documentation
3. Check Ethereum community forums
4. Ensure all environment variables are correct

## 🎉 Success!

Once deployed, your Ethereal Canvas app will:
- ✅ Mint real NFTs on Ethereum
- ✅ Generate verifiable transaction hashes
- ✅ Create transferable digital assets
- ✅ Provide true blockchain ownership

Your AI art platform is now a fully functional Web3 application! 🚀

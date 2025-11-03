# 🎨 Deploy Real NFT Functionality - Step by Step Guide

## 🎯 Overview
This guide will help you deploy the Ethereal Canvas NFT smart contract to Ethereum Sepolia testnet and enable **real NFT minting**.

---

## 📋 Prerequisites

### 1. **MetaMask Wallet**
- Install [MetaMask](https://metamask.io/)
- Create or import a wallet
- **IMPORTANT**: Keep your seed phrase secure!

### 2. **Get Sepolia Test ETH** (Free)
You need test ETH to:
- Deploy the smart contract (~$0.50 worth)
- Mint NFTs (~0.001 ETH per mint)

**Get free Sepolia ETH from these faucets:**
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [Chainlink Sepolia Faucet](https://faucets.chain.link/sepolia)

### 3. **Get Free API Keys**
- **Alchemy**: [https://dashboard.alchemy.com/](https://dashboard.alchemy.com/)
  - Sign up → Create App → Select "Sepolia" → Copy API Key
- **Etherscan** (Optional, for verification): [https://etherscan.io/apis](https://etherscan.io/apis)

---

## 🚀 Step 1: Configure Environment Variables

Create or edit `.env` file in project root:

```bash
# 🔐 Private Key (from MetaMask)
# Go to MetaMask → Account Details → Export Private Key
PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"

# ⚗️ Alchemy RPC URL
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY"

# 🔍 Etherscan API Key (optional, for contract verification)
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

# ⚡ Frontend needs this too
VITE_ALCHEMY_API_KEY="YOUR_ALCHEMY_API_KEY"
```

**⚠️ SECURITY WARNING:**
- Never commit `.env` file to git
- Never share your private key
- Use a test wallet with minimal funds

---

## 🏗️ Step 2: Compile Smart Contract

```bash
# Compile the EtherealCanvasNFT.sol contract
npm run compile
```

**Expected Output:**
```
Compiled 1 Solidity file successfully
```

---

## 🚢 Step 3: Deploy to Sepolia Testnet

```bash
# Deploy contract to Sepolia testnet
npm run deploy:sepolia
```

**Expected Output:**
```
🚀 Deploying Ethereal Canvas NFT Contract...
📦 Deploying contract...
✅ Contract deployed successfully!
📍 Contract address: 0xYourContractAddress
🔗 Network: sepolia
⛽ Gas used: ~1500000
💾 Deployment info saved to deployments/
```

**SAVE THE CONTRACT ADDRESS!** You'll need it in the next step.

---

## 🔧 Step 4: Update Frontend Configuration

Open `src/utils/nft-contract.ts` and update line 21:

```typescript
const CONTRACT_ADDRESSES = {
  // Ethereum Sepolia Testnet
  11155111: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS", // ← Update this!
  // ... other networks
};
```

**Example:**
```typescript
11155111: "0x1234567890abcdef1234567890abcdef12345678",
```

---

## ✅ Step 5: Test Real NFT Minting

1. **Restart your dev server**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Open app in browser**
   - http://localhost:5173/

3. **Connect MetaMask**
   - Click "Connect Wallet"
   - Approve connection in MetaMask
   - **Switch to Sepolia network** in MetaMask

4. **Generate AI Art**
   - Enter prompt: "A mystical dragon in cyberpunk city, digital art"
   - Click "Generate"
   - Wait for image

5. **Mint as NFT**
   - Click "Mint as NFT" button
   - MetaMask will pop up asking for:
     - Transaction approval
     - 0.001 ETH minting fee
     - Gas fee (varies)
   - Confirm transaction

6. **View Your NFT**
   - Transaction will be confirmed in ~30 seconds
   - You'll get a link to Sepolia Etherscan
   - NFT will appear in your gallery with "View on Etherscan" link

---

## 🎉 Success! You now have REAL NFTs!

### **View Your NFT:**
- **Sepolia Etherscan**: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
- **OpenSea Testnet**: https://testnets.opensea.io/account (connect wallet)
- **MetaMask**: View under "NFTs" tab

---

## 🔍 Verify Contract on Etherscan (Optional)

```bash
npm run verify
```

This makes your contract code publicly viewable and verified on Etherscan.

---

## 💰 Cost Breakdown

### **On Sepolia Testnet (FREE):**
- Deployment: ~0.015 ETH (test ETH)
- Per NFT Mint: 0.001 ETH + gas (~0.002 ETH total)
- **Total**: All FREE test ETH from faucets!

### **On Ethereum Mainnet (REAL $$$):**
- Deployment: ~$50-100 (varies with gas)
- Per NFT Mint: 0.001 ETH (~$2) + gas (~$5-20)
- **Not recommended until tested thoroughly!**

---

## 🐛 Troubleshooting

### **Issue: "Network not supported"**
**Solution:** Switch MetaMask to Sepolia network
- MetaMask → Networks dropdown → Sepolia

### **Issue: "Insufficient funds"**
**Solution:** Get more test ETH from faucets (see Prerequisites)

### **Issue: "Transaction failed"**
**Solution:**
1. Check you have enough ETH for gas + minting fee
2. Try increasing gas limit in MetaMask
3. Check contract is deployed correctly

### **Issue: "Contract not deployed"**
**Solution:**
1. Verify deployment succeeded
2. Check you updated `CONTRACT_ADDRESSES` in `nft-contract.ts`
3. Restart dev server

---

## 🚀 Going to Production (Mainnet)

**⚠️ WARNING: This costs real money!**

1. **Deploy to mainnet:**
   ```bash
   npm run deploy:mainnet
   ```

2. **Update contract address for chain ID 1**

3. **Switch MetaMask to Ethereum Mainnet**

4. **Test thoroughly on Sepolia first!**

---

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin ERC721](https://docs.openzeppelin.com/contracts/4.x/erc721)
- [Sepolia Faucets List](https://faucetlink.to/sepolia)

---

## 🎯 Quick Commands Reference

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Deploy to local Hardhat network
npm run deploy:local

# Verify contract on Etherscan
npm run verify

# Run development server
npm run dev
```

---

**🎨 Enjoy creating and minting real NFTs on the blockchain!**

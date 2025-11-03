# 🚀 Enable REAL NFT Minting - Complete Guide

## 🎯 Current Status
Your app is configured for **demo/mock NFT minting**. This guide will enable **REAL blockchain NFTs**.

---

## ⚡ Quick Start (3 Main Steps)

### **Step 1: Get Required Accounts & Keys (10 minutes)**

#### 1a. MetaMask Wallet
- Install: https://metamask.io/
- Create new wallet or import existing
- **Export Private Key**: Settings → Security & Privacy → Export Private Key
- ⚠️ **Use a TEST wallet - not your main wallet!**

#### 1b. Get FREE Sepolia Test ETH
- Open MetaMask, copy your address
- Visit: https://sepoliafaucet.com/
- Paste address, get 0.5 ETH (takes 1-2 minutes)
- **You need this to deploy contract & mint NFTs**

#### 1c. Alchemy API Key (FREE)
1. Sign up: https://dashboard.alchemy.com/
2. Click "Create App"
3. Name: "Ethereal Canvas"
4. Network: **Ethereum Sepolia**
5. Copy the API Key

#### 1d. Etherscan API Key (FREE - Optional but recommended)
1. Sign up: https://etherscan.io/apis
2. Create new API key
3. Copy the key

---

### **Step 2: Configure Environment (2 minutes)**

#### 2a. Copy the NFT-ready template:
```bash
cp .env.nft-ready .env
```

#### 2b. Edit `.env` file and replace:
```bash
# Your MetaMask private key (from Step 1a)
PRIVATE_KEY="0xYOUR_ACTUAL_PRIVATE_KEY_HERE"

# Your Alchemy API key (from Step 1c)
VITE_ALCHEMY_API_KEY="YOUR_ACTUAL_ALCHEMY_KEY"

# Sepolia RPC with your Alchemy key
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ACTUAL_ALCHEMY_KEY"

# Your Etherscan API key (from Step 1d)
ETHERSCAN_API_KEY="YOUR_ACTUAL_ETHERSCAN_KEY"
```

**Example .env:**
```bash
PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
VITE_ALCHEMY_API_KEY="AbC123XyZ456789"
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/AbC123XyZ456789"
ETHERSCAN_API_KEY="YourEtherscanKey123"
```

---

### **Step 3: Deploy Smart Contract (5 minutes)**

#### 3a. Compile the contract:
```bash
npm run compile
```

**Expected output:**
```
Compiled 1 Solidity file successfully
```

#### 3b. Deploy to Sepolia testnet:
```bash
npm run deploy:sepolia
```

**Expected output:**
```
🚀 Deploying Ethereal Canvas NFT Contract...
✅ Contract deployed successfully!
📍 Contract address: 0x1234567890abcdef1234567890abcdef12345678
🔗 Network: sepolia
```

**⚠️ SAVE THE CONTRACT ADDRESS!** You'll need it next.

#### 3c. Update contract address in code:

Open `src/utils/nft-contract.ts` and find line 21:

**BEFORE:**
```typescript
11155111: "0x0000000000000000000000000000000000000000",
```

**AFTER:**
```typescript
11155111: "0xYOUR_DEPLOYED_CONTRACT_ADDRESS",
```

**Example:**
```typescript
11155111: "0x1234567890abcdef1234567890abcdef12345678",
```

---

## ✅ Test Real NFT Minting

### 1. Restart development server:
```bash
npm run dev
```

### 2. Open app in browser:
- http://localhost:5173/

### 3. Connect MetaMask:
- Click "Connect Wallet"
- **Important**: Switch MetaMask to **Sepolia Test Network**
- Approve connection

### 4. Generate AI Art:
- Enter prompt: "Mystical forest with glowing mushrooms, digital art"
- Click "Generate"
- Wait for image to load

### 5. Mint REAL NFT:
- Click "Mint as NFT" button
- MetaMask will pop up with transaction details:
  - **Network**: Sepolia Test Network
  - **Minting Fee**: 0.001 ETH
  - **Gas Fee**: ~0.002 ETH
  - **Total**: ~0.003 ETH
- Click "Confirm" in MetaMask
- Wait 10-30 seconds for confirmation

### 6. View Your NFT:
- Transaction confirmed! ✅
- Click "View on Etherscan" to see your NFT on blockchain
- NFT will appear in gallery with blockchain icon
- View on Sepolia Etherscan: https://sepolia.etherscan.io/

---

## 🎉 Success Indicators

### ✅ You've successfully enabled real NFTs when:

1. **MetaMask shows transaction confirmation**
2. **Etherscan link works** and shows your transaction
3. **Gallery shows NFT with blockchain icon**
4. **Token ID and contract address visible**
5. **Transaction hash is real** (not starting with 0x000...)

---

## 🔍 Verify Your NFT

### View on Etherscan:
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

### View on OpenSea Testnet:
```
https://testnets.opensea.io/assets/sepolia/YOUR_CONTRACT_ADDRESS/TOKEN_ID
```

### View in MetaMask:
- Open MetaMask
- Go to "NFTs" tab
- Click "Import NFT"
- Enter contract address and token ID

---

## 💰 Cost Breakdown

### On Sepolia Testnet (FREE):
| Action | Cost | Where to Get |
|--------|------|--------------|
| Deploy Contract | ~0.015 ETH | FREE from faucet |
| Mint NFT | 0.001 ETH + gas | FREE from faucet |
| Per NFT Mint | ~0.003 ETH total | FREE from faucet |

**Total for testing: FREE! Just use test ETH from faucets.**

### On Ethereum Mainnet (REAL $$$):
| Action | Cost (USD) | Notes |
|--------|-----------|-------|
| Deploy Contract | $50-100 | One-time cost |
| Mint NFT | $2-20 per mint | Varies with gas |

**⚠️ DO NOT deploy to mainnet until thoroughly tested on Sepolia!**

---

## 🐛 Troubleshooting

### Issue: "Network not supported"
**Solution**: Switch MetaMask to Sepolia network
- MetaMask → Networks → Sepolia Test Network

### Issue: "Insufficient funds"
**Solutions**:
- Get more test ETH from faucet
- Wait 24 hours if faucet limit reached
- Try alternative faucets:
  - https://www.infura.io/faucet/sepolia
  - https://faucets.chain.link/sepolia

### Issue: "Contract not deployed"
**Solutions**:
- Verify deployment succeeded
- Check you updated line 21 in `nft-contract.ts`
- Restart dev server

### Issue: "Transaction failed"
**Solutions**:
- Check you have enough ETH for gas
- Increase gas limit in MetaMask
- Check Sepolia network is not congested
- Try again in a few minutes

### Issue: "Private key error"
**Solutions**:
- Verify private key starts with "0x"
- Ensure no spaces in private key
- Check you exported from correct MetaMask account

---

## 📋 Configuration Checklist

Before deploying, verify:

- ✅ `.env` file exists (copied from `.env.nft-ready`)
- ✅ `PRIVATE_KEY` is set (with 0x prefix)
- ✅ `VITE_ALCHEMY_API_KEY` is set
- ✅ `SEPOLIA_RPC_URL` is set with your Alchemy key
- ✅ `ETHERSCAN_API_KEY` is set
- ✅ MetaMask has Sepolia test ETH (at least 0.1 ETH)
- ✅ MetaMask is connected to Sepolia network

---

## 🔒 Security Best Practices

### ✅ DO:
- Use a separate test wallet for development
- Keep minimal funds in test wallet
- Store `.env` file securely
- Rotate API keys periodically
- Test thoroughly on Sepolia before mainnet

### ❌ DON'T:
- Never commit `.env` to git (it's gitignored)
- Never share your private key
- Never use your main wallet for testing
- Never deploy to mainnet without testing
- Never hardcode private keys in code

---

## 🎯 File Checklist

Make sure these files are configured:

| File | Status | Action Required |
|------|--------|-----------------|
| `.env` | ⚠️ You create | Copy from `.env.nft-ready` |
| `.env.nft-ready` | ✅ Created | Template with instructions |
| `src/utils/nft-contract.ts` | ⚠️ Update | Add deployed contract address |
| `contracts/EtherealCanvasNFT.sol` | ✅ Ready | Smart contract code |
| `hardhat.config.js` | ✅ Ready | Deployment configuration |

---

## 🚀 Quick Command Reference

```bash
# Compile smart contract
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify contract on Etherscan
npm run verify

# Run development server
npm run dev

# Check your deployment
ls -la deployments/
```

---

## 📚 Additional Resources

- **Sepolia Faucets**: https://faucetlink.to/sepolia
- **Alchemy Dashboard**: https://dashboard.alchemy.com/
- **Sepolia Etherscan**: https://sepolia.etherscan.io/
- **OpenSea Testnet**: https://testnets.opensea.io/
- **MetaMask Support**: https://support.metamask.io/

---

## 🎊 Next Steps After Success

Once real NFT minting works:

1. **Test extensively** on Sepolia
2. **Share your NFTs** with friends (Sepolia testnet)
3. **Try different art styles** and prompts
4. **Optimize gas fees** in contract
5. **Add IPFS metadata** (optional)
6. **Consider mainnet deployment** (when ready)

---

## 💡 Pro Tips

### Gas Optimization:
- Mint during off-peak hours (weekends)
- Batch operations when possible
- Use standard gas price, not "fast"

### Testing Strategy:
1. Test with 1-2 NFTs first
2. Verify on Etherscan before minting more
3. Check OpenSea display
4. Test transfer functionality
5. Mint 10+ to test at scale

### Production Checklist:
- Test all features on Sepolia
- Review smart contract security
- Set up proper IPFS storage
- Configure royalties (if needed)
- Plan for gas fees on mainnet
- Have monitoring/alerts ready

---

**🎨 You're ready to mint REAL NFTs on the blockchain! Follow the steps above and let me know if you need help.**

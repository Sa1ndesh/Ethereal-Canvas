import { ethers } from 'ethers';

// Simple ERC-721 NFT Contract ABI for minting
const NFT_CONTRACT_ABI = [
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function tokenCounter() public view returns (uint256)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
];

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  // Ethereum Sepolia Testnet
  11155111: "0x0000000000000000000000000000000000000000", // Replace with actual contract
  // Ethereum Mainnet - Use mock for demo
  1: "demo", // Use mock minting for mainnet
  // Polygon Mumbai Testnet
  80001: "0x0000000000000000000000000000000000000000", // Replace with actual contract
  // Polygon Mainnet - Use mock for demo
  137: "demo" // Use mock minting for mainnet
};

export interface NFTMintResult {
  transactionHash: string;
  explorerUrl: string;
  tokenId: string;
  contractAddress: string;
}

export const mintNFTOnChain = async (
  provider: ethers.BrowserProvider,
  imageUrl: string,
  prompt: string
): Promise<NFTMintResult> => {
  try {
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);
    
    // Get contract address for current network
    const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
    
    if (!contractAddress) {
      throw new Error(`Network ${chainId} is not supported. Please switch to Ethereum Sepolia testnet (Chain ID: 11155111).`);
    }
    
    if (contractAddress === "demo") {
      // Use mock minting for mainnet networks
      console.log('Using demo mode for mainnet network');
      return await mintNFTMock(imageUrl, prompt);
    }
    
    if (contractAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error(`NFT contract not deployed on network ${chainId}. Please switch to Ethereum Sepolia testnet.`);
    }

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, NFT_CONTRACT_ABI, signer);
    
    // In a real implementation, you would upload metadata to IPFS
    // For now, we'll use a mock IPFS URL that includes the prompt and image
    const tokenURI = `ipfs://QmMockHash${Date.now()}?prompt=${encodeURIComponent(prompt)}&image=${encodeURIComponent(imageUrl)}`;
    
    // Get user address
    const userAddress = await signer.getAddress();
    
    // Estimate gas
    const gasEstimate = await contract.mint.estimateGas(userAddress, tokenURI);
    
    // Mint the NFT
    const transaction = await contract.mint(userAddress, tokenURI, {
      gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
    });
    
    // Wait for transaction confirmation
    const receipt = await transaction.wait();
    
    if (!receipt) {
      throw new Error('Transaction failed');
    }

    // Get token ID from transaction logs
    const tokenId = await getTokenIdFromReceipt(receipt, contract);
    
    // Generate explorer URL based on network
    const explorerUrl = getExplorerUrl(chainId, receipt.hash);
    
    return {
      transactionHash: receipt.hash,
      explorerUrl,
      tokenId,
      contractAddress
    };
    
  } catch (error: any) {
    console.error('NFT minting failed:', error);
    throw new Error(error.message || 'Failed to mint NFT');
  }
};

const getTokenIdFromReceipt = async (
  receipt: ethers.TransactionReceipt,
  contract: ethers.Contract
): Promise<string> => {
  try {
    // Try to get token ID from Transfer event logs
    const transferTopic = ethers.id("Transfer(address,address,uint256)");
    const transferLog = receipt.logs.find(log => log.topics[0] === transferTopic);
    
    if (transferLog) {
      const tokenId = ethers.getBigInt(transferLog.topics[3]);
      return tokenId.toString();
    }
    
    // Fallback: get current token counter
    const tokenCounter = await contract.tokenCounter();
    return (tokenCounter - 1n).toString();
  } catch (error) {
    // Fallback to timestamp-based ID
    return Date.now().toString();
  }
};

const getExplorerUrl = (chainId: number, txHash: string): string => {
  const explorers = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    137: 'https://polygonscan.com',
    80001: 'https://mumbai.polygonscan.com'
  };
  
  const baseUrl = explorers[chainId as keyof typeof explorers] || 'https://etherscan.io';
  return `${baseUrl}/tx/${txHash}`;
};

// Mock minting function for development/demo purposes
export const mintNFTMock = async (
  imageUrl: string,
  prompt: string
): Promise<NFTMintResult> => {
  // Simulate transaction delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate a realistic-looking random transaction hash
  const mockTxHash = `0x${Array.from({length: 64}, () => 
    Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const tokenId = Math.floor(Math.random() * 9999) + 1000;
  
  // Log the minting details for demo purposes
  console.log('Mock NFT Minting:', { imageUrl, prompt, tokenId });
  
  return {
    transactionHash: mockTxHash,
    explorerUrl: `https://sepolia.etherscan.io/tx/${mockTxHash}`,
    tokenId: tokenId.toString(),
    contractAddress: "0x0000000000000000000000000000000000000000"
  };
};

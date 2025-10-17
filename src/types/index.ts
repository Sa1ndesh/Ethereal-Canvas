export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
  isNFT: boolean;
  nftTransactionHash?: string;
  nftExplorerUrl?: string;
  tokenId?: string;
  contractAddress?: string;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string;
  advanceMode: boolean;
}

export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface AIServiceConfig {
  name: string;
  apiKey: string;
  endpoint?: string;
  maxRetries: number;
}

export interface AIImageResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  service?: string;
}

export type AIService = 'openai' | 'stability' | 'replicate' | 'huggingface' | 'mock';

export interface GenerationOptions {
  width?: number;
  height?: number;
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  steps?: number;
}

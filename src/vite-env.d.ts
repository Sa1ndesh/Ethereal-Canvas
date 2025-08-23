/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_HUGGING_FACE_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_STABILITY_API_KEY: string
  readonly VITE_REPLICATE_API_KEY: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_ALCHEMY_API_KEY: string
  readonly VITE_INFURA_PROJECT_ID: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_APP_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

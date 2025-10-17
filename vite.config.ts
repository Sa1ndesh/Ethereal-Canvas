import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: true, // Enable network access
    port: 5173,
    strictPort: false, // Allow fallback ports
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['*']
    },
    proxy: {
      // Proxy API calls to avoid CORS issues
      '/api/image': {
        target: 'https://image.pollinations.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/image/, '/prompt'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'ethers',
      'axios'
    ],
    exclude: ['lucide-react'],
    force: false // Don't force re-optimization unless needed
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          web3: ['ethers'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  
  // Enable faster rebuilds
  esbuild: {
    target: 'esnext'
  },
  
  // Cache configuration
  cacheDir: 'node_modules/.vite'
});

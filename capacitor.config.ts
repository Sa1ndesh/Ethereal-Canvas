import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ethereal.canvas',
  appName: 'Ethereal Canvas',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'huggingface.co',
      'openai.com',
      'replicate.com',
      'pinata.cloud',
      'alchemy.com',
      'infura.io',
      'metamask.io',
      'walletconnect.com'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#0f0f23',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#8b5cf6'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f0f23'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;

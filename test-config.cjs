// Test configuration to verify .env setup
require('dotenv').config();

console.log('\n🔍 Testing Environment Configuration...\n');

// Check required variables
const checks = {
  'PRIVATE_KEY': {
    value: process.env.PRIVATE_KEY,
    valid: process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.startsWith('0x') && process.env.PRIVATE_KEY.length === 66,
    hint: 'Should start with 0x and be 66 characters long'
  },
  'SEPOLIA_RPC_URL': {
    value: process.env.SEPOLIA_RPC_URL,
    valid: process.env.SEPOLIA_RPC_URL && process.env.SEPOLIA_RPC_URL.includes('alchemy.com'),
    hint: 'Should be: https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY'
  },
  'VITE_ALCHEMY_API_KEY': {
    value: process.env.VITE_ALCHEMY_API_KEY,
    valid: process.env.VITE_ALCHEMY_API_KEY && process.env.VITE_ALCHEMY_API_KEY.length > 10,
    hint: 'Should be your Alchemy API key (32 characters)'
  }
};

let allValid = true;

Object.entries(checks).forEach(([key, check]) => {
  const status = check.valid ? '✅' : '❌';
  const maskedValue = check.value ? 
    (key === 'PRIVATE_KEY' ? `${check.value.substring(0, 6)}...${check.value.substring(check.value.length - 4)}` : 
     key === 'SEPOLIA_RPC_URL' ? check.value : 
     `${check.value.substring(0, 8)}...`) : 
    'NOT SET';
  
  console.log(`${status} ${key}`);
  console.log(`   Value: ${maskedValue}`);
  
  if (!check.valid) {
    console.log(`   ⚠️  ${check.hint}`);
    allValid = false;
  }
  console.log('');
});

if (allValid) {
  console.log('✅ All configuration looks good!');
  console.log('\nNext step: npm run deploy:sepolia\n');
} else {
  console.log('❌ Please fix the issues above in your .env file\n');
  console.log('📝 Example .env format:');
  console.log('PRIVATE_KEY="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"');
  console.log('VITE_ALCHEMY_API_KEY="YOUR_ALCHEMY_API_KEY"');
  console.log('SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY"\n');
}

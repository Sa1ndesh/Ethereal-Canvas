const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Ethereal Canvas NFT Contract...");

  // Get the contract factory
  const EtherealCanvasNFT = await ethers.getContractFactory("EtherealCanvasNFT");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const etherealCanvas = await EtherealCanvasNFT.deploy();

  // Wait for deployment to be mined
  await etherealCanvas.deployed();

  console.log("✅ Contract deployed successfully!");
  console.log("📍 Contract address:", etherealCanvas.address);
  console.log("🔗 Network:", (await ethers.provider.getNetwork()).name);
  console.log("⛽ Gas used:", (await etherealCanvas.deployTransaction.wait()).gasUsed.toString());

  // Verify contract on Etherscan (if not local network)
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 31337) { // Not Hardhat local network
    console.log("⏳ Waiting for block confirmations...");
    await etherealCanvas.deployTransaction.wait(6); // Wait for 6 confirmations
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: etherealCanvas.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan!");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: etherealCanvas.address,
    network: network.name,
    chainId: network.chainId,
    deploymentBlock: etherealCanvas.deployTransaction.blockNumber,
    deploymentHash: etherealCanvas.deployTransaction.hash,
    timestamp: new Date().toISOString(),
  };

  const fs = require("fs");
  const path = require("path");
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info
  fs.writeFileSync(
    path.join(deploymentsDir, `${network.name}-deployment.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("💾 Deployment info saved to deployments/");
  
  // Display next steps
  console.log("\n🎯 Next Steps:");
  console.log("1. Update CONTRACT_ADDRESSES in src/utils/nft-contract.ts");
  console.log(`2. Replace the address for chain ID ${network.chainId}:`);
  console.log(`   ${network.chainId}: "${etherealCanvas.address}"`);
  console.log("3. Test minting with real blockchain!");
  
  return etherealCanvas.address;
}

main()
  .then((address) => {
    console.log(`\n🎉 Deployment completed! Contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

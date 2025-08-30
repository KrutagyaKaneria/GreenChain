const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Starting GreenChain contract deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy GreenHydrogenCredit contract
  console.log("\n🏭 Deploying GreenHydrogenCredit contract...");
  const GreenHydrogenCredit = await ethers.getContractFactory("GreenHydrogenCredit");
  const creditContract = await GreenHydrogenCredit.deploy(
    "Green Hydrogen Credit",
    "GH2C"
  );
  await creditContract.deployed();
  console.log("✅ GreenHydrogenCredit deployed to:", creditContract.address);

  // Deploy CreditMarketplace contract
  console.log("\n🏪 Deploying CreditMarketplace contract...");
  const CreditMarketplace = await ethers.getContractFactory("CreditMarketplace");
  const marketplaceContract = await CreditMarketplace.deploy(creditContract.address);
  await marketplaceContract.deployed();
  console.log("✅ CreditMarketplace deployed to:", marketplaceContract.address);

  // Grant marketplace role to marketplace contract
  console.log("\n🔐 Setting up marketplace permissions...");
  const MARKETPLACE_ROLE = await creditContract.MARKETPLACE_ROLE();
  await creditContract.grantRole(MARKETPLACE_ROLE, marketplaceContract.address);
  console.log("✅ Marketplace role granted to marketplace contract");

  // Grant roles to deployer for testing
  console.log("\n👤 Setting up deployer roles...");
  const PRODUCER_ROLE = await creditContract.PRODUCER_ROLE();
  const VERIFIER_ROLE = await creditContract.VERIFIER_ROLE();
  const REGULATOR_ROLE = await creditContract.REGULATOR_ROLE();

  await creditContract.grantRole(PRODUCER_ROLE, deployer.address);
  await creditContract.grantRole(VERIFIER_ROLE, deployer.address);
  await creditContract.grantRole(REGULATOR_ROLE, deployer.address);
  console.log("✅ Deployer granted all roles");

  // Print deployment summary
  console.log("\n🎉 Deployment completed successfully!");
  console.log("=" .repeat(50));
  console.log("📋 Contract Addresses:");
  console.log("GreenHydrogenCredit:", creditContract.address);
  console.log("CreditMarketplace:", marketplaceContract.address);
  console.log("=" .repeat(50));
  console.log("🔑 Deployer Address:", deployer.address);
  console.log("=" .repeat(50));

  // Save deployment info to file
  const deploymentInfo = {
    network: network.name,
    deployer: deployer.address,
    contracts: {
      GreenHydrogenCredit: creditContract.address,
      CreditMarketplace: marketplaceContract.address
    },
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(
    `deployment-${network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment-" + network.name + ".json");

  return {
    creditContract: creditContract.address,
    marketplaceContract: marketplaceContract.address
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

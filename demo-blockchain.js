/**
 * 🎯 GreenChain Blockchain Integration Demo
 * This script demonstrates how the blockchain integration works
 */

console.log('🚀 GreenChain Blockchain Integration Demo');
console.log('=' .repeat(60));

// Simulate the blockchain service
class DemoBlockchainService {
  constructor() {
    this.credits = [];
    this.transactions = [];
    this.isInitialized = false;
  }

  async initialize() {
    console.log('🔗 Initializing blockchain service...');
    this.isInitialized = true;
    console.log('✅ Connected to Polygon Mumbai Testnet (Chain ID: 80001)');
    return true;
  }

  async issueCredit(producerAddress, hydrogenAmount, carbonIntensity, ipfsHash) {
    console.log('\n🏭 ISSUING HYDROGEN CREDIT');
    console.log('-'.repeat(40));
    console.log(`Producer: ${producerAddress}`);
    console.log(`Hydrogen Amount: ${hydrogenAmount} kg`);
    console.log(`Carbon Intensity: ${carbonIntensity} CO2/kg H2`);
    console.log(`IPFS Hash: ${ipfsHash}`);
    
    const tokenId = this.credits.length + 1;
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    this.credits.push({
      tokenId,
      producerAddress,
      hydrogenAmount,
      carbonIntensity,
      ipfsHash,
      verified: false,
      timestamp: new Date()
    });

    this.transactions.push({
      type: 'CreditIssued',
      tokenId,
      producerAddress,
      transactionHash: txHash,
      timestamp: new Date()
    });

    console.log(`✅ Credit issued successfully!`);
    console.log(`📋 Token ID: ${tokenId}`);
    console.log(`🔗 Transaction Hash: ${txHash}`);
    console.log(`⏱️  Timestamp: ${new Date().toLocaleString()}`);
    
    return {
      success: true,
      tokenId: tokenId.toString(),
      transactionHash: txHash,
      gasUsed: '150000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async verifyCredit(tokenId, verificationNotes) {
    console.log('\n✅ VERIFYING CREDIT');
    console.log('-'.repeat(40));
    console.log(`Token ID: ${tokenId}`);
    console.log(`Verification Notes: ${verificationNotes}`);
    
    const credit = this.credits.find(c => c.tokenId === parseInt(tokenId));
    if (credit) {
      credit.verified = true;
      credit.verificationNotes = verificationNotes;
      credit.verifiedAt = new Date();
    }

    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    this.transactions.push({
      type: 'CreditVerified',
      tokenId,
      verifier: '0xVerifierAddress',
      transactionHash: txHash,
      timestamp: new Date()
    });

    console.log(`✅ Credit verified successfully!`);
    console.log(`🔗 Transaction Hash: ${txHash}`);
    console.log(`⏱️  Timestamp: ${new Date().toLocaleString()}`);
    
    return {
      success: true,
      transactionHash: txHash,
      gasUsed: '80000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async createListing(tokenId, price, expiryDays) {
    console.log('\n📝 CREATING MARKETPLACE LISTING');
    console.log('-'.repeat(40));
    console.log(`Token ID: ${tokenId}`);
    console.log(`Price: ${price} wei (${parseFloat(price) / 1e18} ETH)`);
    console.log(`Expiry: ${expiryDays} days`);
    
    const listingId = this.transactions.filter(tx => tx.type === 'ListingCreated').length + 1;
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    this.transactions.push({
      type: 'ListingCreated',
      listingId,
      tokenId: parseInt(tokenId),
      transactionHash: txHash,
      timestamp: new Date()
    });

    console.log(`✅ Listing created successfully!`);
    console.log(`📋 Listing ID: ${listingId}`);
    console.log(`🔗 Transaction Hash: ${txHash}`);
    console.log(`⏱️  Timestamp: ${new Date().toLocaleString()}`);
    
    return {
      success: true,
      listingId: listingId.toString(),
      transactionHash: txHash,
      gasUsed: '120000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async getTotalCredits() {
    return { success: true, total: this.credits.length.toString() };
  }

  async getVerifiedCredits() {
    const verified = this.credits.filter(c => c.verified);
    return { success: true, credits: verified.map(c => c.tokenId.toString()) };
  }

  async getTransactionHistory() {
    return { success: true, transactions: this.transactions };
  }

  async getBalance() {
    return { 
      success: true, 
      balance: '10000000000000000000', // 10 ETH in wei
      balanceEth: '10.0'
    };
  }
}

// Demo function
async function runBlockchainDemo() {
  const blockchainService = new DemoBlockchainService();
  
  try {
    // Initialize
    await blockchainService.initialize();
    
    // Demo 1: Issue a credit
    console.log('\n' + '='.repeat(60));
    console.log('🧪 DEMO 1: Issue Hydrogen Credit');
    console.log('='.repeat(60));
    
    const issueResult = await blockchainService.issueCredit(
      '0xProducerAddress123',
      1500.5,
      2.1,
      'QmXyZ123...'
    );
    
    // Demo 2: Verify the credit
    console.log('\n' + '='.repeat(60));
    console.log('🧪 DEMO 2: Verify Credit');
    console.log('='.repeat(60));
    
    const verifyResult = await blockchainService.verifyCredit(
      issueResult.tokenId,
      'Credit verified after IoT data validation and compliance checks'
    );
    
    // Demo 3: Create marketplace listing
    console.log('\n' + '='.repeat(60));
    console.log('🧪 DEMO 3: Create Marketplace Listing');
    console.log('='.repeat(60));
    
    const listingResult = await blockchainService.createListing(
      issueResult.tokenId,
      '2500000000000000000', // 2.5 ETH
      30
    );
    
    // Demo 4: Show blockchain status
    console.log('\n' + '='.repeat(60));
    console.log('🧪 DEMO 4: Blockchain Status');
    console.log('='.repeat(60));
    
    const totalCredits = await blockchainService.getTotalCredits();
    const verifiedCredits = await blockchainService.getVerifiedCredits();
    const transactionHistory = await blockchainService.getTransactionHistory();
    const balance = await blockchainService.getBalance();
    
    console.log('📊 BLOCKCHAIN STATUS:');
    console.log(`   Network: Polygon Mumbai Testnet`);
    console.log(`   Chain ID: 80001`);
    console.log(`   Total Credits: ${totalCredits.total}`);
    console.log(`   Verified Credits: ${verifiedCredits.credits.length}`);
    console.log(`   Wallet Balance: ${balance.balanceEth} ETH`);
    console.log(`   Total Transactions: ${transactionHistory.transactions.length}`);
    
    // Demo 5: Show transaction history
    console.log('\n📋 TRANSACTION HISTORY:');
    console.log('-'.repeat(40));
    transactionHistory.transactions.forEach((tx, index) => {
      console.log(`${index + 1}. ${tx.type}`);
      console.log(`   Token ID: ${tx.tokenId}`);
      console.log(`   TX Hash: ${tx.transactionHash}`);
      console.log(`   Time: ${tx.timestamp.toLocaleString()}`);
      console.log('');
    });
    
    // Summary
    console.log('='.repeat(60));
    console.log('🎉 BLOCKCHAIN DEMO COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('✅ All operations completed');
    console.log('✅ Data is immutable and verifiable');
    console.log('✅ Transactions are transparent');
    console.log('✅ Smart contracts enforce rules');
    console.log('✅ Real-time updates available');
    console.log('='.repeat(60));
    
    console.log('\n🌐 HOW TO SEE THIS IN YOUR DASHBOARD:');
    console.log('1. Start your backend: node server.js');
    console.log('2. Start your frontend: cd client && npm run dev');
    console.log('3. Login as Admin user');
    console.log('4. Look for "🔗 Blockchain Integration" section');
    console.log('5. Click the test buttons to see live blockchain operations!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Run the demo
runBlockchainDemo();

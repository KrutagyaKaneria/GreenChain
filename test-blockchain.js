/**
 * Test script for GreenChain Blockchain Integration
 * This demonstrates how the blockchain service would work
 */

console.log('🚀 GreenChain Blockchain Integration Test');
console.log('=' .repeat(50));

// Mock blockchain service for demonstration
class MockBlockchainService {
  constructor() {
    this.isInitialized = false;
    this.credits = [];
    this.listings = [];
    this.transactions = [];
  }

  async initialize() {
    console.log('🔗 Initializing blockchain service...');
    this.isInitialized = true;
    console.log('✅ Blockchain service initialized successfully');
    console.log('🌐 Connected to network: Polygon Mumbai (Chain ID: 80001)');
  }

  async issueCredit(producerAddress, hydrogenAmount, carbonIntensity, ipfsHash) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    console.log('🏭 Issuing hydrogen credit...');
    
    // Simulate blockchain transaction
    const tokenId = this.credits.length + 1;
    const credit = {
      tokenId,
      producerAddress,
      hydrogenAmount,
      carbonIntensity,
      ipfsHash,
      verified: false,
      retired: false,
      timestamp: new Date().toISOString(),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    this.credits.push(credit);
    this.transactions.push({
      type: 'CreditIssued',
      tokenId,
      producerAddress,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Credit issued successfully');
    console.log('📋 Transaction hash:', credit.transactionHash);
    console.log('🔢 Token ID:', tokenId);

    return {
      success: true,
      tokenId: tokenId.toString(),
      transactionHash: credit.transactionHash,
      gasUsed: '150000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async verifyCredit(tokenId, verificationNotes) {
    console.log('✅ Verifying credit...');
    
    const credit = this.credits.find(c => c.tokenId === parseInt(tokenId));
    if (!credit) {
      return { success: false, error: 'Credit not found' };
    }

    credit.verified = true;
    credit.verificationNotes = verificationNotes;
    credit.verifiedAt = new Date().toISOString();

    this.transactions.push({
      type: 'CreditVerified',
      tokenId,
      verifier: '0xVerifierAddress',
      timestamp: new Date().toISOString()
    });

    console.log('✅ Credit verified successfully');
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: '80000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async createListing(tokenId, price, expiryDays) {
    console.log('📝 Creating marketplace listing...');
    
    const listingId = this.listings.length + 1;
    const listing = {
      listingId,
      tokenId: parseInt(tokenId),
      price,
      expiryDays,
      active: true,
      timestamp: new Date().toISOString()
    };

    this.listings.push(listing);
    this.transactions.push({
      type: 'ListingCreated',
      listingId,
      tokenId: parseInt(tokenId),
      timestamp: new Date().toISOString()
    });

    console.log('✅ Listing created successfully');
    return {
      success: true,
      listingId: listingId.toString(),
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: '120000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async purchaseCredit(listingId, price) {
    console.log('🛒 Purchasing credit...');
    
    const listing = this.listings.find(l => l.listingId === parseInt(listingId));
    if (!listing) {
      return { success: false, error: 'Listing not found' };
    }

    listing.active = false;
    this.transactions.push({
      type: 'CreditPurchased',
      listingId: parseInt(listingId),
      tokenId: listing.tokenId,
      buyer: '0xBuyerAddress',
      seller: '0xSellerAddress',
      price,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Credit purchased successfully');
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: '200000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async getTotalCredits() {
    return {
      success: true,
      total: this.credits.length.toString()
    };
  }

  async getVerifiedCredits() {
    const verified = this.credits.filter(c => c.verified && !c.retired);
    return {
      success: true,
      credits: verified.map(c => c.tokenId.toString())
    };
  }

  async getActiveListings() {
    const active = this.listings.filter(l => l.active);
    return {
      success: true,
      listings: active.map(l => l.listingId.toString())
    };
  }

  async getTransactionHistory() {
    return {
      success: true,
      transactions: this.transactions
    };
  }
}

// Test the blockchain integration
async function testBlockchainIntegration() {
  const blockchainService = new MockBlockchainService();

  try {
    // Initialize blockchain service
    await blockchainService.initialize();
    console.log('');

    // Test 1: Issue a credit
    console.log('🧪 Test 1: Issue Hydrogen Credit');
    console.log('-'.repeat(30));
    const issueResult = await blockchainService.issueCredit(
      '0xProducerAddress123',
      1500.5, // kg of hydrogen
      2.1,    // CO2/kg H2
      'QmXyZ123...' // IPFS hash
    );
    console.log('Result:', issueResult);
    console.log('');

    // Test 2: Verify the credit
    console.log('🧪 Test 2: Verify Credit');
    console.log('-'.repeat(30));
    const verifyResult = await blockchainService.verifyCredit(
      issueResult.tokenId,
      'Credit verified after IoT data validation'
    );
    console.log('Result:', verifyResult);
    console.log('');

    // Test 3: Create marketplace listing
    console.log('🧪 Test 3: Create Marketplace Listing');
    console.log('-'.repeat(30));
    const listingResult = await blockchainService.createListing(
      issueResult.tokenId,
      ethers.utils.parseEther('2.5'), // 2.5 ETH
      30 // 30 days expiry
    );
    console.log('Result:', listingResult);
    console.log('');

    // Test 4: Purchase credit
    console.log('🧪 Test 4: Purchase Credit');
    console.log('-'.repeat(30));
    const purchaseResult = await blockchainService.purchaseCredit(
      listingResult.listingId,
      ethers.utils.parseEther('2.5')
    );
    console.log('Result:', purchaseResult);
    console.log('');

    // Test 5: Get blockchain data
    console.log('🧪 Test 5: Get Blockchain Data');
    console.log('-'.repeat(30));
    
    const totalCredits = await blockchainService.getTotalCredits();
    console.log('Total Credits:', totalCredits.total);
    
    const verifiedCredits = await blockchainService.getVerifiedCredits();
    console.log('Verified Credits:', verifiedCredits.credits);
    
    const activeListings = await blockchainService.getActiveListings();
    console.log('Active Listings:', activeListings.listings);
    
    const transactionHistory = await blockchainService.getTransactionHistory();
    console.log('Transaction History:', transactionHistory.transactions.length, 'transactions');
    console.log('');

    // Summary
    console.log('🎉 Blockchain Integration Test Completed Successfully!');
    console.log('=' .repeat(50));
    console.log('📊 Summary:');
    console.log(`- Credits Issued: ${totalCredits.total}`);
    console.log(`- Credits Verified: ${verifiedCredits.credits.length}`);
    console.log(`- Active Listings: ${activeListings.listings.length}`);
    console.log(`- Total Transactions: ${transactionHistory.transactions.length}`);
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Mock ethers for demonstration
const ethers = {
  utils: {
    parseEther: (value) => Math.floor(parseFloat(value) * 1e18).toString()
  }
};

// Run the test
testBlockchainIntegration();

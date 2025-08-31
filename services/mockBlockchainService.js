/**
 * Mock Blockchain Service for GreenChain Platform
 * Simulates blockchain operations for development and testing
 */

class MockBlockchainService {
  constructor() {
    this.credits = [];
    this.transactions = [];
    this.isInitialized = false;
  }

  async initialize() {
    console.log('🔗 Initializing mock blockchain service...');
    this.isInitialized = true;
    console.log('✅ Mock blockchain service initialized successfully');
    console.log('🌐 Connected to network: Polygon Mumbai Testnet (Chain ID: 80001)');
    return true;
  }

  async issueCredit(producerAddress, hydrogenAmount, carbonIntensity, ipfsHash) {
    console.log('🏭 Mock: Issuing hydrogen credit...');
    
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

    console.log('✅ Mock: Credit issued successfully');
    console.log('📋 Token ID:', tokenId);
    console.log('🔗 Transaction Hash:', txHash);
    
    return {
      success: true,
      tokenId: tokenId.toString(),
      transactionHash: txHash,
      gasUsed: '150000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async verifyCredit(tokenId, verificationNotes) {
    console.log('✅ Mock: Verifying credit...');
    
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

    console.log('✅ Mock: Credit verified successfully');
    console.log('🔗 Transaction Hash:', txHash);
    
    return {
      success: true,
      transactionHash: txHash,
      gasUsed: '80000',
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000
    };
  }

  async createListing(tokenId, price, expiryDays) {
    console.log('📝 Mock: Creating marketplace listing...');
    
    const listingId = this.transactions.filter(tx => tx.type === 'ListingCreated').length + 1;
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    this.transactions.push({
      type: 'ListingCreated',
      listingId,
      tokenId: parseInt(tokenId),
      transactionHash: txHash,
      timestamp: new Date()
    });

    console.log('✅ Mock: Listing created successfully');
    console.log('📋 Listing ID:', listingId);
    console.log('🔗 Transaction Hash:', txHash);
    
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

  async getActiveListings() {
    const listings = this.transactions.filter(tx => tx.type === 'ListingCreated');
    return { success: true, listings: listings };
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

module.exports = MockBlockchainService;

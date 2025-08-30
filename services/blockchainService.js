const { ethers } = require('ethers');

/**
 * Blockchain Service for GreenChain Platform
 * Handles smart contract interactions and blockchain operations
 */
class BlockchainService {
  constructor() {
    this.provider = null;
    this.creditContract = null;
    this.marketplaceContract = null;
    this.wallet = null;
    this.isInitialized = false;
  }

  /**
   * Initialize blockchain service
   * @param {string} rpcUrl - RPC URL for the blockchain network
   * @param {string} privateKey - Private key for transactions
   * @param {string} creditContractAddress - GreenHydrogenCredit contract address
   * @param {string} marketplaceContractAddress - CreditMarketplace contract address
   */
  async initialize(rpcUrl, privateKey, creditContractAddress, marketplaceContractAddress) {
    try {
      console.log('🔗 Initializing blockchain service...');
      
      // Initialize provider
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      
      // Initialize wallet
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      
      // Initialize contracts
      this.creditContract = new ethers.Contract(
        creditContractAddress,
        this.getCreditContractABI(),
        this.wallet
      );
      
      this.marketplaceContract = new ethers.Contract(
        marketplaceContractAddress,
        this.getMarketplaceContractABI(),
        this.wallet
      );
      
      this.isInitialized = true;
      console.log('✅ Blockchain service initialized successfully');
      
      // Test connection
      const network = await this.provider.getNetwork();
      console.log(`🌐 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  /**
   * Issue a new hydrogen credit
   * @param {string} producerAddress - Producer's wallet address
   * @param {number} hydrogenAmount - Amount of hydrogen produced (kg)
   * @param {number} carbonIntensity - Carbon intensity (CO2/kg H2)
   * @param {string} ipfsHash - IPFS hash of IoT data
   * @returns {Promise<Object>} Transaction result
   */
  async issueCredit(producerAddress, hydrogenAmount, carbonIntensity, ipfsHash) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      console.log('🏭 Issuing hydrogen credit...');
      
      // Scale values for blockchain storage
      const scaledHydrogenAmount = Math.floor(hydrogenAmount * 1000000); // Scale by 10^6
      const scaledCarbonIntensity = Math.floor(carbonIntensity * 1000); // Scale by 10^3
      
      const tx = await this.creditContract.issueCredit(
        producerAddress,
        scaledHydrogenAmount,
        scaledCarbonIntensity,
        ipfsHash
      );
      
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      console.log('✅ Credit issued successfully');
      console.log('📋 Transaction hash:', receipt.transactionHash);
      console.log('🔢 Gas used:', receipt.gasUsed.toString());
      
      // Parse events to get token ID
      const event = receipt.events?.find(e => e.event === 'CreditIssued');
      const tokenId = event?.args?.tokenId;
      
      return {
        success: true,
        tokenId: tokenId?.toString(),
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
      
    } catch (error) {
      console.error('❌ Failed to issue credit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify a credit
   * @param {string} tokenId - Token ID to verify
   * @param {string} verificationNotes - Notes from verifier
   * @returns {Promise<Object>} Transaction result
   */
  async verifyCredit(tokenId, verificationNotes) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      console.log('✅ Verifying credit...');
      
      const tx = await this.creditContract.verifyCredit(tokenId, verificationNotes);
      
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      console.log('✅ Credit verified successfully');
      console.log('📋 Transaction hash:', receipt.transactionHash);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
      
    } catch (error) {
      console.error('❌ Failed to verify credit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reject a credit
   * @param {string} tokenId - Token ID to reject
   * @param {string} rejectionReason - Reason for rejection
   * @returns {Promise<Object>} Transaction result
   */
  async rejectCredit(tokenId, rejectionReason) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      console.log('❌ Rejecting credit...');
      
      const tx = await this.creditContract.rejectCredit(tokenId, rejectionReason);
      
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      console.log('✅ Credit rejected successfully');
      console.log('📋 Transaction hash:', receipt.transactionHash);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
      
    } catch (error) {
      console.error('❌ Failed to reject credit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retire a credit
   * @param {string} tokenId - Token ID to retire
   * @param {string} retirementReason - Reason for retirement
   * @returns {Promise<Object>} Transaction result
   */
  async retireCredit(tokenId, retirementReason) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      console.log('🏁 Retiring credit...');
      
      const tx = await this.creditContract.retireCredit(tokenId, retirementReason);
      
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      console.log('✅ Credit retired successfully');
      console.log('📋 Transaction hash:', receipt.transactionHash);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
      
    } catch (error) {
      console.error('❌ Failed to retire credit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a marketplace listing
   * @param {string} tokenId - Token ID to list
   * @param {string} price - Price in wei
   * @param {number} expiryDays - Days until listing expires
   * @returns {Promise<Object>} Transaction result
   */
  async createListing(tokenId, price, expiryDays) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      console.log('📝 Creating marketplace listing...');
      
      const tx = await this.marketplaceContract.createListing(tokenId, price, expiryDays);
      
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      console.log('✅ Listing created successfully');
      console.log('📋 Transaction hash:', receipt.transactionHash);
      
      // Parse events to get listing ID
      const event = receipt.events?.find(e => e.event === 'ListingCreated');
      const listingId = event?.args?.listingId;
      
      return {
        success: true,
        listingId: listingId?.toString(),
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
      
    } catch (error) {
      console.error('❌ Failed to create listing:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Purchase a credit from marketplace
   * @param {string} listingId - Listing ID to purchase
   * @param {string} price - Price in wei
   * @returns {Promise<Object>} Transaction result
   */
  async purchaseCredit(listingId, price) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      console.log('🛒 Purchasing credit...');
      
      const tx = await this.marketplaceContract.purchaseCredit(listingId, { value: price });
      
      console.log('⏳ Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      console.log('✅ Credit purchased successfully');
      console.log('📋 Transaction hash:', receipt.transactionHash);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
      
    } catch (error) {
      console.error('❌ Failed to purchase credit:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get credit data from blockchain
   * @param {string} tokenId - Token ID
   * @returns {Promise<Object>} Credit data
   */
  async getCreditData(tokenId) {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const creditData = await this.creditContract.getCreditData(tokenId);
      
      return {
        success: true,
        data: {
          hydrogenAmount: creditData.hydrogenAmount.toString() / 1000000, // Scale back
          carbonIntensity: creditData.carbonIntensity.toString() / 1000, // Scale back
          productionTimestamp: creditData.productionTimestamp.toString(),
          producer: creditData.producer,
          verified: creditData.verified,
          retired: creditData.retired,
          ipfsHash: creditData.ipfsHash,
          verificationNotes: creditData.verificationNotes,
          verifiedAt: creditData.verifiedAt.toString(),
          verifier: creditData.verifier
        }
      };
      
    } catch (error) {
      console.error('❌ Failed to get credit data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get total credits issued
   * @returns {Promise<Object>} Total count
   */
  async getTotalCredits() {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const total = await this.creditContract.getTotalCredits();
      return {
        success: true,
        total: total.toString()
      };
    } catch (error) {
      console.error('❌ Failed to get total credits:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get verified credits
   * @returns {Promise<Object>} Array of verified token IDs
   */
  async getVerifiedCredits() {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const verifiedCredits = await this.creditContract.getVerifiedCredits();
      return {
        success: true,
        credits: verifiedCredits.map(id => id.toString())
      };
    } catch (error) {
      console.error('❌ Failed to get verified credits:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get marketplace listings
   * @returns {Promise<Object>} Array of listing IDs
   */
  async getActiveListings() {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const listings = await this.marketplaceContract.getActiveListings();
      return {
        success: true,
        listings: listings.map(id => id.toString())
      };
    } catch (error) {
      console.error('❌ Failed to get active listings:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get wallet balance
   * @returns {Promise<Object>} Balance in wei
   */
  async getBalance() {
    if (!this.isInitialized) {
      throw new Error('Blockchain service not initialized');
    }

    try {
      const balance = await this.wallet.getBalance();
      return {
        success: true,
        balance: balance.toString(),
        balanceEth: ethers.utils.formatEther(balance)
      };
    } catch (error) {
      console.error('❌ Failed to get balance:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Contract ABIs (simplified versions)
  getCreditContractABI() {
    return [
      "function issueCredit(address producer, uint256 hydrogenAmount, uint256 carbonIntensity, string memory ipfsHash) external returns (uint256)",
      "function verifyCredit(uint256 tokenId, string memory verificationNotes) external",
      "function rejectCredit(uint256 tokenId, string memory rejectionReason) external",
      "function retireCredit(uint256 tokenId, string memory retirementReason) external",
      "function getCreditData(uint256 tokenId) external view returns (tuple(uint256,uint256,uint256,address,bool,bool,string,string,uint256,address))",
      "function getTotalCredits() external view returns (uint256)",
      "function getVerifiedCredits() external view returns (uint256[])",
      "function creditData(uint256) external view returns (tuple(uint256,uint256,uint256,address,bool,bool,string,string,uint256,address))",
      "function ownerOf(uint256 tokenId) external view returns (address)",
      "function transferFrom(address from, address to, uint256 tokenId) external",
      "function transferCredit(address from, address to, uint256 tokenId) external",
      "function grantRole(bytes32 role, address account) external",
      "function hasRole(bytes32 role, address account) external view returns (bool)",
      "event CreditIssued(uint256 indexed tokenId, address indexed producer, uint256 hydrogenAmount, uint256 carbonIntensity, string ipfsHash)",
      "event CreditVerified(uint256 indexed tokenId, address indexed verifier, string verificationNotes)",
      "event CreditRejected(uint256 indexed tokenId, address indexed verifier, string rejectionReason)",
      "event CreditRetired(uint256 indexed tokenId, address indexed owner, string retirementReason)"
    ];
  }

  getMarketplaceContractABI() {
    return [
      "function createListing(uint256 tokenId, uint256 price, uint256 expiryDays) external",
      "function purchaseCredit(uint256 listingId) external payable",
      "function getActiveListings() external view returns (uint256[])",
      "function getListing(uint256 listingId) external view returns (tuple(uint256,uint256,address,uint256,bool,uint256,uint256))",
      "function getTotalListings() external view returns (uint256)",
      "event ListingCreated(uint256 indexed listingId, uint256 indexed tokenId, address indexed seller, uint256 price, uint256 expiryTimestamp)",
      "event CreditPurchased(uint256 indexed purchaseId, uint256 indexed listingId, uint256 indexed tokenId, address buyer, address seller, uint256 price)"
    ];
  }
}

module.exports = BlockchainService;

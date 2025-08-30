const mongoose = require('mongoose');

const marketplaceListingSchema = new mongoose.Schema({
  listingId: {
    type: String,
    required: true,
    unique: true
  },
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    unit: 'USD'
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
    unit: 'USD'
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'canceled', 'expired', 'suspended'],
    default: 'active'
  },
  listedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  soldAt: Date,
  canceledAt: Date,
  expiredAt: Date,
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  saleTxHash: String,
  listingDuration: {
    type: Number,
    default: 30, // days
    min: 1,
    max: 365
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  minimumBidIncrement: {
    type: Number,
    default: 0.01,
    min: 0.01,
    unit: 'USD'
  },
  auctionEndTime: Date,
  isAuction: {
    type: Boolean,
    default: false
  },
  currentBid: {
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    timestamp: Date
  },
  bidHistory: [{
    bidderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: Number,
    timestamp: Date,
    txHash: String
  }],
  metadata: {
    title: String,
    description: String,
    tags: [String],
    images: [String], // IPFS hashes
    documents: [String] // IPFS hashes
  },
  platformFees: {
    listingFee: {
      type: Number,
      default: 0,
      unit: 'USD'
    },
    transactionFee: {
      type: Number,
      default: 2.5, // 2.5%
      min: 0,
      max: 10
    }
  },
  complianceInfo: {
    rfnboCompliant: Boolean,
    carbonIntensity: Number,
    energySource: String,
    verificationStatus: String
  }
}, {
  timestamps: true
});

// Indexes
marketplaceListingSchema.index({ listingId: 1 });
marketplaceListingSchema.index({ tokenId: 1 });
marketplaceListingSchema.index({ sellerId: 1 });
marketplaceListingSchema.index({ status: 1 });
marketplaceListingSchema.index({ price: 1 });
marketplaceListingSchema.index({ listedAt: -1 });
marketplaceListingSchema.index({ 'complianceInfo.carbonIntensity': 1 });
marketplaceListingSchema.index({ 'complianceInfo.energySource': 1 });

// Instance method to check if listing is active
marketplaceListingSchema.methods.isActive = function() {
  if (this.status !== 'active') return false;
  
  // Check if listing has expired
  if (this.listedAt && this.listingDuration) {
    const expiryDate = new Date(this.listedAt.getTime() + (this.listingDuration * 24 * 60 * 60 * 1000));
    if (new Date() > expiryDate) {
      this.status = 'expired';
      this.expiredAt = new Date();
      return false;
    }
  }
  
  return true;
};

// Instance method to place a bid
marketplaceListingSchema.methods.placeBid = function(bidderId, amount) {
  if (!this.isAuction || !this.isActive()) {
    throw new Error('Cannot place bid on non-auction or inactive listing');
  }
  
  if (this.currentBid && amount <= this.currentBid.amount) {
    throw new Error('Bid must be higher than current bid');
  }
  
  if (amount < this.price + this.minimumBidIncrement) {
    throw new Error(`Bid must be at least $${this.minimumBidIncrement} higher than current price`);
  }
  
  // Add current bid to history
  if (this.currentBid) {
    this.bidHistory.push(this.currentBid);
  }
  
  // Update current bid
  this.currentBid = {
    bidderId,
    amount,
    timestamp: new Date()
  };
  
  return this.currentBid;
};

// Instance method to calculate final sale price
marketplaceListingSchema.methods.calculateFinalPrice = function() {
  if (this.status !== 'sold') return null;
  
  const basePrice = this.currentBid ? this.currentBid.amount : this.price;
  const transactionFee = (basePrice * this.platformFees.transactionFee) / 100;
  
  return {
    basePrice,
    transactionFee,
    finalPrice: basePrice + transactionFee,
    sellerReceives: basePrice - transactionFee
  };
};

// Static method to get active listings with filters
marketplaceListingSchema.statics.getActiveListings = async function(filters = {}) {
  const query = { status: 'active' };
  
  if (filters.minPrice) query.price = { $gte: filters.minPrice };
  if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
  if (filters.sellerId) query.sellerId = filters.sellerId;
  if (filters.carbonIntensity) query['complianceInfo.carbonIntensity'] = { $lte: filters.carbonIntensity };
  if (filters.energySource) query['complianceInfo.energySource'] = filters.energySource;
  if (filters.rfnboCompliant !== undefined) query['complianceInfo.rfnboCompliant'] = filters.rfnboCompliant;
  
  return await this.find(query)
    .populate('sellerId', 'companyName')
    .populate('currentBid.bidderId', 'companyName')
    .sort({ listedAt: -1 });
};

// Static method to get marketplace statistics
marketplaceListingSchema.statics.getMarketplaceStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalListings: { $sum: 1 },
        activeListings: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        soldListings: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] } },
        totalVolume: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, '$price', 0] } },
        avgPrice: { $avg: '$price' }
      }
    }
  ]);
};

module.exports = mongoose.model('MarketplaceListing', marketplaceListingSchema);

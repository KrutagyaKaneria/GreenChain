const mongoose = require('mongoose');

const creditSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true
  },
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hydrogenAmount: {
    type: Number,
    required: true,
    min: 0,
    unit: 'kg'
  },
  carbonIntensity: {
    type: Number,
    required: true,
    min: 0,
    unit: 'kg CO2/kg H2'
  },
  energySource: {
    type: String,
    required: true,
    enum: ['renewable', 'nuclear', 'fossil_fuel', 'mixed'],
    default: 'renewable'
  },
  issuedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationComments: {
    type: String,
    trim: true
  },
  txHash: {
    type: String,
    required: true,
    trim: true
  },
  blockNumber: Number,
  gasUsed: Number,
  ipfsHash: {
    type: String,
    trim: true
  },
  retired: {
    type: Boolean,
    default: false
  },
  retiredAt: Date,
  retiredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  retirementTxHash: String,
  marketplaceListing: {
    isListed: {
      type: Boolean,
      default: false
    },
    listedAt: Date,
    price: Number,
    listingId: String
  },
  metadata: {
    facilityName: String,
    location: String,
    technology: String,
    certificationStatus: String,
    productionPeriod: {
      start: Date,
      end: Date
    },
    sensorData: [{
      sensorId: mongoose.Schema.Types.ObjectId,
      timestamp: Date,
      productionVolume: Number,
      carbonIntensity: Number
    }]
  },
  complianceData: {
    rfnboCompliant: {
      type: Boolean,
      default: false
    },
    additionalityWindow: Number, // in years
    correlationRules: [String],
    verificationMethod: String
  }
}, {
  timestamps: true
});

// Indexes
creditSchema.index({ tokenId: 1 });
creditSchema.index({ producerId: 1 });
creditSchema.index({ issuedAt: -1 });
creditSchema.index({ verified: 1 });
creditSchema.index({ verificationStatus: 1 });
creditSchema.index({ retired: 1 });
creditSchema.index({ carbonIntensity: 1 });
creditSchema.index({ 'marketplaceListing.isListed': 1 });

// Instance method to check if credit is available for trading
creditSchema.methods.isAvailableForTrading = function() {
  return this.verified && 
         this.verificationStatus === 'approved' && 
         !this.retired && 
         !this.marketplaceListing.isListed;
};

// Instance method to check if credit meets RFNBO criteria
creditSchema.methods.meetsRFNBO = function() {
  return this.carbonIntensity <= 3.0 && // EU RFNBO threshold
         this.energySource === 'renewable' &&
         this.complianceData.rfnboCompliant;
};

// Instance method to get credit value
creditSchema.methods.getCreditValue = function() {
  // Base value based on hydrogen amount and carbon intensity
  let baseValue = this.hydrogenAmount * (1 / (this.carbonIntensity + 0.1));
  
  // Premium for RFNBO compliance
  if (this.meetsRFNBO()) {
    baseValue *= 1.2;
  }
  
  // Premium for renewable energy
  if (this.energySource === 'renewable') {
    baseValue *= 1.1;
  }
  
  return Math.round(baseValue * 100) / 100; // Round to 2 decimal places
};

// Static method to get credits by producer
creditSchema.statics.getCreditsByProducer = async function(producerId, options = {}) {
  const query = { producerId };
  
  if (options.verified !== undefined) {
    query.verified = options.verified;
  }
  
  if (options.retired !== undefined) {
    query.retired = options.retired;
  }
  
  if (options.dateFrom) {
    query.issuedAt = { $gte: options.dateFrom };
  }
  
  if (options.dateTo) {
    query.issuedAt = { ...query.issuedAt, $lte: options.dateTo };
  }
  
  return await this.find(query)
    .sort({ issuedAt: -1 })
    .populate('producerId', 'companyName email')
    .populate('verifierId', 'companyName email');
};

// Static method to get verification statistics
creditSchema.statics.getVerificationStats = async function(producerId = null) {
  const match = {};
  if (producerId) {
    match.producerId = mongoose.Types.ObjectId(producerId);
  }
  
  return await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        verified: { $sum: { $cond: ['$verified', 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'pending'] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'approved'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'rejected'] }, 1, 0] } },
        retired: { $sum: { $cond: ['$retired', 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('Credit', creditSchema);

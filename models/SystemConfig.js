const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['otp', 'jwt', 'marketplace', 'smart_contract', 'feature_toggle', 'compliance', 'system'],
    default: 'system'
  },
  dataType: {
    type: String,
    required: true,
    enum: ['string', 'number', 'boolean', 'json', 'array'],
    default: 'string'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isEditable: {
    type: Boolean,
    default: true
  },
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    enum: [String],
    required: Boolean
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  version: {
    type: Number,
    default: 1
  },
  changeHistory: [{
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }]
}, {
  timestamps: true
});

// Indexes
systemConfigSchema.index({ key: 1 });
systemConfigSchema.index({ category: 1 });
systemConfigSchema.index({ isPublic: 1 });

// Instance method to validate value based on dataType and validation rules
systemConfigSchema.methods.validateValue = function(newValue) {
  // Type validation
  switch (this.dataType) {
    case 'string':
      if (typeof newValue !== 'string') {
        throw new Error(`Value must be a string for key: ${this.key}`);
      }
      break;
    case 'number':
      if (typeof newValue !== 'number' || isNaN(newValue)) {
        throw new Error(`Value must be a valid number for key: ${this.key}`);
      }
      break;
    case 'boolean':
      if (typeof newValue !== 'boolean') {
        throw new Error(`Value must be a boolean for key: ${this.key}`);
      }
      break;
    case 'json':
      try {
        if (typeof newValue === 'string') {
          JSON.parse(newValue);
        }
      } catch (error) {
        throw new Error(`Value must be valid JSON for key: ${this.key}`);
      }
      break;
    case 'array':
      if (!Array.isArray(newValue)) {
        throw new Error(`Value must be an array for key: ${this.key}`);
      }
      break;
  }

  // Range validation
  if (this.validation.min !== undefined && newValue < this.validation.min) {
    throw new Error(`Value must be at least ${this.validation.min} for key: ${this.key}`);
  }
  if (this.validation.max !== undefined && newValue > this.validation.max) {
    throw new Error(`Value must be at most ${this.validation.max} for key: ${this.key}`);
  }

  // Pattern validation
  if (this.validation.pattern && typeof newValue === 'string') {
    const regex = new RegExp(this.validation.pattern);
    if (!regex.test(newValue)) {
      throw new Error(`Value does not match required pattern for key: ${this.key}`);
    }
  }

  // Enum validation
  if (this.validation.enum && this.validation.enum.length > 0) {
    if (!this.validation.enum.includes(newValue)) {
      throw new Error(`Value must be one of: ${this.validation.enum.join(', ')} for key: ${this.key}`);
    }
  }

  return true;
};

// Instance method to update value with history tracking
systemConfigSchema.methods.updateValue = function(newValue, updatedBy, reason = '') {
  // Validate new value
  this.validateValue(newValue);

  // Store change history
  this.changeHistory.push({
    oldValue: this.value,
    newValue: newValue,
    changedBy: updatedBy,
    changedAt: new Date(),
    reason: reason
  });

  // Update value and version
  this.value = newValue;
  this.version += 1;
  this.updatedBy = updatedBy;

  return this;
};

// Static method to get configuration by category
systemConfigSchema.statics.getByCategory = async function(category) {
  return await this.find({ category }).sort({ key: 1 });
};

// Static method to get public configuration
systemConfigSchema.statics.getPublicConfig = async function() {
  return await this.find({ isPublic: true }).select('key value description category');
};

// Static method to initialize default configuration
systemConfigSchema.statics.initializeDefaults = async function() {
  const defaults = [
    // OTP Configuration
    {
      key: 'otp.length',
      value: 6,
      description: 'Length of OTP codes',
      category: 'otp',
      dataType: 'number',
      validation: { min: 4, max: 8 }
    },
    {
      key: 'otp.expiry_minutes',
      value: 10,
      description: 'OTP expiration time in minutes',
      category: 'otp',
      dataType: 'number',
      validation: { min: 5, max: 60 }
    },
    
    // JWT Configuration
    {
      key: 'jwt.expires_in',
      value: '24h',
      description: 'JWT token expiration time',
      category: 'jwt',
      dataType: 'string',
      validation: { enum: ['1h', '6h', '12h', '24h', '7d'] }
    },
    {
      key: 'jwt.refresh_expires_in',
      value: '7d',
      description: 'JWT refresh token expiration time',
      category: 'jwt',
      dataType: 'string',
      validation: { enum: ['1d', '3d', '7d', '14d', '30d'] }
    },
    
    // Marketplace Configuration
    {
      key: 'marketplace.transaction_fee',
      value: 2.5,
      description: 'Platform transaction fee percentage',
      category: 'marketplace',
      dataType: 'number',
      validation: { min: 0, max: 10 }
    },
    {
      key: 'marketplace.minimum_listing_duration',
      value: 1,
      description: 'Minimum listing duration in days',
      category: 'marketplace',
      dataType: 'number',
      validation: { min: 1, max: 365 }
    },
    
    // Feature Toggles
    {
      key: 'features.new_signups_enabled',
      value: true,
      description: 'Enable new user registrations',
      category: 'feature_toggle',
      dataType: 'boolean'
    },
    {
      key: 'features.marketplace_trading',
      value: true,
      description: 'Enable marketplace trading',
      category: 'feature_toggle',
      dataType: 'boolean'
    },
    {
      key: 'features.maintenance_mode',
      value: false,
      description: 'Enable maintenance mode',
      category: 'feature_toggle',
      dataType: 'boolean'
    },
    
    // Compliance Configuration
    {
      key: 'compliance.rfnbo_threshold',
      value: 3.0,
      description: 'RFNBO carbon intensity threshold (kg CO2/kg H2)',
      category: 'compliance',
      dataType: 'number',
      validation: { min: 0, max: 10 }
    },
    {
      key: 'compliance.minimum_production_volume',
      value: 100,
      description: 'Minimum production volume for credit issuance (kg)',
      category: 'compliance',
      dataType: 'number',
      validation: { min: 10, max: 1000 }
    }
  ];

  for (const defaultConfig of defaults) {
    const existing = await this.findOne({ key: defaultConfig.key });
    if (!existing) {
      await this.create(defaultConfig);
    }
  }
};

module.exports = mongoose.model('SystemConfig', systemConfigSchema);

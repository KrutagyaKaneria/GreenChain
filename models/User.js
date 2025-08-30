const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['admin', 'producer', 'verifier', 'buyer', 'regulator'],
    default: 'buyer'
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  
  // Role-specific fields
  facilityDetails: {
    type: {
      facilityName: String,
      location: String,
      capacity: Number,
      technology: String,
      certificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      }
    },
    required: function() { return this.role === 'producer'; }
  },
  
  certificationBody: {
    type: {
      bodyName: String,
      accreditationNumber: String,
      scope: String,
      expiryDate: {
        type: Date,
        default: function() {
          return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now
        }
      }
    },
    required: function() { return this.role === 'verifier'; }
  },
  
  industryType: {
    type: String,
    enum: ['steel', 'ammonia', 'transport', 'chemical', 'other'],
    required: function() { return this.role === 'buyer'; }
  },
  
  // Authentication fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  
  resetToken: String,
  resetTokenExpiry: Date,
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: Date,
  
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ companyName: 1 });
userSchema.index({ resetToken: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetToken;
  delete userObject.resetTokenExpiry;
  return userObject;
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);


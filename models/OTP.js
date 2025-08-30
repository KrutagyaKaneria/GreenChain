const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: 4
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

// TTL index for automatic expiration (10 minutes)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

// Index for email lookup
otpSchema.index({ email: 1 });

// Pre-save middleware to ensure OTP is 4 digits
otpSchema.pre('save', function(next) {
  if (this.otp && this.otp.length !== 4) {
    return next(new Error('OTP must be exactly 4 digits'));
  }
  next();
});

// Instance method to check if OTP is expired
otpSchema.methods.isExpired = function() {
  const now = new Date();
  const createdAt = new Date(this.createdAt);
  const expiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds
  
  return (now - createdAt) > expiryTime;
};

// Instance method to increment attempts
otpSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  return this.save();
};

// Instance method to check if max attempts exceeded
otpSchema.methods.hasExceededMaxAttempts = function() {
  return this.attempts >= this.maxAttempts;
};

// Static method to find valid OTP by email
otpSchema.statics.findValidOTP = function(email) {
  return this.findOne({ 
    email: email.toLowerCase(),
    verified: false,
    attempts: { $lt: 3 }
  });
};

// Static method to clean expired OTPs
otpSchema.statics.cleanExpiredOTPs = function() {
  const expiryTime = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
  return this.deleteMany({ createdAt: { $lt: expiryTime } });
};

module.exports = mongoose.model('OTP', otpSchema);


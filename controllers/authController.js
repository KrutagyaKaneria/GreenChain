const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const { validationResult } = require('express-validator');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Set JWT cookie
const setTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// User registration
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password, role, companyName, facilityDetails, certificationBody, industryType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      } else {
        // User exists but not verified, allow re-registration
        await User.deleteOne({ email: email.toLowerCase() });
        await OTP.deleteMany({ email: email.toLowerCase() });
      }
    }

    // Validate role-specific fields
    if (role === 'producer' && (!facilityDetails || !facilityDetails.facilityName)) {
      return res.status(400).json({
        success: false,
        message: 'Facility details are required for producers',
        errors: [{ field: 'facilityDetails.facilityName', message: 'Facility name is required' }]
      });
    }

    if (role === 'verifier' && (!certificationBody || !certificationBody.bodyName)) {
      return res.status(400).json({
        success: false,
        message: 'Certification body details are required for verifiers',
        errors: [{ field: 'certificationBody.bodyName', message: 'Certification body name is required' }]
      });
    }

    if (role === 'buyer' && (!industryType || industryType.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Industry type is required for buyers',
        errors: [{ field: 'industryType', message: 'Industry type is required' }]
      });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password,
      role,
      companyName,
      ...(role === 'producer' && facilityDetails && { facilityDetails }),
      ...(role === 'verifier' && certificationBody && { certificationBody }),
      ...(role === 'buyer' && industryType && { industryType })
    });

    await user.save();

    // Generate and save OTP
    const otp = generateOTP();
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp
    });
    await otpDoc.save();

    // Send OTP email
    await emailService.sendOTPEmail(email, otp, companyName);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        companyName: user.companyName
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// OTP verification
const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;

    // Find valid OTP
    const otpDoc = await OTP.findValidOTP(email);
    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
        errors: [{ field: 'otp', message: 'Invalid or expired OTP' }]
      });
    }

    // Check if OTP matches
    if (otpDoc.otp !== otp) {
      await otpDoc.incrementAttempts();

      if (otpDoc.hasExceededMaxAttempts()) {
        return res.status(400).json({
          success: false,
          message: 'Maximum OTP attempts exceeded. Please request a new OTP.',
          errors: [{ field: 'otp', message: 'Maximum attempts exceeded' }]
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP code',
          errors: [{ field: 'otp', message: 'Invalid OTP code' }]
        });
      }
    }

    // Mark OTP as verified
    otpDoc.verified = true;
    await otpDoc.save();

    // Update user email verification status
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isEmailVerified = true;
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during OTP verification'
    });
  }
};

// User login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: [{ field: 'email', message: 'Invalid email or password' }]
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
        errors: [{ field: 'email', message: 'Account has been deactivated' }]
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
        errors: [{ field: 'email', message: 'Please verify your email before logging in' }]
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: [{ field: 'password', message: 'Invalid email or password' }]
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + (process.env.PASSWORD_RESET_EXPIRY_HOURS || 1) * 60 * 60 * 1000);

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send password reset email
    await emailService.sendPasswordResetEmail(email, resetLink, user.companyName);

    res.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password reset request'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    // Find user with reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
        errors: [{ field: 'token', message: 'Invalid or expired reset token' }]
      });
    }

    // Update password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during password reset'
    });
  }
};

// Logout
const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { companyName, facilityDetails, certificationBody, industryType } = req.body;
    const updates = {};

    // Only allow updating certain fields
    if (companyName) updates.companyName = companyName;
    if (facilityDetails && req.user.role === 'producer') updates.facilityDetails = facilityDetails;
    if (certificationBody && req.user.role === 'verifier') updates.certificationBody = certificationBody;
    if (industryType && req.user.role === 'buyer') updates.industryType = industryType;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile'
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Check if user exists and is not verified
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
        errors: [{ field: 'email', message: 'User not found' }]
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
        errors: [{ field: 'email', message: 'Email is already verified' }]
      });
    }

    // Delete existing OTP
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Generate new OTP
    const otp = generateOTP();
    const otpDoc = new OTP({
      email: email.toLowerCase(),
      otp
    });
    await otpDoc.save();

    // Send new OTP email
    await emailService.sendOTPEmail(email, otp, user.companyName);

    res.json({
      success: true,
      message: 'New OTP sent successfully. Please check your email.'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while resending OTP'
    });
  }
};

module.exports = {
  signup,
  verifyOTP,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getProfile,
  updateProfile,
  resendOTP
};
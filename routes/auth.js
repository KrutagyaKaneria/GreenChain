const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const {
  signupValidation,
  otpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  profileUpdateValidation,
  resendOTPValidation
} = require('../middleware/validation');

// Public routes (no authentication required)
router.post('/signup', signupValidation, authController.signup);
router.post('/verify-otp', otpValidation, authController.verifyOTP);
router.post('/login', loginValidation, authController.login);
router.post('/forgot-password', forgotPasswordValidation, authController.forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, authController.resetPassword);
router.post('/resend-otp', resendOTPValidation, authController.resendOTP);

// Protected routes (authentication required)
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, profileUpdateValidation, authController.updateProfile);

module.exports = router;


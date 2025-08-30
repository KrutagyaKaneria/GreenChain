const { body, param } = require('express-validator');

// Common validation rules
const emailValidation = body('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail()
  .trim();

const passwordValidation = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

const companyNameValidation = body('companyName')
  .isLength({ min: 2, max: 100 })
  .withMessage('Company name must be between 2 and 100 characters')
  .trim()
  .escape();

// Signup validation
const signupValidation = [
  emailValidation,
  passwordValidation,
  companyNameValidation,
  body('role')
    .isIn(['admin', 'producer', 'verifier', 'buyer', 'regulator'])
    .withMessage('Invalid role selected'),
];

// OTP verification validation
const otpValidation = [
  emailValidation,
  body('otp')
    .isLength({ min: 4, max: 4 })
    .withMessage('OTP must be exactly 4 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

// Login validation
const loginValidation = [
  emailValidation,
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Forgot password validation
const forgotPasswordValidation = [
  emailValidation
];

// Reset password validation
const resetPasswordValidation = [
  param('token')
    .isLength({ min: 64, max: 64 })
    .withMessage('Invalid reset token format'),
  passwordValidation
];

// Profile update validation
const profileUpdateValidation = [
  companyNameValidation.optional(),
  
  // Role-specific validations for updates
  body('facilityDetails.facilityName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Facility name must be between 2 and 100 characters'),
  
  body('facilityDetails.location')
    .optional()
    .notEmpty()
    .withMessage('Facility location cannot be empty'),
  
  body('facilityDetails.capacity')
    .optional()
    .isNumeric()
    .withMessage('Facility capacity must be a number'),
  
  body('facilityDetails.technology')
    .optional()
    .notEmpty()
    .withMessage('Technology type cannot be empty'),
  
  body('certificationBody.bodyName')
    .optional()
    .notEmpty()
    .withMessage('Certification body name cannot be empty'),
  
  body('certificationBody.accreditationNumber')
    .optional()
    .notEmpty()
    .withMessage('Accreditation number cannot be empty'),
  
  body('certificationBody.scope')
    .optional()
    .notEmpty()
    .withMessage('Certification scope cannot be empty'),
  
  body('industryType')
    .optional()
    .isIn(['steel', 'ammonia', 'transport', 'chemical', 'other'])
    .withMessage('Invalid industry type')
];

// Resend OTP validation
const resendOTPValidation = [
  emailValidation
];

module.exports = {
  signupValidation,
  otpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  profileUpdateValidation,
  resendOTPValidation
};


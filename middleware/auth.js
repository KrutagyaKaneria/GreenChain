const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware - verifies JWT and loads user
const authenticate = async (req, res, next) => {
  try {
    // Get token from HTTP-only cookie or Authorization header
    let token = req.cookies.jwt;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated.',
        code: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Email not verified. Please verify your email first.',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Authorization middleware - checks if user has required role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Role-specific authorization helpers
const isAdmin = authorize('admin');
const isProducer = authorize('producer');
const isVerifier = authorize('verifier');
const isBuyer = authorize('buyer');
const isRegulator = authorize('regulator');

// Producer or Verifier authorization (for credit-related operations)
const isProducerOrVerifier = authorize('producer', 'verifier');

// Admin or Regulator authorization (for system-wide operations)
const isAdminOrRegulator = authorize('admin', 'regulator');

// Optional authentication - doesn't fail if no token, but loads user if present
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive && user.isEmailVerified) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user can access specific resource
const canAccessResource = (resourceType, resourceId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required.'
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Regulator can access compliance and audit data
      if (req.user.role === 'regulator' && 
          ['compliance', 'audit', 'transaction'].includes(resourceType)) {
        return next();
      }

      // For other resources, check ownership or specific permissions
      // This is a placeholder - implement based on your resource structure
      const hasAccess = await checkResourceAccess(req.user, resourceType, resourceId);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this resource.'
        });
      }

      next();
    } catch (error) {
      console.error('Resource access check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking resource access.'
      });
    }
  };
};

// Helper function to check resource access (implement based on your needs)
async function checkResourceAccess(user, resourceType, resourceId) {
  // Implement your resource access logic here
  // This could involve checking ownership, permissions, or other business rules
  
  switch (resourceType) {
    case 'facility':
      // Producers can only access their own facilities
      return user.role === 'producer';
      
    case 'credit':
      // Producers can manage their own credits
      // Verifiers can access credits they're assigned to verify
      // Buyers can view available credits
      return ['producer', 'verifier', 'buyer'].includes(user.role);
      
    case 'verification':
      // Verifiers can access verification requests
      return user.role === 'verifier';
      
    default:
      return false;
  }
}

module.exports = {
  authenticate,
  authorize,
  isAdmin,
  isProducer,
  isVerifier,
  isBuyer,
  isRegulator,
  isProducerOrVerifier,
  isAdminOrRegulator,
  optionalAuth,
  canAccessResource
};


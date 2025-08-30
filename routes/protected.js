const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Test protected endpoint
router.get('/test', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected endpoint',
    user: req.user.getPublicProfile()
  });
});

// Producer-only endpoints
router.get('/producer/facilities', authenticate, authorize('producer'), (req, res) => {
  res.json({
    success: true,
    message: 'Producer facilities data',
    data: {
      facilities: [
        {
          id: 1,
          name: req.user.facilityDetails?.facilityName || 'Default Facility',
          status: 'operational',
          production: '1250 kg/month'
        }
      ]
    }
  });
});

// Verifier-only endpoints
router.get('/verifier/pending', authenticate, authorize('verifier'), (req, res) => {
  res.json({
    success: true,
    message: 'Pending verifications',
    data: {
      pending: [
        {
          id: 1,
          producer: 'Green Energy Corp',
          credits: 50,
          submitted: '2024-01-15'
        }
      ]
    }
  });
});

// Buyer-only endpoints
router.get('/buyer/marketplace', authenticate, authorize('buyer'), (req, res) => {
  res.json({
    success: true,
    message: 'Available credits marketplace',
    data: {
      credits: [
        {
          id: 1,
          producer: 'Hydrogen Solutions Ltd',
          amount: 100,
          price: '$50/credit',
          verified: true
        }
      ]
    }
  });
});

// Regulator-only endpoints
router.get('/regulator/audit', authenticate, authorize('regulator'), (req, res) => {
  res.json({
    success: true,
    message: 'System audit data',
    data: {
      totalTransactions: 12456,
      complianceRate: 97.8,
      activeFacilities: 156
    }
  });
});

// Admin-only endpoints
router.get('/admin/users', authenticate, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'User management data',
    data: {
      totalUsers: 1234,
      activeUsers: 1156,
      newUsersThisWeek: 15
    }
  });
});

module.exports = router;
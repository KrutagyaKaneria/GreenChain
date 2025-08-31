const express = require('express');
const router = express.Router();
const { authenticate: auth } = require('../middleware/auth');
const User = require('../models/User');
const IoTSensor = require('../models/IoTSensor');
const Credit = require('../models/Credit');
const MarketplaceListing = require('../models/MarketplaceListing');
const SystemConfig = require('../models/SystemConfig');
const AuditLog = require('../models/AuditLog');
const MockBlockchainService = require('../services/mockBlockchainService');

// Admin dashboard metrics
router.get('/dashboard/metrics', auth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalSensors = await IoTSensor.countDocuments();
    const activeSensors = await IoTSensor.countDocuments({ status: 'active' });
    const totalCredits = await Credit.countDocuments();
    const verifiedCredits = await Credit.countDocuments({ status: 'verified' });
    const pendingVerifications = await Credit.countDocuments({ status: 'pending' });
    
    // Calculate marketplace volume
    const marketplaceListings = await MarketplaceListing.find({ status: 'sold' });
    const marketplaceVolume = marketplaceListings.reduce((sum, listing) => sum + listing.price, 0);

    // Get system health
    const systemConfig = await SystemConfig.findOne();
    const systemHealth = systemConfig?.systemHealth || 'healthy';

    const metrics = {
      totalUsers,
      activeUsers,
      totalSensors,
      activeSensors,
      totalCredits,
      verifiedCredits,
      pendingVerifications,
      marketplaceVolume,
      systemHealth
    };

    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
});

// Recent activity
router.get('/dashboard/recent-activity', auth, async (req, res) => {
  try {
    const recentActivity = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'companyName email');

    const formattedActivity = recentActivity.map(log => ({
      id: log._id,
      action: log.action,
      user: log.userId?.companyName || 'System',
      timestamp: log.timestamp,
      status: log.severity === 'high' ? 'warning' : log.severity === 'medium' ? 'info' : 'success'
    }));

    res.json({ success: true, data: formattedActivity });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent activity' });
  }
});

// System alerts
router.get('/dashboard/system-alerts', auth, async (req, res) => {
  try {
    const alerts = await AuditLog.find({ 
      severity: { $in: ['high', 'medium'] },
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    })
    .sort({ timestamp: -1 })
    .limit(5);

    const formattedAlerts = alerts.map(alert => ({
      id: alert._id,
      type: alert.severity === 'high' ? 'warning' : 'info',
      message: alert.action,
      timestamp: alert.timestamp
    }));

    res.json({ success: true, data: formattedAlerts });
  } catch (error) {
    console.error('Error fetching system alerts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch system alerts' });
  }
});

// Blockchain status and operations
router.get('/blockchain/status', auth, async (req, res) => {
  try {
    // Initialize blockchain service (using mock for demo)
    const blockchainService = new MockBlockchainService();
    await blockchainService.initialize();
    
    // Get blockchain data
    const totalCredits = await blockchainService.getTotalCredits();
    const verifiedCredits = await blockchainService.getVerifiedCredits();
    const activeListings = await blockchainService.getActiveListings();
    const balance = await blockchainService.getBalance();
    
    const blockchainStatus = {
      isConnected: true,
      network: 'Polygon Mumbai Testnet',
      chainId: 80001,
      totalCredits: totalCredits.total,
      verifiedCredits: verifiedCredits.credits.length,
      activeListings: activeListings.listings.length,
      walletBalance: balance.balanceEth,
      lastSync: new Date().toISOString()
    };

    res.json({ success: true, data: blockchainStatus });
  } catch (error) {
    console.error('Error fetching blockchain status:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch blockchain status' });
  }
});

// Test blockchain operations
router.post('/blockchain/test-issue-credit', auth, async (req, res) => {
  try {
    const { producerAddress, hydrogenAmount, carbonIntensity, ipfsHash } = req.body;
    
    const blockchainService = new MockBlockchainService();
    await blockchainService.initialize();
    
    const result = await blockchainService.issueCredit(
      producerAddress || '0xProducerAddress123',
      hydrogenAmount || 1500.5,
      carbonIntensity || 2.1,
      ipfsHash || 'QmXyZ123...'
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error testing credit issuance:', error);
    res.status(500).json({ success: false, message: 'Failed to test credit issuance' });
  }
});

// Test credit verification
router.post('/blockchain/test-verify-credit', auth, async (req, res) => {
  try {
    const { tokenId, verificationNotes } = req.body;
    
    const blockchainService = new MockBlockchainService();
    await blockchainService.initialize();
    
    const result = await blockchainService.verifyCredit(
      tokenId || '1',
      verificationNotes || 'Credit verified after IoT data validation'
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error testing credit verification:', error);
    res.status(500).json({ success: false, message: 'Failed to test credit verification' });
  }
});

// Test marketplace listing
router.post('/blockchain/test-create-listing', auth, async (req, res) => {
  try {
    const { tokenId, price, expiryDays } = req.body;
    
    const blockchainService = new MockBlockchainService();
    await blockchainService.initialize();
    
    const result = await blockchainService.createListing(
      tokenId || '1',
      price || '2500000000000000000', // 2.5 ETH in wei
      expiryDays || 30
    );

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error testing listing creation:', error);
    res.status(500).json({ success: false, message: 'Failed to test listing creation' });
  }
});

// Get blockchain transaction history
router.get('/blockchain/transactions', auth, async (req, res) => {
  try {
    const blockchainService = new MockBlockchainService();
    await blockchainService.initialize();
    
    const transactionHistory = await blockchainService.getTransactionHistory();
    
    res.json({ success: true, data: transactionHistory.transactions });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transaction history' });
  }
});

// System settings
router.get('/system-settings', auth, async (req, res) => {
  try {
    const settings = await SystemConfig.findOne();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch system settings' });
  }
});

router.put('/system-settings', auth, async (req, res) => {
  try {
    const { platformFee, minCreditAmount, maxCreditAmount, systemHealth } = req.body;
    
    let settings = await SystemConfig.findOne();
    if (!settings) {
      settings = new SystemConfig();
    }

    settings.platformFee = platformFee || settings.platformFee;
    settings.minCreditAmount = minCreditAmount || settings.minCreditAmount;
    settings.maxCreditAmount = maxCreditAmount || settings.maxCreditAmount;
    settings.systemHealth = systemHealth || settings.systemHealth;

    await settings.save();

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: 'System settings updated',
      resource: 'SystemConfig',
      severity: 'medium'
    });

    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update system settings' });
  }
});

// User management
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

router.put('/users/:userId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: `User status updated to ${status}`,
      resource: `User: ${user.companyName}`,
      severity: 'medium'
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
});

// Reports and analytics
router.get('/reports/analytics', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const credits = await Credit.find({
      createdAt: { $gte: start, $lte: end }
    });

    const users = await User.find({
      createdAt: { $gte: start, $lte: end }
    });

    const analytics = {
      totalCredits: credits.length,
      verifiedCredits: credits.filter(c => c.status === 'verified').length,
      pendingCredits: credits.filter(c => c.status === 'pending').length,
      newUsers: users.length,
      totalVolume: credits.reduce((sum, credit) => sum + credit.hydrogenAmount, 0)
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error generating analytics report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate analytics report' });
  }
});

module.exports = router;

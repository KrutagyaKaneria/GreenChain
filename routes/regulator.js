const express = require('express');
const router = express.Router();
const { authenticate: auth } = require('../middleware/auth');
const User = require('../models/User');
const Credit = require('../models/Credit');
const MarketplaceListing = require('../models/MarketplaceListing');
const AuditLog = require('../models/AuditLog');
const SystemConfig = require('../models/SystemConfig');

// Regulator dashboard metrics
router.get('/dashboard/metrics', auth, async (req, res) => {
  try {
    // Check if user is regulator
    if (req.user.role !== 'regulator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Regulator role required.'
      });
    }

    // Get total credits
    const totalCredits = await Credit.countDocuments();
    const verifiedCredits = await Credit.countDocuments({ status: 'verified' });
    const tradedCredits = await Credit.countDocuments({ status: 'traded' });
    const retiredCredits = await Credit.countDocuments({ status: 'retired' });

    // Get active users
    const activeProducers = await User.countDocuments({ 
      role: 'producer', 
      status: 'active' 
    });
    const activeBuyers = await User.countDocuments({ 
      role: 'buyer', 
      status: 'active' 
    });

    // Calculate compliance rate
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const compliantBuyers = await User.countDocuments({ 
      role: 'buyer', 
      complianceStatus: 'compliant' 
    });
    const complianceRate = totalBuyers > 0 ? (compliantBuyers / totalBuyers) * 100 : 0;

    // Mock system uptime (in real app, this would come from monitoring)
    const systemUptime = 99.8;

    res.json({
      success: true,
      data: {
        totalCredits,
        verifiedCredits,
        tradedCredits,
        retiredCredits,
        activeProducers,
        activeBuyers,
        complianceRate: Math.round(complianceRate * 10) / 10,
        systemUptime
      }
    });
  } catch (error) {
    console.error('Error fetching regulator metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard metrics'
    });
  }
});

// Compliance summary
router.get('/dashboard/compliance-summary', auth, async (req, res) => {
  try {
    if (req.user.role !== 'regulator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Regulator role required.'
      });
    }

    // Get buyers with their compliance data
    const buyers = await User.find({ role: 'buyer' }).limit(10);
    
    const complianceSummary = buyers.map(buyer => {
      // Mock compliance data (in real app, this would be calculated from actual transactions)
      const requiredCredits = Math.floor(Math.random() * 100) + 50;
      const purchasedCredits = Math.floor(Math.random() * requiredCredits);
      const retiredCredits = Math.floor(Math.random() * purchasedCredits);
      
      let status = 'compliant';
      if (retiredCredits < requiredCredits * 0.8) {
        status = 'non-compliant';
      } else if (retiredCredits < requiredCredits) {
        status = 'pending';
      }

      return {
        id: buyer._id,
        buyer: buyer.companyName || buyer.email,
        industry: buyer.industry || 'unknown',
        requiredCredits,
        purchasedCredits,
        retiredCredits,
        status
      };
    });

    res.json({
      success: true,
      data: complianceSummary
    });
  } catch (error) {
    console.error('Error fetching compliance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching compliance summary'
    });
  }
});

// Recent audit logs
router.get('/dashboard/recent-audit-logs', auth, async (req, res) => {
  try {
    if (req.user.role !== 'regulator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Regulator role required.'
      });
    }

    const auditLogs = await AuditLog.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'email companyName role');

    const formattedLogs = auditLogs.map(log => ({
      id: log._id,
      timestamp: log.timestamp,
      user: log.userId?.companyName || log.userId?.email || 'Unknown',
      role: log.userId?.role || 'unknown',
      action: log.action,
      resource: log.resource,
      severity: log.severity
    }));

    res.json({
      success: true,
      data: formattedLogs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs'
    });
  }
});

// Suspicious activities
router.get('/dashboard/suspicious-activities', auth, async (req, res) => {
  try {
    if (req.user.role !== 'regulator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Regulator role required.'
      });
    }

    // Mock suspicious activities (in real app, this would be detected by algorithms)
    const suspiciousActivities = [
      {
        id: 1,
        type: 'warning',
        message: 'Unusual trading pattern detected',
        details: 'Rapid buy/sell of same credit within 1 hour',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        severity: 'medium'
      },
      {
        id: 2,
        type: 'info',
        message: 'New producer registration',
        details: 'EcoFuel Industries registered with mixed energy source',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        severity: 'low'
      }
    ];

    res.json({
      success: true,
      data: suspiciousActivities
    });
  } catch (error) {
    console.error('Error fetching suspicious activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suspicious activities'
    });
  }
});

// Generate compliance reports
router.get('/reports/compliance', auth, async (req, res) => {
  try {
    if (req.user.role !== 'regulator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Regulator role required.'
      });
    }

    // Generate comprehensive compliance report
    const totalBuyers = await User.countDocuments({ role: 'buyer' });
    const compliantBuyers = await User.countDocuments({ 
      role: 'buyer', 
      complianceStatus: 'compliant' 
    });
    const nonCompliantBuyers = await User.countDocuments({ 
      role: 'buyer', 
      complianceStatus: 'non-compliant' 
    });

    const report = {
      generatedAt: new Date(),
      summary: {
        totalBuyers,
        compliantBuyers,
        nonCompliantBuyers,
        complianceRate: totalBuyers > 0 ? (compliantBuyers / totalBuyers) * 100 : 0
      },
      details: {
        totalCredits: await Credit.countDocuments(),
        verifiedCredits: await Credit.countDocuments({ status: 'verified' }),
        tradedCredits: await Credit.countDocuments({ status: 'traded' }),
        retiredCredits: await Credit.countDocuments({ status: 'retired' })
      }
    };

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating compliance report'
    });
  }
});

// Export regulatory data
router.get('/export/regulatory-data', auth, async (req, res) => {
  try {
    if (req.user.role !== 'regulator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Regulator role required.'
      });
    }

    const format = req.query.format || 'json';
    
    if (format === 'csv') {
      // Generate CSV data
      const csvData = 'Buyer,Industry,RequiredCredits,PurchasedCredits,RetiredCredits,Status\n';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="regulatory-data.csv"');
      res.send(csvData);
    } else {
      // Return JSON data
      const buyers = await User.find({ role: 'buyer' });
      const credits = await Credit.find();
      const auditLogs = await AuditLog.find().limit(100);

      res.json({
        success: true,
        data: {
          buyers: buyers.length,
          credits: credits.length,
          auditLogs: auditLogs.length,
          exportDate: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Error exporting regulatory data:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting regulatory data'
    });
  }
});

// Get enforcement actions
router.get('/enforcement-actions', auth, async (req, res) => {
  try {
    if (req.user.role !== 'regulator') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Regulator role required.'
      });
    }

    // Mock enforcement actions (in real app, this would be stored in database)
    const enforcementActions = [
      {
        id: 1,
        type: 'warning',
        target: 'SteelCorp Industries',
        reason: 'Non-compliance with credit requirements',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        id: 2,
        type: 'fine',
        target: 'ChemTech Solutions',
        reason: 'Late credit retirement',
        status: 'issued',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
      }
    ];

    res.json({
      success: true,
      data: enforcementActions
    });
  } catch (error) {
    console.error('Error fetching enforcement actions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enforcement actions'
    });
  }
});

module.exports = router;

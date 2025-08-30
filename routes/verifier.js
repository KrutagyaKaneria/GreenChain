const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Credit = require('../models/Credit');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Verifier dashboard metrics
router.get('/dashboard/metrics', auth, async (req, res) => {
  try {
    const totalReviewed = await Credit.countDocuments({ 
      verifierId: req.user.id,
      status: { $in: ['verified', 'rejected'] }
    });

    const approvedCredits = await Credit.countDocuments({ 
      verifierId: req.user.id,
      status: 'verified'
    });

    const approvalRate = totalReviewed > 0 ? Math.round((approvedCredits / totalReviewed) * 100) : 0;

    const pendingReviews = await Credit.countDocuments({ status: 'pending' });

    // Calculate average review time
    const reviewedCredits = await Credit.find({ 
      verifierId: req.user.id,
      status: { $in: ['verified', 'rejected'] },
      verifiedAt: { $exists: true }
    });

    let totalReviewTime = 0;
    let reviewCount = 0;

    reviewedCredits.forEach(credit => {
      if (credit.createdAt && credit.verifiedAt) {
        const reviewTime = credit.verifiedAt.getTime() - credit.createdAt.getTime();
        totalReviewTime += reviewTime;
        reviewCount++;
      }
    });

    const avgReviewTime = reviewCount > 0 ? Math.round(totalReviewTime / reviewCount / (1000 * 60 * 60)) : 0;

    const metrics = {
      totalReviewed,
      approvalRate,
      pendingReviews,
      avgReviewTime
    };

    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching verifier metrics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
});

// Pending credits queue
router.get('/dashboard/pending-credits', auth, async (req, res) => {
  try {
    const pendingCredits = await Credit.find({ status: 'pending' })
      .populate('producerId', 'companyName')
      .sort({ createdAt: 1 });

    const formattedCredits = pendingCredits.map(credit => ({
      id: credit._id,
      tokenId: credit.tokenId,
      producer: credit.producerId?.companyName || 'Unknown',
      hydrogenAmount: credit.hydrogenAmount,
      carbonIntensity: credit.carbonIntensity,
      createdAt: credit.createdAt
    }));

    res.json({ success: true, data: formattedCredits });
  } catch (error) {
    console.error('Error fetching pending credits:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch pending credits' });
  }
});

// Verify credit
router.post('/credits/:creditId/verify', auth, async (req, res) => {
  try {
    const { action, verificationNotes } = req.body;
    const { creditId } = req.params;

    const credit = await Credit.findById(creditId);
    if (!credit) {
      return res.status(404).json({ success: false, message: 'Credit not found' });
    }

    if (credit.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Credit is not pending verification' });
    }

    credit.status = action === 'approve' ? 'verified' : 'rejected';
    credit.verifierId = req.user.id;
    credit.verifiedAt = new Date();
    credit.verificationNotes = verificationNotes;

    await credit.save();

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: `Credit ${action === 'approve' ? 'approved' : 'rejected'}`,
      resource: `Credit: ${credit.tokenId}`,
      severity: 'medium'
    });

    res.json({ success: true, data: credit });
  } catch (error) {
    console.error('Error verifying credit:', error);
    res.status(500).json({ success: false, message: 'Failed to verify credit' });
  }
});

// Get credit details
router.get('/credits/:creditId', auth, async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.creditId)
      .populate('producerId', 'companyName email')
      .populate('sensorId', 'sensorId location');

    if (!credit) {
      return res.status(404).json({ success: false, message: 'Credit not found' });
    }

    res.json({ success: true, data: credit });
  } catch (error) {
    console.error('Error fetching credit details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch credit details' });
  }
});

// Generate verification reports
router.get('/reports/verification', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const verifiedCredits = await Credit.find({
      verifierId: req.user.id,
      status: 'verified',
      verifiedAt: { $gte: start, $lte: end }
    }).populate('producerId', 'companyName');

    const rejectedCredits = await Credit.find({
      verifierId: req.user.id,
      status: 'rejected',
      verifiedAt: { $gte: start, $lte: end }
    }).populate('producerId', 'companyName');

    const report = {
      period: { start, end },
      totalVerified: verifiedCredits.length,
      totalRejected: rejectedCredits.length,
      totalVolume: verifiedCredits.reduce((sum, credit) => sum + credit.hydrogenAmount, 0),
      averageCarbonIntensity: verifiedCredits.length > 0 
        ? verifiedCredits.reduce((sum, credit) => sum + credit.carbonIntensity, 0) / verifiedCredits.length 
        : 0,
      verifiedCredits,
      rejectedCredits
    };

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating verification report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate verification report' });
  }
});

// Export verification data
router.get('/export/verification-data', auth, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const verificationData = await Credit.find({
      verifierId: req.user.id,
      status: { $in: ['verified', 'rejected'] }
    })
    .populate('producerId', 'companyName')
    .populate('sensorId', 'sensorId')
    .sort({ verifiedAt: -1 });

    const exportData = verificationData.map(credit => ({
      tokenId: credit.tokenId,
      producer: credit.producerId?.companyName || 'Unknown',
      hydrogenAmount: credit.hydrogenAmount,
      carbonIntensity: credit.carbonIntensity,
      status: credit.status,
      verifiedAt: credit.verifiedAt,
      verificationNotes: credit.verificationNotes,
      sensorId: credit.sensorId?.sensorId || 'Unknown'
    }));

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = ['Token ID', 'Producer', 'Hydrogen Amount (kg)', 'Carbon Intensity (kg CO₂/kg H₂)', 'Status', 'Verified At', 'Verification Notes', 'Sensor ID'];
      const csvRows = exportData.map(row => [
        row.tokenId,
        row.producer,
        row.hydrogenAmount,
        row.carbonIntensity,
        row.status,
        row.verifiedAt,
        row.verificationNotes,
        row.sensorId
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="verification-data.csv"');
      res.send(csvContent);
    } else {
      res.json({ success: true, data: exportData });
    }
  } catch (error) {
    console.error('Error exporting verification data:', error);
    res.status(500).json({ success: false, message: 'Failed to export verification data' });
  }
});

// Get verification history
router.get('/verification-history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const verificationHistory = await Credit.find({
      verifierId: req.user.id,
      status: { $in: ['verified', 'rejected'] }
    })
    .populate('producerId', 'companyName')
    .sort({ verifiedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Credit.countDocuments({
      verifierId: req.user.id,
      status: { $in: ['verified', 'rejected'] }
    });

    res.json({ 
      success: true, 
      data: verificationHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching verification history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch verification history' });
  }
});

module.exports = router;

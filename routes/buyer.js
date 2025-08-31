const express = require('express');
const router = express.Router();
const { authenticate: auth } = require('../middleware/auth');
const Credit = require('../models/Credit');
const MarketplaceListing = require('../models/MarketplaceListing');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

// Buyer dashboard metrics
router.get('/dashboard/metrics', auth, async (req, res) => {
  try {
    // Total purchased credits
    const purchasedCredits = await Credit.find({ 
      buyerId: req.user.id,
      status: { $in: ['owned', 'retired'] }
    });
    const totalPurchased = purchasedCredits.length;

    // Total spent
    const totalSpent = purchasedCredits.reduce((sum, credit) => sum + (credit.purchasePrice || 0), 0);

    // Compliance status
    const requiredCredits = req.user.requiredCredits || 1000; // Default requirement
    const purchasedAmount = purchasedCredits.reduce((sum, credit) => sum + credit.hydrogenAmount, 0);
    const retiredAmount = purchasedCredits.filter(c => c.status === 'retired')
      .reduce((sum, credit) => sum + credit.hydrogenAmount, 0);

    let complianceStatus = 'compliant';
    if (retiredAmount < requiredCredits * 0.8) {
      complianceStatus = 'non-compliant';
    } else if (retiredAmount < requiredCredits) {
      complianceStatus = 'pending';
    }

    const metrics = {
      totalPurchased,
      totalSpent,
      complianceStatus,
      purchasedCredits: purchasedAmount,
      requiredCredits,
      retiredCredits: retiredAmount
    };

    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching buyer metrics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
});

// Marketplace listings
router.get('/marketplace', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, filter } = req.query;
    const skip = (page - 1) * limit;

    let query = { status: 'available' };
    
    if (filter === 'rfnbo') {
      query.rfnboCompliant = true;
    } else if (filter === 'non-rfnbo') {
      query.rfnboCompliant = false;
    }

    const listings = await MarketplaceListing.find(query)
      .populate('creditId')
      .populate('producerId', 'companyName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await MarketplaceListing.countDocuments(query);

    const formattedListings = listings.map(listing => ({
      id: listing._id,
      tokenId: listing.creditId?.tokenId || 'Unknown',
      producer: listing.producerId?.companyName || 'Unknown',
      amount: listing.creditId?.hydrogenAmount || 0,
      carbonIntensity: listing.creditId?.carbonIntensity || 0,
      price: listing.price,
      rfnboCompliant: listing.rfnboCompliant,
      createdAt: listing.createdAt
    }));

    res.json({ 
      success: true, 
      data: formattedListings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace listings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch marketplace listings' });
  }
});

// Buy credit
router.post('/marketplace/:listingId/buy', auth, async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await MarketplaceListing.findById(listingId)
      .populate('creditId')
      .populate('producerId');

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Listing is not available' });
    }

    // Update credit ownership
    const credit = listing.creditId;
    credit.buyerId = req.user.id;
    credit.status = 'owned';
    credit.purchasePrice = listing.price;
    credit.purchasedAt = new Date();
    await credit.save();

    // Update listing status
    listing.status = 'sold';
    listing.buyerId = req.user.id;
    listing.soldAt = new Date();
    await listing.save();

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: 'Credit purchased',
      resource: `Credit: ${credit.tokenId}`,
      severity: 'medium'
    });

    res.json({ success: true, data: { credit, listing } });
  } catch (error) {
    console.error('Error buying credit:', error);
    res.status(500).json({ success: false, message: 'Failed to buy credit' });
  }
});

// Purchase history
router.get('/purchase-history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const purchasedCredits = await Credit.find({ 
      buyerId: req.user.id,
      status: { $in: ['owned', 'retired'] }
    })
    .populate('producerId', 'companyName')
    .sort({ purchasedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Credit.countDocuments({ 
      buyerId: req.user.id,
      status: { $in: ['owned', 'retired'] }
    });

    const formattedHistory = purchasedCredits.map(credit => ({
      id: credit._id,
      tokenId: credit.tokenId,
      producer: credit.producerId?.companyName || 'Unknown',
      amount: credit.hydrogenAmount,
      price: credit.purchasePrice,
      status: credit.status,
      purchasedAt: credit.purchasedAt,
      retiredAt: credit.retiredAt
    }));

    res.json({ 
      success: true, 
      data: formattedHistory,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch purchase history' });
  }
});

// Retire credit
router.post('/credits/:creditId/retire', auth, async (req, res) => {
  try {
    const { creditId } = req.params;
    const { retirementReason } = req.body;

    const credit = await Credit.findOne({ 
      _id: creditId, 
      buyerId: req.user.id,
      status: 'owned'
    });

    if (!credit) {
      return res.status(404).json({ success: false, message: 'Credit not found or not owned' });
    }

    credit.status = 'retired';
    credit.retiredAt = new Date();
    credit.retirementReason = retirementReason;
    await credit.save();

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: 'Credit retired',
      resource: `Credit: ${credit.tokenId}`,
      severity: 'medium'
    });

    res.json({ success: true, data: credit });
  } catch (error) {
    console.error('Error retiring credit:', error);
    res.status(500).json({ success: false, message: 'Failed to retire credit' });
  }
});

// Compliance report
router.get('/compliance-report', auth, async (req, res) => {
  try {
    const requiredCredits = req.user.requiredCredits || 1000;
    
    const purchasedCredits = await Credit.find({ 
      buyerId: req.user.id,
      status: { $in: ['owned', 'retired'] }
    });

    const totalPurchased = purchasedCredits.reduce((sum, credit) => sum + credit.hydrogenAmount, 0);
    const totalRetired = purchasedCredits.filter(c => c.status === 'retired')
      .reduce((sum, credit) => sum + credit.hydrogenAmount, 0);

    const compliancePercentage = (totalRetired / requiredCredits) * 100;
    const remainingRequired = Math.max(0, requiredCredits - totalRetired);

    const report = {
      requiredCredits,
      totalPurchased,
      totalRetired,
      compliancePercentage,
      remainingRequired,
      status: compliancePercentage >= 100 ? 'compliant' : 
              compliancePercentage >= 80 ? 'pending' : 'non-compliant',
      purchasedCredits: purchasedCredits.map(credit => ({
        tokenId: credit.tokenId,
        amount: credit.hydrogenAmount,
        status: credit.status,
        purchasedAt: credit.purchasedAt,
        retiredAt: credit.retiredAt
      }))
    };

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Error generating compliance report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate compliance report' });
  }
});

// Export portfolio
router.get('/export/portfolio', auth, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    const portfolio = await Credit.find({ 
      buyerId: req.user.id,
      status: { $in: ['owned', 'retired'] }
    })
    .populate('producerId', 'companyName')
    .sort({ purchasedAt: -1 });

    const exportData = portfolio.map(credit => ({
      tokenId: credit.tokenId,
      producer: credit.producerId?.companyName || 'Unknown',
      hydrogenAmount: credit.hydrogenAmount,
      carbonIntensity: credit.carbonIntensity,
      purchasePrice: credit.purchasePrice,
      status: credit.status,
      purchasedAt: credit.purchasedAt,
      retiredAt: credit.retiredAt,
      retirementReason: credit.retirementReason
    }));

    if (format === 'csv') {
      // Convert to CSV format
      const csvHeaders = ['Token ID', 'Producer', 'Hydrogen Amount (kg)', 'Carbon Intensity (kg CO₂/kg H₂)', 'Purchase Price ($)', 'Status', 'Purchased At', 'Retired At', 'Retirement Reason'];
      const csvRows = exportData.map(row => [
        row.tokenId,
        row.producer,
        row.hydrogenAmount,
        row.carbonIntensity,
        row.purchasePrice,
        row.status,
        row.purchasedAt,
        row.retiredAt,
        row.retirementReason
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="portfolio.csv"');
      res.send(csvContent);
    } else {
      res.json({ success: true, data: exportData });
    }
  } catch (error) {
    console.error('Error exporting portfolio:', error);
    res.status(500).json({ success: false, message: 'Failed to export portfolio' });
  }
});

// Get credit details
router.get('/credits/:creditId', auth, async (req, res) => {
  try {
    const credit = await Credit.findOne({ 
      _id: req.params.creditId, 
      buyerId: req.user.id 
    })
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

module.exports = router;

/**
 * 🔌 IoT Monitoring API Routes
 * Handles real-time carbon intensity monitoring and AI insights
 */

const express = require('express');
const router = express.Router();
const { authenticate: auth } = require('../middleware/auth');
const IoTSimulator = require('../services/iotSimulator');

// Initialize IoT Simulator
const iotSimulator = new IoTSimulator();

// Start simulation automatically when routes are loaded
iotSimulator.startSimulation(30000); // 30 seconds

/**
 * GET /api/iot/status
 * Get IoT simulation status
 */
router.get('/status', auth, async (req, res) => {
  try {
    const stats = iotSimulator.getSimulationStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting IoT status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get IoT status'
    });
  }
});

/**
 * GET /api/iot/dashboard
 * Get real-time monitoring dashboard data
 */
router.get('/dashboard', auth, async (req, res) => {
  try {
    const dashboardData = iotSimulator.getMonitoringDashboard();
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting IoT dashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get IoT dashboard'
    });
  }
});

/**
 * GET /api/iot/facilities
 * Get all facilities data
 */
router.get('/facilities', auth, async (req, res) => {
  try {
    const facilitiesData = iotSimulator.getAllFacilitiesData();
    res.json({
      success: true,
      data: facilitiesData
    });
  } catch (error) {
    console.error('Error getting facilities data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get facilities data'
    });
  }
});

/**
 * GET /api/iot/facilities/:id
 * Get specific facility data
 */
router.get('/facilities/:id', auth, async (req, res) => {
  try {
    const facilityId = parseInt(req.params.id);
    const facilityData = iotSimulator.getFacilityData(facilityId);
    
    if (!facilityData) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found'
      });
    }

    res.json({
      success: true,
      data: facilityData
    });
  } catch (error) {
    console.error('Error getting facility data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get facility data'
    });
  }
});

/**
 * GET /api/iot/facilities/:id/trends
 * Get carbon intensity trends for a facility
 */
router.get('/facilities/:id/trends', auth, async (req, res) => {
  try {
    const facilityId = parseInt(req.params.id);
    const hours = parseInt(req.query.hours) || 168; // Default 1 week
    
    const trends = iotSimulator.getCarbonIntensityTrends(facilityId, hours);
    
    res.json({
      success: true,
      data: {
        facilityId,
        hours,
        trends,
        totalDataPoints: trends.length
      }
    });
  } catch (error) {
    console.error('Error getting facility trends:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get facility trends'
    });
  }
});

/**
 * GET /api/iot/comparison
 * Get facility comparison data
 */
router.get('/comparison', auth, async (req, res) => {
  try {
    const comparison = iotSimulator.getFacilityComparison();
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error getting facility comparison:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get facility comparison'
    });
  }
});

/**
 * GET /api/iot/alerts
 * Get anomaly alerts
 */
router.get('/alerts', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const alerts = iotSimulator.getAnomalyAlerts(limit);
    
    res.json({
      success: true,
      data: {
        alerts,
        total: alerts.length,
        limit
      }
    });
  } catch (error) {
    console.error('Error getting alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get alerts'
    });
  }
});

/**
 * GET /api/iot/summary
 * Get environmental performance summary
 */
router.get('/summary', auth, async (req, res) => {
  try {
    const summary = iotSimulator.getEnvironmentalSummary();
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error getting environmental summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get environmental summary'
    });
  }
});

/**
 * POST /api/iot/simulation/start
 * Start IoT simulation
 */
router.post('/simulation/start', auth, async (req, res) => {
  try {
    const { interval } = req.body;
    const intervalMs = interval || 30000; // Default 30 seconds
    
    iotSimulator.startSimulation(intervalMs);
    
    res.json({
      success: true,
      message: 'IoT simulation started',
      data: {
        interval: intervalMs,
        status: 'running'
      }
    });
  } catch (error) {
    console.error('Error starting IoT simulation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start IoT simulation'
    });
  }
});

/**
 * POST /api/iot/simulation/stop
 * Stop IoT simulation
 */
router.post('/simulation/stop', auth, async (req, res) => {
  try {
    iotSimulator.stopSimulation();
    
    res.json({
      success: true,
      message: 'IoT simulation stopped',
      data: {
        status: 'stopped'
      }
    });
  } catch (error) {
    console.error('Error stopping IoT simulation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop IoT simulation'
    });
  }
});

/**
 * POST /api/iot/simulation/emergency
 * Simulate emergency scenario for testing
 */
router.post('/simulation/emergency', auth, async (req, res) => {
  try {
    const { facilityId } = req.body;
    
    if (!facilityId) {
      return res.status(400).json({
        success: false,
        error: 'Facility ID is required'
      });
    }

    const emergencyData = iotSimulator.simulateEmergencyScenario(facilityId);
    
    res.json({
      success: true,
      message: 'Emergency scenario simulated successfully',
      data: emergencyData
    });
  } catch (error) {
    console.error('Error simulating emergency scenario:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to simulate emergency scenario'
    });
  }
});

/**
 * GET /api/iot/analytics/carbon-intensity
 * Get carbon intensity analytics
 */
router.get('/analytics/carbon-intensity', auth, async (req, res) => {
  try {
    const { period = '24h', facilityId } = req.query;
    
    let analytics = {};
    
    if (facilityId) {
      // Single facility analytics
      const facilityData = iotSimulator.getFacilityData(parseInt(facilityId));
      if (facilityData) {
        analytics = {
          facilityId: parseInt(facilityId),
          facilityName: facilityData.facilityName,
          currentCarbonIntensity: facilityData.carbonIntensity,
          carbonClassification: facilityData.aiInsights?.carbonClassification,
          trend: facilityData.aiInsights?.trend,
          trendStrength: facilityData.aiInsights?.trendStrength,
          movingAverage24h: facilityData.aiInsights?.movingAverage24h?.carbonIntensity,
          environmentalScore: facilityData.aiInsights?.environmentalScore
        };
      }
    } else {
      // Overall analytics
      const allData = iotSimulator.getAllFacilitiesData();
      const carbonIntensities = allData.map(d => d.carbonIntensity);
      
      analytics = {
        totalFacilities: allData.length,
        averageCarbonIntensity: Math.round(
          carbonIntensities.reduce((sum, intensity) => sum + intensity, 0) / carbonIntensities.length * 10000
        ) / 10000,
        minCarbonIntensity: Math.min(...carbonIntensities),
        maxCarbonIntensity: Math.max(...carbonIntensities),
        facilitiesByClassification: {
          very_low: allData.filter(d => d.aiInsights?.carbonClassification === 'very_low').length,
          low: allData.filter(d => d.aiInsights?.carbonClassification === 'low').length,
          moderate: allData.filter(d => d.aiInsights?.carbonClassification === 'moderate').length,
          high: allData.filter(d => d.aiInsights?.carbonClassification === 'high').length,
          very_high: allData.filter(d => d.aiInsights?.carbonClassification === 'very_high').length
        }
      };
    }
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting carbon intensity analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get carbon intensity analytics'
    });
  }
});

/**
 * GET /api/iot/analytics/renewable-energy
 * Get renewable energy usage analytics
 */
router.get('/analytics/renewable-energy', auth, async (req, res) => {
  try {
    const allData = iotSimulator.getAllFacilitiesData();
    const renewablePercentages = allData.map(d => d.renewablePercentage);
    
    const analytics = {
      totalFacilities: allData.length,
      averageRenewablePercentage: Math.round(
        renewablePercentages.reduce((sum, pct) => sum + pct, 0) / renewablePercentages.length * 10
      ) / 10,
      minRenewablePercentage: Math.min(...renewablePercentages),
      maxRenewablePercentage: Math.max(...renewablePercentages),
      facilitiesByRenewableUsage: {
        excellent: allData.filter(d => d.renewablePercentage >= 80).length,
        good: allData.filter(d => d.renewablePercentage >= 60 && d.renewablePercentage < 80).length,
        moderate: allData.filter(d => d.renewablePercentage >= 40 && d.renewablePercentage < 60).length,
        poor: allData.filter(d => d.renewablePercentage < 40).length
      },
      topPerformers: allData
        .sort((a, b) => b.renewablePercentage - a.renewablePercentage)
        .slice(0, 3)
        .map(d => ({
          facilityId: d.facilityId,
          facilityName: d.facilityName,
          renewablePercentage: d.renewablePercentage,
          carbonIntensity: d.carbonIntensity
        }))
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting renewable energy analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get renewable energy analytics'
    });
  }
});

/**
 * GET /api/iot/analytics/efficiency
 * Get efficiency analytics
 */
router.get('/analytics/efficiency', auth, async (req, res) => {
  try {
    const allData = iotSimulator.getAllFacilitiesData();
    const efficiencies = allData.map(d => d.efficiency);
    
    const analytics = {
      totalFacilities: allData.length,
      averageEfficiency: Math.round(
        efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length * 10
      ) / 10,
      minEfficiency: Math.min(...efficiencies),
      maxEfficiency: Math.max(...efficiencies),
      facilitiesByEfficiency: {
        excellent: allData.filter(d => d.efficiency >= 80).length,
        good: allData.filter(d => d.efficiency >= 70 && d.efficiency < 80).length,
        average: allData.filter(d => d.efficiency >= 60 && d.efficiency < 70).length,
        below_average: allData.filter(d => d.efficiency < 60).length
      },
      efficiencyTrends: allData.map(d => ({
        facilityId: d.facilityId,
        facilityName: d.facilityName,
        efficiency: d.efficiency,
        efficiencyRating: d.aiInsights?.efficiencyRating
      }))
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error getting efficiency analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get efficiency analytics'
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const IoTSensor = require('../models/IoTSensor');
const IoTData = require('../models/IoTData');
const Credit = require('../models/Credit');
const AuditLog = require('../models/AuditLog');

// Producer dashboard metrics
router.get('/dashboard/metrics', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's production
    const todayData = await IoTData.find({
      producerId: req.user.id,
      timestamp: { $gte: today, $lt: tomorrow }
    });
    const todayProduction = todayData.reduce((sum, data) => sum + data.productionVolume, 0);

    // Current carbon intensity (latest reading)
    const latestData = await IoTData.findOne({
      producerId: req.user.id
    }).sort({ timestamp: -1 });
    const currentCarbonIntensity = latestData?.carbonIntensity || 0;

    // Total credits issued
    const totalCreditsIssued = await Credit.countDocuments({ producerId: req.user.id });

    // Sensor status
    const sensors = await IoTSensor.find({ producerId: req.user.id });
    const activeSensors = sensors.filter(s => s.status === 'active').length;
    const inactiveSensors = sensors.filter(s => s.status === 'inactive').length;
    const errorSensors = sensors.filter(s => s.status === 'error').length;

    // Pending verifications
    const pendingVerifications = await Credit.countDocuments({ 
      producerId: req.user.id, 
      status: 'pending' 
    });

    // Verified credits
    const verifiedCredits = await Credit.countDocuments({ 
      producerId: req.user.id, 
      status: 'verified' 
    });

    const metrics = {
      todayProduction,
      currentCarbonIntensity,
      totalCreditsIssued,
      activeSensors,
      inactiveSensors,
      errorSensors,
      pendingVerifications,
      verifiedCredits
    };

    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching producer metrics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch metrics' });
  }
});

// Production chart data (24-hour)
router.get('/dashboard/production-chart', auth, async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const chartData = [];
    for (let i = 0; i < 24; i++) {
      const hourStart = new Date(yesterday);
      hourStart.setHours(hourStart.getHours() + i);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);

      const hourData = await IoTData.find({
        producerId: req.user.id,
        timestamp: { $gte: hourStart, $lt: hourEnd }
      });

      const production = hourData.reduce((sum, data) => sum + data.productionVolume, 0);
      const avgCarbonIntensity = hourData.length > 0 
        ? hourData.reduce((sum, data) => sum + data.carbonIntensity, 0) / hourData.length 
        : 0;

      chartData.push({
        hour: hourStart.getHours(),
        production,
        carbonIntensity: avgCarbonIntensity
      });
    }

    res.json({ success: true, data: chartData });
  } catch (error) {
    console.error('Error fetching production chart:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch production chart' });
  }
});

// Recent production data
router.get('/dashboard/recent-data', auth, async (req, res) => {
  try {
    const recentData = await IoTData.find({ producerId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('sensorId', 'sensorId');

    const formattedData = recentData.map(data => ({
      id: data._id,
      timestamp: data.timestamp,
      productionVolume: data.productionVolume,
      carbonIntensity: data.carbonIntensity,
      sensorId: data.sensorId?.sensorId || 'Unknown',
      status: data.status
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error('Error fetching recent data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recent data' });
  }
});

// Sensor alerts
router.get('/dashboard/sensor-alerts', auth, async (req, res) => {
  try {
    const sensors = await IoTSensor.find({ producerId: req.user.id });
    const alerts = [];

    for (const sensor of sensors) {
      // Check for calibration due
      if (sensor.lastCalibration) {
        const daysSinceCalibration = Math.floor((Date.now() - sensor.lastCalibration.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCalibration >= 30) {
          alerts.push({
            id: `calibration-${sensor._id}`,
            sensorId: sensor.sensorId,
            type: 'warning',
            message: `Calibration due in ${30 - daysSinceCalibration} days`,
            timestamp: new Date()
          });
        }
      }

      // Check for maintenance due
      if (sensor.lastMaintenance) {
        const daysSinceMaintenance = Math.floor((Date.now() - sensor.lastMaintenance.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceMaintenance >= 90) {
          alerts.push({
            id: `maintenance-${sensor._id}`,
            sensorId: sensor.sensorId,
            type: 'warning',
            message: `Maintenance due in ${90 - daysSinceMaintenance} days`,
            timestamp: new Date()
          });
        }
      }

      // Check for errors
      if (sensor.status === 'error') {
        alerts.push({
          id: `error-${sensor._id}`,
          sensorId: sensor.sensorId,
          type: 'error',
          message: 'Sensor error detected',
          timestamp: new Date()
        });
      }
    }

    res.json({ success: true, data: alerts });
  } catch (error) {
    console.error('Error fetching sensor alerts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sensor alerts' });
  }
});

// Add sensor
router.post('/sensors', auth, async (req, res) => {
  try {
    const { sensorId, location, sensorType, specifications } = req.body;

    const sensor = new IoTSensor({
      producerId: req.user.id,
      sensorId,
      location,
      sensorType,
      specifications,
      status: 'active',
      lastCalibration: new Date(),
      lastMaintenance: new Date()
    });

    await sensor.save();

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: 'New sensor added',
      resource: `Sensor: ${sensorId}`,
      severity: 'low'
    });

    res.json({ success: true, data: sensor });
  } catch (error) {
    console.error('Error adding sensor:', error);
    res.status(500).json({ success: false, message: 'Failed to add sensor' });
  }
});

// Get sensors
router.get('/sensors', auth, async (req, res) => {
  try {
    const sensors = await IoTSensor.find({ producerId: req.user.id });
    res.json({ success: true, data: sensors });
  } catch (error) {
    console.error('Error fetching sensors:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sensors' });
  }
});

// Update sensor
router.put('/sensors/:sensorId', auth, async (req, res) => {
  try {
    const { location, status, lastCalibration, lastMaintenance } = req.body;
    
    const sensor = await IoTSensor.findOneAndUpdate(
      { _id: req.params.sensorId, producerId: req.user.id },
      { location, status, lastCalibration, lastMaintenance },
      { new: true }
    );

    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found' });
    }

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: 'Sensor updated',
      resource: `Sensor: ${sensor.sensorId}`,
      severity: 'low'
    });

    res.json({ success: true, data: sensor });
  } catch (error) {
    console.error('Error updating sensor:', error);
    res.status(500).json({ success: false, message: 'Failed to update sensor' });
  }
});

// Issue credits
router.post('/credits', auth, async (req, res) => {
  try {
    const { hydrogenAmount, carbonIntensity, sensorId, productionDate } = req.body;

    const credit = new Credit({
      producerId: req.user.id,
      hydrogenAmount,
      carbonIntensity,
      sensorId,
      productionDate: new Date(productionDate),
      status: 'pending',
      tokenId: `CREDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    await credit.save();

    // Log the action
    await AuditLog.create({
      userId: req.user.id,
      action: 'Credit issued',
      resource: `Credit: ${credit.tokenId}`,
      severity: 'medium'
    });

    res.json({ success: true, data: credit });
  } catch (error) {
    console.error('Error issuing credit:', error);
    res.status(500).json({ success: false, message: 'Failed to issue credit' });
  }
});

// Get producer credits
router.get('/credits', auth, async (req, res) => {
  try {
    const credits = await Credit.find({ producerId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: credits });
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch credits' });
  }
});

module.exports = router;

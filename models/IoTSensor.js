const mongoose = require('mongoose');

const iotSensorSchema = new mongoose.Schema({
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sensorId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['flow_meter', 'co2_sensor', 'temperature_sensor', 'pressure_sensor', 'energy_meter'],
    default: 'flow_meter'
  },
  publicKey: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error', 'maintenance'],
    default: 'active'
  },
  installedAt: {
    type: Date,
    default: Date.now
  },
  lastCalibratedAt: {
    type: Date,
    default: Date.now
  },
  calibrationInterval: {
    type: Number, // in days
    default: 30
  },
  metadata: {
    manufacturer: String,
    model: String,
    serialNumber: String,
    specifications: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
iotSensorSchema.index({ producerId: 1 });
iotSensorSchema.index({ sensorId: 1 });
iotSensorSchema.index({ status: 1 });
iotSensorSchema.index({ lastCalibratedAt: 1 });

// Instance method to check if calibration is due
iotSensorSchema.methods.isCalibrationDue = function() {
  const daysSinceCalibration = Math.floor((Date.now() - this.lastCalibratedAt) / (1000 * 60 * 60 * 24));
  return daysSinceCalibration >= this.calibrationInterval;
};

// Instance method to get sensor status
iotSensorSchema.methods.getStatus = function() {
  if (this.status === 'error') return 'error';
  if (this.isCalibrationDue()) return 'calibration_due';
  return this.status;
};

module.exports = mongoose.model('IoTSensor', iotSensorSchema);

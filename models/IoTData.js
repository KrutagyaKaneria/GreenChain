const mongoose = require('mongoose');

const iotDataSchema = new mongoose.Schema({
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IoTSensor',
    required: true
  },
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  productionVolume: {
    type: Number,
    required: true,
    min: 0,
    unit: 'kg' // hydrogen production in kilograms
  },
  carbonIntensity: {
    type: Number,
    required: true,
    min: 0,
    unit: 'kg CO2/kg H2' // carbon intensity per kg of hydrogen
  },
  energySource: {
    type: String,
    required: true,
    enum: ['renewable', 'nuclear', 'fossil_fuel', 'mixed'],
    default: 'renewable'
  },
  energyConsumption: {
    type: Number,
    unit: 'kWh',
    min: 0
  },
  temperature: {
    type: Number,
    unit: '°C'
  },
  pressure: {
    type: Number,
    unit: 'bar'
  },
  flowRate: {
    type: Number,
    unit: 'kg/h'
  },
  validated: {
    type: Boolean,
    default: false
  },
  validationMethod: {
    type: String,
    enum: ['sensor_signature', 'manual_review', 'ai_validation'],
    default: 'sensor_signature'
  },
  sensorSignature: {
    type: String,
    required: true,
    trim: true
  },
  blockchainTxHash: {
    type: String,
    trim: true
  },
  validationNotes: {
    type: String,
    trim: true
  },
  dataQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  flags: [{
    type: String,
    enum: ['anomaly_detected', 'calibration_needed', 'maintenance_required', 'data_gap']
  }]
}, {
  timestamps: true
});

// Indexes
iotDataSchema.index({ sensorId: 1, timestamp: -1 });
iotDataSchema.index({ producerId: 1, timestamp: -1 });
iotDataSchema.index({ timestamp: -1 });
iotDataSchema.index({ validated: 1 });
iotDataSchema.index({ carbonIntensity: 1 });
iotDataSchema.index({ productionVolume: 1 });

// Instance method to check if data meets credit issuance criteria
iotDataSchema.methods.meetsIssuanceCriteria = function() {
  return this.validated && 
         this.productionVolume >= 100 && // minimum 100kg production
         this.carbonIntensity <= 4.0; // maximum 4.0 kg CO2/kg H2 for green hydrogen
};

// Instance method to calculate carbon footprint
iotDataSchema.methods.calculateCarbonFootprint = function() {
  return this.productionVolume * this.carbonIntensity;
};

// Static method to get aggregated production data
iotDataSchema.statics.getAggregatedProduction = async function(producerId, startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        producerId: mongoose.Types.ObjectId(producerId),
        timestamp: { $gte: startDate, $lte: endDate },
        validated: true
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
        },
        totalProduction: { $sum: "$productionVolume" },
        avgCarbonIntensity: { $avg: "$carbonIntensity" },
        dataPoints: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);
};

module.exports = mongoose.model('IoTData', iotDataSchema);

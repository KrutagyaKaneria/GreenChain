/**
 * 🔌 IoT Simulator Service for Real-time Carbon Intensity Monitoring
 * Continuously generates and streams realistic sensor data
 */

const AIDataGenerator = require('./aiDataGenerator');

class IoTSimulator {
  constructor() {
    this.aiGenerator = new AIDataGenerator();
    this.isRunning = false;
    this.simulationInterval = null;
    this.dataCallbacks = [];
    this.facilityData = new Map();
    this.anomalyAlerts = [];
    
    // Initialize with some historical data
    this.initializeHistoricalData();
  }

  /**
   * Initialize with some historical data for realistic trends
   */
  initializeHistoricalData() {
    console.log('🔌 Initializing IoT Simulator with historical data...');
    
    // Generate 24 hours of historical data for each facility
    const now = new Date();
    for (let hour = 23; hour >= 0; hour--) {
      const timestamp = new Date(now.getTime() - hour * 60 * 60 * 1000);
      
      for (const facility of this.aiGenerator.facilities) {
        const data = this.aiGenerator.generateFacilityData(facility.id, timestamp);
        // Store without triggering callbacks
        this.aiGenerator.storeHistoricalData(facility.id, data);
      }
    }
    
    console.log('✅ Historical data initialized for all facilities');
  }

  /**
   * Start the IoT simulation
   */
  startSimulation(intervalMs = 30000) { // 30 seconds default
    if (this.isRunning) {
      console.log('⚠️ IoT simulation is already running');
      return;
    }

    console.log('🚀 Starting IoT simulation...');
    this.isRunning = true;

    // Generate initial data for all facilities
    this.generateAllFacilitiesData();

    // Start continuous simulation
    this.simulationInterval = setInterval(() => {
      this.generateAllFacilitiesData();
    }, intervalMs);

    console.log(`✅ IoT simulation started with ${intervalMs/1000}s intervals`);
  }

  /**
   * Stop the IoT simulation
   */
  stopSimulation() {
    if (!this.isRunning) {
      console.log('⚠️ IoT simulation is not running');
      return;
    }

    console.log('🛑 Stopping IoT simulation...');
    this.isRunning = false;

    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    console.log('✅ IoT simulation stopped');
  }

  /**
   * Generate data for all facilities
   */
  generateAllFacilitiesData() {
    const allData = this.aiGenerator.generateAllFacilitiesData();
    
    // Store current data for each facility
    for (const data of allData) {
      this.facilityData.set(data.facilityId, data);
      
      // Check for anomalies and generate alerts
      if (data.aiInsights?.isAnomaly) {
        this.generateAnomalyAlert(data);
      }
    }

    // Notify all registered callbacks
    this.notifyDataCallbacks(allData);

    // Log summary
    const timestamp = new Date().toLocaleTimeString();
    console.log(`📊 [${timestamp}] Generated data for ${allData.length} facilities`);
    
    // Log any anomalies
    const anomalies = allData.filter(d => d.aiInsights?.isAnomaly);
    if (anomalies.length > 0) {
      console.log(`🚨 [${timestamp}] ${anomalies.length} anomalies detected`);
    }

    return allData;
  }

  /**
   * Generate anomaly alert
   */
  generateAnomalyAlert(data) {
    const alert = {
      id: `alert_${Date.now()}_${data.facilityId}`,
      facilityId: data.facilityId,
      facilityName: data.facilityName,
      timestamp: new Date(),
      type: 'anomaly',
      severity: data.aiInsights.anomalyScore > 0.5 ? 'high' : 'medium',
      message: `Anomaly detected in ${data.facilityName}`,
      details: {
        carbonIntensity: data.carbonIntensity,
        expectedRange: `${data.aiInsights.movingAverage24h.carbonIntensity * 0.7} - ${data.aiInsights.movingAverage24h.carbonIntensity * 1.3}`,
        anomalyScore: data.aiInsights.anomalyScore,
        productionVolume: data.productionVolume,
        efficiency: data.efficiency
      }
    };

    this.anomalyAlerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.anomalyAlerts.length > 100) {
      this.anomalyAlerts = this.anomalyAlerts.slice(-100);
    }

    console.log(`🚨 Anomaly Alert: ${alert.message} (Score: ${alert.details.anomalyScore})`);
  }

  /**
   * Register callback for data updates
   */
  onDataUpdate(callback) {
    this.dataCallbacks.push(callback);
    return () => {
      const index = this.dataCallbacks.indexOf(callback);
      if (index > -1) {
        this.dataCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all registered callbacks
   */
  notifyDataCallbacks(data) {
    for (const callback of this.dataCallbacks) {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in data callback:', error);
      }
    }
  }

  /**
   * Get current data for a specific facility
   */
  getFacilityData(facilityId) {
    return this.facilityData.get(facilityId);
  }

  /**
   * Get current data for all facilities
   */
  getAllFacilitiesData() {
    return Array.from(this.facilityData.values());
  }

  /**
   * Get facility comparison data
   */
  getFacilityComparison() {
    return this.aiGenerator.getFacilityComparison();
  }

  /**
   * Get carbon intensity trends for a facility
   */
  getCarbonIntensityTrends(facilityId, hours = 168) {
    return this.aiGenerator.getCarbonIntensityTrends(facilityId, hours);
  }

  /**
   * Get anomaly alerts
   */
  getAnomalyAlerts(limit = 50) {
    return this.anomalyAlerts.slice(-limit);
  }

  /**
   * Get environmental performance summary
   */
  getEnvironmentalSummary() {
    const allData = this.getAllFacilitiesData();
    
    if (allData.length === 0) {
      return {
        totalFacilities: 0,
        averageEnvironmentalScore: 0,
        carbonIntensityRange: { min: 0, max: 0, avg: 0 },
        renewableEnergyUsage: { min: 0, max: 0, avg: 0 },
        efficiencyRange: { min: 0, max: 0, avg: 0 }
      };
    }

    const carbonIntensities = allData.map(d => d.carbonIntensity);
    const renewablePercentages = allData.map(d => d.renewablePercentage);
    const efficiencies = allData.map(d => d.efficiency);
    const environmentalScores = allData.map(d => d.aiInsights?.environmentalScore || 0);

    return {
      totalFacilities: allData.length,
      averageEnvironmentalScore: Math.round(
        environmentalScores.reduce((sum, score) => sum + score, 0) / environmentalScores.length
      ),
      carbonIntensityRange: {
        min: Math.min(...carbonIntensities),
        max: Math.max(...carbonIntensities),
        avg: Math.round(
          carbonIntensities.reduce((sum, intensity) => sum + intensity, 0) / carbonIntensities.length * 10000
        ) / 10000
      },
      renewableEnergyUsage: {
        min: Math.min(...renewablePercentages),
        max: Math.max(...renewablePercentages),
        avg: Math.round(
          renewablePercentages.reduce((sum, pct) => sum + pct, 0) / renewablePercentages.length * 10
        ) / 10
      },
      efficiencyRange: {
        min: Math.min(...efficiencies),
        max: Math.max(...efficiencies),
        avg: Math.round(
          efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length * 10
        ) / 10
      }
    };
  }

  /**
   * Get real-time monitoring dashboard data
   */
  getMonitoringDashboard() {
    const allData = this.getAllFacilitiesData();
    const comparison = this.getFacilityComparison();
    const summary = this.getEnvironmentalSummary();
    const recentAlerts = this.getAnomalyAlerts(10);

    return {
      timestamp: new Date(),
      summary,
      facilities: allData.map(data => ({
        id: data.facilityId,
        name: data.facilityName,
        type: data.facilityType,
        currentData: {
          carbonIntensity: data.carbonIntensity,
          productionVolume: data.productionVolume,
          renewablePercentage: data.renewablePercentage,
          efficiency: data.efficiency,
          environmentalScore: data.aiInsights?.environmentalScore || 0
        },
        aiInsights: data.aiInsights,
        status: data.aiInsights?.isAnomaly ? 'anomaly' : 'normal'
      })),
      comparison: comparison.map(facility => ({
        ...facility,
        rank: comparison.findIndex(f => f.facilityId === facility.facilityId) + 1
      })),
      recentAlerts,
      systemStatus: {
        isRunning: this.isRunning,
        totalFacilities: allData.length,
        anomaliesDetected: recentAlerts.length,
        lastUpdate: new Date()
      }
    };
  }

  /**
   * Simulate emergency scenario (for testing)
   */
  simulateEmergencyScenario(facilityId) {
    const facility = this.aiGenerator.facilities.find(f => f.id === facilityId);
    if (!facility) {
      throw new Error(`Facility ${facilityId} not found`);
    }

    console.log(`🚨 Simulating emergency scenario for ${facility.name}...`);

    // Generate emergency data with high carbon intensity
    const emergencyData = {
      ...this.aiGenerator.generateFacilityData(facilityId),
      carbonIntensity: 5.0 + Math.random() * 2, // Very high carbon intensity
      efficiency: 30 + Math.random() * 20, // Low efficiency
      renewablePercentage: 10 + Math.random() * 20, // Low renewable usage
      aiInsights: {
        ...this.aiGenerator.generateFacilityData(facilityId).aiInsights,
        isAnomaly: true,
        anomalyScore: 0.8 + Math.random() * 0.2,
        carbonClassification: 'very_high',
        environmentalScore: 20 + Math.random() * 30
      }
    };

    // Store emergency data
    this.facilityData.set(facilityId, emergencyData);
    this.generateAnomalyAlert(emergencyData);

    console.log(`✅ Emergency scenario simulated for ${facility.name}`);
    return emergencyData;
  }

  /**
   * Get simulation statistics
   */
  getSimulationStats() {
    const allData = this.getAllFacilitiesData();
    const totalDataPoints = this.aiGenerator.facilities.reduce((sum, facility) => {
      const historicalData = this.aiGenerator.getHistoricalContext(facility.id);
      return sum + historicalData.length;
    }, 0);

    return {
      isRunning: this.isRunning,
      totalFacilities: this.aiGenerator.facilities.length,
      totalDataPoints,
      anomalyAlerts: this.anomalyAlerts.length,
      lastUpdate: new Date(),
      uptime: this.isRunning ? 'active' : 'stopped'
    };
  }
}

module.exports = IoTSimulator;

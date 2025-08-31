/**
 * 🧠 AI-Powered IoT Data Generator for Carbon Intensity Monitoring
 * Generates realistic sensor data that mimics real hydrogen production scenarios
 */

class AIDataGenerator {
  constructor() {
    this.facilities = [
      { id: 1, name: 'GreenTech Mumbai', type: 'solar_heavy', baseIntensity: 0.5, renewablePct: 0.8 },
      { id: 2, name: 'CleanEnergy Gujarat', type: 'wind_heavy', baseIntensity: 0.3, renewablePct: 0.9 },
      { id: 3, name: 'HydroCorp Chennai', type: 'mixed_energy', baseIntensity: 1.2, renewablePct: 0.6 },
      { id: 4, name: 'EcoFuel Industries', type: 'grid_dependent', baseIntensity: 2.5, renewablePct: 0.3 },
      { id: 5, name: 'SolarTech Bangalore', type: 'solar_heavy', baseIntensity: 0.4, renewablePct: 0.85 }
    ];
    
    this.historicalData = new Map(); // Store historical data for each facility
    this.anomalyThresholds = new Map(); // Store anomaly detection thresholds
  }

  /**
   * Generate realistic production data for a facility
   */
  generateFacilityData(facilityId, timestamp = new Date()) {
    const facility = this.facilities.find(f => f.id === facilityId);
    if (!facility) {
      throw new Error(`Facility ${facilityId} not found`);
    }

    // Get historical context for this facility
    const historicalContext = this.getHistoricalContext(facilityId);
    
    // Generate current conditions
    const currentConditions = this.simulateCurrentConditions(timestamp, facility);
    
    // Calculate production metrics
    const productionData = this.calculateProductionMetrics(facility, currentConditions, historicalContext);
    
    // Add AI insights and anomaly detection
    const enhancedData = this.addAIInsights(productionData, historicalContext);
    
    // Store for historical analysis
    this.storeHistoricalData(facilityId, enhancedData);
    
    return enhancedData;
  }

  /**
   * Simulate current environmental and operational conditions
   */
  simulateCurrentConditions(timestamp, facility) {
    const hour = timestamp.getHours();
    const month = timestamp.getMonth();
    const dayOfYear = Math.floor((timestamp - new Date(timestamp.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Weather simulation with seasonal patterns
    const seasonalFactor = 0.8 + 0.4 * Math.sin((dayOfYear - 80) * 2 * Math.PI / 365);
    
    // Random weather events
    const weatherEvent = Math.random();
    let weatherFactor = seasonalFactor;
    
    if (weatherEvent < 0.05) { // 5% chance of bad weather
      weatherFactor *= 0.3;
    } else if (weatherEvent < 0.15) { // 10% chance of excellent weather
      weatherFactor = Math.min(1.0, seasonalFactor * 1.3);
    } else {
      weatherFactor *= (0.8 + 0.4 * Math.random());
    }

    // Time-of-day impact on solar availability
    let solarAvailability = 0.1;
    if (6 <= hour && hour <= 18) {
      solarAvailability = 0.7 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);
    }

    // Wind patterns (more random)
    const windAvailability = 0.3 + 0.6 * Math.random();

    // Calculate energy mix based on facility type
    let renewableActual, energySource;
    switch (facility.type) {
      case 'solar_heavy':
        renewableActual = facility.renewablePct * (0.8 * solarAvailability + 0.2 * windAvailability) * weatherFactor;
        energySource = 'Solar';
        break;
      case 'wind_heavy':
        renewableActual = facility.renewablePct * (0.2 * solarAvailability + 0.8 * windAvailability) * weatherFactor;
        energySource = 'Wind';
        break;
      case 'mixed_energy':
        renewableActual = facility.renewablePct * (0.5 * solarAvailability + 0.5 * windAvailability) * weatherFactor;
        energySource = 'Mixed Renewable';
        break;
      case 'grid_dependent':
        renewableActual = facility.renewablePct * (0.3 * solarAvailability + 0.3 * windAvailability) * weatherFactor;
        energySource = 'Grid';
        break;
      default:
        renewableActual = 0.5;
        energySource = 'Mixed';
    }

    return {
      weatherFactor,
      solarAvailability,
      windAvailability,
      renewableActual,
      energySource,
      temperature: 20 + 15 * Math.sin(dayOfYear * 2 * Math.PI / 365) + 5 * (Math.random() - 0.5),
      pressure: 1.0 + 0.1 * (Math.random() - 0.5),
      humidity: 40 + 30 * Math.random(),
      windSpeed: 2 + 8 * Math.random()
    };
  }

  /**
   * Calculate production metrics based on conditions
   */
  calculateProductionMetrics(facility, conditions, historicalContext) {
    const maxCapacity = 50; // MW
    
    // Production volume based on energy availability
    const productionVolume = maxCapacity * 
      (0.5 + 0.5 * conditions.renewableActual) * 
      (0.8 + 0.4 * Math.random());

    // Carbon intensity calculation
    const gridCarbonIntensity = 0.5; // kg CO2/kWh from grid
    const renewableCarbonIntensity = 0.02; // kg CO2/kWh from renewables
    
    const gridUsage = Math.max(0, 1 - conditions.renewableActual);
    
    const weightedCarbonIntensity = (
      conditions.renewableActual * renewableCarbonIntensity + 
      gridUsage * gridCarbonIntensity
    ) * (0.9 + 0.2 * Math.random()); // Add realistic noise

    // Efficiency factor based on facility age and maintenance
    const baseEfficiency = 0.65;
    const maintenanceFactor = 0.8 + 0.2 * Math.random();
    const efficiency = baseEfficiency * maintenanceFactor;

    // Final carbon intensity (kg CO2/kg H2)
    const carbonIntensity = weightedCarbonIntensity / efficiency;

    return {
      facilityId: facility.id,
      facilityName: facility.name,
      facilityType: facility.type,
      timestamp: new Date(),
      productionVolume: Math.round(productionVolume * 100) / 100,
      carbonIntensity: Math.round(carbonIntensity * 10000) / 10000,
      energySource: conditions.energySource,
      efficiency: Math.round(efficiency * 1000) / 10,
      temperature: Math.round(conditions.temperature * 10) / 10,
      pressure: Math.round(conditions.pressure * 1000) / 1000,
      humidity: Math.round(conditions.humidity * 10) / 10,
      windSpeed: Math.round(conditions.windSpeed * 10) / 10,
      renewablePercentage: Math.round(conditions.renewableActual * 1000) / 10,
      weatherFactor: Math.round(conditions.weatherFactor * 1000) / 1000,
      gridUsage: Math.round(gridUsage * 1000) / 10
    };
  }

  /**
   * Add AI insights and anomaly detection
   */
  addAIInsights(productionData, historicalContext) {
    const insights = {
      ...productionData,
      aiInsights: {}
    };

    // Calculate moving averages
    const recentData = historicalContext.slice(-24); // Last 24 hours
    if (recentData.length > 0) {
      const avgCarbonIntensity = recentData.reduce((sum, d) => sum + d.carbonIntensity, 0) / recentData.length;
      const avgProduction = recentData.reduce((sum, d) => sum + d.productionVolume, 0) / recentData.length;
      
      insights.aiInsights.movingAverage24h = {
        carbonIntensity: Math.round(avgCarbonIntensity * 10000) / 10000,
        productionVolume: Math.round(avgProduction * 100) / 100
      };

      // Anomaly detection
      const carbonDeviation = Math.abs(productionData.carbonIntensity - avgCarbonIntensity) / avgCarbonIntensity;
      const productionDeviation = Math.abs(productionData.productionVolume - avgProduction) / avgProduction;
      
      insights.aiInsights.anomalyScore = Math.round(
        (carbonDeviation * 0.7 + productionDeviation * 0.3) * 100
      ) / 100;

      insights.aiInsights.isAnomaly = insights.aiInsights.anomalyScore > 0.3;

      // Trend analysis
      if (recentData.length >= 2) {
        const recentTrend = recentData.slice(-6); // Last 6 hours
        const olderTrend = recentData.slice(-12, -6); // 6-12 hours ago
        
        const recentAvg = recentTrend.reduce((sum, d) => sum + d.carbonIntensity, 0) / recentTrend.length;
        const olderAvg = olderTrend.reduce((sum, d) => sum + d.carbonIntensity, 0) / olderTrend.length;
        
        insights.aiInsights.trend = recentAvg < olderAvg ? 'improving' : 'declining';
        insights.aiInsights.trendStrength = Math.round(
          Math.abs(recentAvg - olderAvg) / olderAvg * 100
        ) / 100;
      }

      // Efficiency rating
      const efficiencyRating = this.calculateEfficiencyRating(productionData, historicalContext);
      insights.aiInsights.efficiencyRating = efficiencyRating;
    }

    // Carbon intensity classification
    insights.aiInsights.carbonClassification = this.classifyCarbonIntensity(productionData.carbonIntensity);
    
    // Environmental impact score
    insights.aiInsights.environmentalScore = this.calculateEnvironmentalScore(productionData, historicalContext);

    return insights;
  }

  /**
   * Calculate efficiency rating based on historical performance
   */
  calculateEfficiencyRating(currentData, historicalContext) {
    if (historicalContext.length === 0) return 'unknown';
    
    const avgEfficiency = historicalContext.reduce((sum, d) => sum + d.efficiency, 0) / historicalContext.length;
    const currentEfficiency = currentData.efficiency;
    
    if (currentEfficiency >= avgEfficiency * 1.1) return 'excellent';
    if (currentEfficiency >= avgEfficiency * 1.05) return 'good';
    if (currentEfficiency >= avgEfficiency * 0.95) return 'average';
    if (currentEfficiency >= avgEfficiency * 0.9) return 'below_average';
    return 'poor';
  }

  /**
   * Classify carbon intensity levels
   */
  classifyCarbonIntensity(carbonIntensity) {
    if (carbonIntensity <= 0.5) return 'very_low';
    if (carbonIntensity <= 1.0) return 'low';
    if (carbonIntensity <= 2.0) return 'moderate';
    if (carbonIntensity <= 3.0) return 'high';
    return 'very_high';
  }

  /**
   * Calculate environmental impact score
   */
  calculateEnvironmentalScore(currentData, historicalContext) {
    if (historicalContext.length === 0) return 75;
    
    // Base score from renewable percentage
    let score = currentData.renewablePercentage;
    
    // Bonus for low carbon intensity
    if (currentData.carbonIntensity <= 0.5) score += 15;
    else if (currentData.carbonIntensity <= 1.0) score += 10;
    else if (currentData.carbonIntensity <= 2.0) score += 5;
    
    // Bonus for high efficiency
    if (currentData.efficiency >= 80) score += 10;
    else if (currentData.efficiency >= 70) score += 5;
    
    // Penalty for anomalies
    if (currentData.aiInsights?.isAnomaly) score -= 10;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Get historical context for a facility
   */
  getHistoricalContext(facilityId) {
    return this.historicalData.get(facilityId) || [];
  }

  /**
   * Store historical data for analysis
   */
  storeHistoricalData(facilityId, data) {
    if (!this.historicalData.has(facilityId)) {
      this.historicalData.set(facilityId, []);
    }
    
    const facilityData = this.historicalData.get(facilityId);
    facilityData.push(data);
    
    // Keep only last 168 hours (1 week) of data
    if (facilityData.length > 168) {
      facilityData.splice(0, facilityData.length - 168);
    }
  }

  /**
   * Generate data for all facilities
   */
  generateAllFacilitiesData() {
    const allData = [];
    
    for (const facility of this.facilities) {
      try {
        const data = this.generateFacilityData(facility.id);
        allData.push(data);
      } catch (error) {
        console.error(`Error generating data for facility ${facility.id}:`, error);
      }
    }
    
    return allData;
  }

  /**
   * Get facility comparison data
   */
  getFacilityComparison() {
    const comparison = [];
    
    for (const facility of this.facilities) {
      const historicalData = this.getHistoricalContext(facility.id);
      
      if (historicalData.length > 0) {
        const recentData = historicalData.slice(-24); // Last 24 hours
        
        const avgCarbonIntensity = recentData.reduce((sum, d) => sum + d.carbonIntensity, 0) / recentData.length;
        const avgProduction = recentData.reduce((sum, d) => sum + d.productionVolume, 0) / recentData.length;
        const avgEfficiency = recentData.reduce((sum, d) => sum + d.efficiency, 0) / recentData.length;
        const avgRenewable = recentData.reduce((sum, d) => sum + d.renewablePercentage, 0) / recentData.length;
        
        comparison.push({
          facilityId: facility.id,
          facilityName: facility.name,
          facilityType: facility.type,
          avgCarbonIntensity: Math.round(avgCarbonIntensity * 10000) / 10000,
          avgProduction: Math.round(avgProduction * 100) / 100,
          avgEfficiency: Math.round(avgEfficiency * 10) / 10,
          avgRenewable: Math.round(avgRenewable * 10) / 10,
          environmentalScore: this.calculateEnvironmentalScore(
            { carbonIntensity: avgCarbonIntensity, renewablePercentage: avgRenewable, efficiency: avgEfficiency },
            recentData
          ),
          carbonClassification: this.classifyCarbonIntensity(avgCarbonIntensity)
        });
      }
    }
    
    // Sort by environmental score (best first)
    return comparison.sort((a, b) => b.environmentalScore - a.environmentalScore);
  }

  /**
   * Get carbon intensity trends for a facility
   */
  getCarbonIntensityTrends(facilityId, hours = 168) { // 1 week
    const historicalData = this.getHistoricalContext(facilityId);
    
    if (historicalData.length === 0) return [];
    
    const recentData = historicalData.slice(-hours);
    
    return recentData.map(data => ({
      timestamp: data.timestamp,
      carbonIntensity: data.carbonIntensity,
      productionVolume: data.productionVolume,
      renewablePercentage: data.renewablePercentage,
      efficiency: data.efficiency,
      environmentalScore: data.aiInsights?.environmentalScore || 0
    }));
  }
}

module.exports = AIDataGenerator;

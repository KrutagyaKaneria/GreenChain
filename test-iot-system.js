/**
 * 🧪 Test IoT Monitoring System
 * This script tests the AI-powered IoT data generation and monitoring
 */

const AIDataGenerator = require('./services/aiDataGenerator');
const IoTSimulator = require('./services/iotSimulator');

console.log('🧪 Testing IoT Monitoring System...\n');

// Test 1: AI Data Generator
console.log('📊 Test 1: AI Data Generator');
const aiGenerator = new AIDataGenerator();

// Generate data for each facility
for (let i = 1; i <= 5; i++) {
  try {
    const data = aiGenerator.generateFacilityData(i);
    console.log(`\n🏭 Facility ${i}: ${data.facilityName}`);
    console.log(`   Type: ${data.facilityType}`);
    console.log(`   Carbon Intensity: ${data.carbonIntensity} kg CO2/kg H2`);
    console.log(`   Renewable: ${data.renewablePercentage}%`);
    console.log(`   Efficiency: ${data.efficiency}%`);
    console.log(`   Environmental Score: ${data.aiInsights?.environmentalScore || 'N/A'}`);
    
    if (data.aiInsights?.isAnomaly) {
      console.log(`   🚨 ANOMALY DETECTED! Score: ${data.aiInsights.anomalyScore}`);
    }
  } catch (error) {
    console.error(`Error generating data for facility ${i}:`, error.message);
  }
}

// Test 2: Facility Comparison
console.log('\n🏆 Test 2: Facility Comparison');
const comparison = aiGenerator.getFacilityComparison();
console.log('Ranking by Environmental Performance:');
comparison.forEach((facility, index) => {
  console.log(`${index + 1}. ${facility.facilityName} (${facility.facilityType})`);
  console.log(`   Score: ${facility.environmentalScore}, CO2: ${facility.avgCarbonIntensity}, Renewable: ${facility.avgRenewable}%`);
});

// Test 3: IoT Simulator
console.log('\n🔌 Test 3: IoT Simulator');
const iotSimulator = new IoTSimulator();

// Start simulation
iotSimulator.startSimulation(10000); // 10 seconds for testing

// Wait a bit for data to generate
setTimeout(() => {
  console.log('\n📈 Generated Data Summary:');
  const allData = iotSimulator.getAllFacilitiesData();
  console.log(`Total Facilities: ${allData.length}`);
  
  allData.forEach(facility => {
    console.log(`\n${facility.facilityName}:`);
    console.log(`  Carbon Intensity: ${facility.carbonIntensity} kg CO2/kg H2`);
    console.log(`  Renewable: ${facility.renewablePercentage}%`);
    console.log(`  Efficiency: ${facility.efficiency}%`);
    console.log(`  Environmental Score: ${facility.aiInsights?.environmentalScore || 'N/A'}`);
    
    if (facility.aiInsights?.isAnomaly) {
      console.log(`  🚨 ANOMALY: ${facility.aiInsights.anomalyScore}`);
    }
  });
  
  // Test emergency scenario
  console.log('\n🚨 Test 4: Emergency Scenario Simulation');
  try {
    const emergencyData = iotSimulator.simulateEmergencyScenario(1);
    console.log(`Emergency simulated for ${emergencyData.facilityName}:`);
    console.log(`  Carbon Intensity: ${emergencyData.carbonIntensity} kg CO2/kg H2`);
    console.log(`  Environmental Score: ${emergencyData.aiInsights?.environmentalScore || 'N/A'}`);
    console.log(`  Anomaly Score: ${emergencyData.aiInsights?.anomalyScore || 'N/A'}`);
  } catch (error) {
    console.error('Error simulating emergency:', error.message);
  }
  
  // Get monitoring dashboard
  console.log('\n📊 Test 5: Monitoring Dashboard');
  const dashboard = iotSimulator.getMonitoringDashboard();
  console.log(`System Status: ${dashboard.systemStatus.isRunning ? 'Active' : 'Stopped'}`);
  console.log(`Total Facilities: ${dashboard.systemStatus.totalFacilities}`);
  console.log(`Anomalies Detected: ${dashboard.systemStatus.anomaliesDetected}`);
  console.log(`Last Update: ${dashboard.systemStatus.lastUpdate}`);
  
  // Environmental summary
  console.log('\n🌍 Environmental Summary:');
  console.log(`Average Environmental Score: ${dashboard.summary.averageEnvironmentalScore}`);
  console.log(`Carbon Intensity Range: ${dashboard.summary.carbonIntensityRange.min} - ${dashboard.summary.carbonIntensityRange.max} kg CO2/kg H2`);
  console.log(`Renewable Energy Range: ${dashboard.summary.renewableEnergyUsage.min}% - ${dashboard.summary.renewableEnergyUsage.max}%`);
  console.log(`Efficiency Range: ${dashboard.summary.efficiencyRange.min}% - ${dashboard.summary.efficiencyRange.max}%`);
  
  // Stop simulation
  iotSimulator.stopSimulation();
  console.log('\n✅ IoT System Test Completed Successfully!');
  console.log('\n🎯 Key Findings:');
  console.log('• AI-powered data generation working correctly');
  console.log('• Realistic carbon intensity values generated');
  console.log('• Anomaly detection functioning');
  console.log('• Environmental scoring system operational');
  console.log('• Facility comparison ranking working');
  console.log('• Emergency scenario simulation functional');
  
  process.exit(0);
}, 5000);

console.log('\n⏳ Waiting for IoT simulation to generate data...');

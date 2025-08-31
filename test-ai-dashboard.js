const express = require('express');
const app = express();
const port = 5001;

app.use(express.json());

// Simulate real-time AI model data
let simulationData = {
  totalFacilities: 8,
  averageCarbonIntensity: 2.1,
  averageEnvironmentalScore: 78.5,
  averageRenewableEnergy: 65.2,
  averageEfficiency: 72.8,
  anomaliesDetected: 2,
  timestamp: new Date()
};

// Generate realistic variations for AI model
function generateAIVariation() {
  const variation = {
    totalFacilities: simulationData.totalFacilities,
    averageCarbonIntensity: Math.max(0.5, Math.min(4.0, 
      simulationData.averageCarbonIntensity + (Math.random() - 0.5) * 0.3)),
    averageEnvironmentalScore: Math.max(50, Math.min(95, 
      simulationData.averageEnvironmentalScore + (Math.random() - 0.5) * 2)),
    averageRenewableEnergy: Math.max(40, Math.min(90, 
      simulationData.averageRenewableEnergy + (Math.random() - 0.5) * 3)),
    averageEfficiency: Math.max(60, Math.min(85, 
      simulationData.averageEfficiency + (Math.random() - 0.5) * 2)),
    anomaliesDetected: Math.random() > 0.8 ? 
      Math.min(5, simulationData.anomaliesDetected + 1) : 
      Math.max(0, simulationData.anomaliesDetected - Math.random()),
    timestamp: new Date()
  };

  // Update base data
  simulationData = { ...variation };
  
  return variation;
}

// Real-time data endpoint (updates every 2 seconds)
app.get('/iot/real-time', (req, res) => {
  const data = generateAIVariation();
  
  console.log('🤖 AI Model Real-time Data:', {
    timestamp: data.timestamp.toLocaleTimeString(),
    carbonIntensity: data.averageCarbonIntensity.toFixed(2),
    envScore: data.averageEnvironmentalScore.toFixed(1),
    renewable: data.averageRenewableEnergy.toFixed(1),
    efficiency: data.averageEfficiency.toFixed(1),
    anomalies: data.anomaliesDetected
  });

  res.json({
    success: true,
    data: data
  });
});

// Dashboard data endpoint
app.get('/iot/dashboard', (req, res) => {
  const dashboardData = {
    systemStatus: {
      isRunning: true,
      totalFacilities: simulationData.totalFacilities,
      anomaliesDetected: simulationData.anomaliesDetected,
      lastUpdate: simulationData.timestamp
    },
    summary: {
      averageEnvironmentalScore: simulationData.averageEnvironmentalScore,
      carbonIntensityRange: {
        min: Math.max(0.5, simulationData.averageCarbonIntensity - 0.8),
        max: Math.min(4.0, simulationData.averageCarbonIntensity + 0.8),
        avg: simulationData.averageCarbonIntensity
      },
      renewableEnergyUsage: {
        min: Math.max(40, simulationData.averageRenewableEnergy - 15),
        max: Math.min(90, simulationData.averageRenewableEnergy + 15),
        avg: simulationData.averageRenewableEnergy
      },
      efficiencyRange: {
        min: Math.max(60, simulationData.averageEfficiency - 10),
        max: Math.min(85, simulationData.averageEfficiency + 10),
        avg: simulationData.averageEfficiency
      }
    },
    facilities: [
      {
        id: 1,
        name: 'Solar Hydrogen Plant Alpha',
        status: 'normal',
        currentData: {
          carbonIntensity: simulationData.averageCarbonIntensity + (Math.random() - 0.5) * 0.5,
          productionVolume: 150 + Math.random() * 50,
          renewablePercentage: simulationData.averageRenewableEnergy + (Math.random() - 0.5) * 10,
          efficiency: simulationData.averageEfficiency + (Math.random() - 0.5) * 5,
          environmentalScore: simulationData.averageEnvironmentalScore + (Math.random() - 0.5) * 8
        },
        aiInsights: {
          trend: Math.random() > 0.5 ? 'improving' : 'declining',
          isAnomaly: Math.random() > 0.9,
          anomalyScore: Math.random() * 100
        }
      },
      {
        id: 2,
        name: 'Wind Energy Facility Beta',
        status: 'normal',
        currentData: {
          carbonIntensity: simulationData.averageCarbonIntensity + (Math.random() - 0.5) * 0.5,
          productionVolume: 120 + Math.random() * 40,
          renewablePercentage: simulationData.averageRenewableEnergy + (Math.random() - 0.5) * 10,
          efficiency: simulationData.averageEfficiency + (Math.random() - 0.5) * 5,
          environmentalScore: simulationData.averageEnvironmentalScore + (Math.random() - 0.5) * 8
        },
        aiInsights: {
          trend: Math.random() > 0.5 ? 'improving' : 'declining',
          isAnomaly: Math.random() > 0.9,
          anomalyScore: Math.random() * 100
        }
      }
    ],
    comparison: [
      {
        facilityId: 1,
        facilityName: 'Solar Hydrogen Plant Alpha',
        facilityType: 'solar_heavy',
        avgCarbonIntensity: simulationData.averageCarbonIntensity - 0.3,
        avgRenewable: simulationData.averageRenewableEnergy + 5,
        avgEfficiency: simulationData.averageEfficiency + 3,
        environmentalScore: simulationData.averageEnvironmentalScore + 5
      },
      {
        facilityId: 2,
        facilityName: 'Wind Energy Facility Beta',
        facilityType: 'wind_heavy',
        avgCarbonIntensity: simulationData.averageCarbonIntensity - 0.1,
        avgRenewable: simulationData.averageRenewableEnergy + 2,
        avgEfficiency: simulationData.averageEfficiency + 1,
        environmentalScore: simulationData.averageEnvironmentalScore + 2
      }
    ],
    recentAlerts: simulationData.anomaliesDetected > 0 ? [
      {
        id: 1,
        severity: 'medium',
        message: 'Unusual carbon intensity pattern detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        details: {
          carbonIntensity: (simulationData.averageCarbonIntensity + 0.5).toFixed(2),
          expectedRange: `${(simulationData.averageCarbonIntensity - 0.3).toFixed(2)} - ${(simulationData.averageCarbonIntensity + 0.3).toFixed(2)}`
        }
      }
    ] : []
  };

  res.json({
    success: true,
    data: dashboardData
  });
});

// Simulation control endpoints
app.post('/iot/simulation/start', (req, res) => {
  console.log('🚀 AI Model Simulation Started');
  res.json({ success: true, message: 'AI Model simulation started' });
});

app.post('/iot/simulation/stop', (req, res) => {
  console.log('⏹️ AI Model Simulation Stopped');
  res.json({ success: true, message: 'AI Model simulation stopped' });
});

app.post('/iot/simulation/emergency', (req, res) => {
  console.log('🚨 Emergency scenario simulated for facility:', req.body.facilityId);
  res.json({ success: true, message: 'Emergency scenario simulated' });
});

app.listen(port, () => {
  console.log(`🤖 AI Model Dashboard Test Server running on port ${port}`);
  console.log(`📊 Real-time data updates every 2 seconds`);
  console.log(`🌐 Dashboard available at: http://localhost:${port}/iot/dashboard`);
  console.log(`🔄 Real-time endpoint: http://localhost:${port}/iot/real-time`);
  console.log('\n📈 Sample AI Model Data:');
  console.log('   • Carbon Intensity: 0.5 - 4.0 kg CO2/kg H2');
  console.log('   • Environmental Score: 50 - 95');
  console.log('   • Renewable Energy: 40% - 90%');
  console.log('   • Efficiency: 60% - 85%');
  console.log('   • Anomaly Detection: AI-powered pattern recognition');
});

// Simulate real-time data updates
setInterval(() => {
  generateAIVariation();
}, 2000);


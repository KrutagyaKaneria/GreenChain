import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Activity, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Database, Zap, Leaf, Gauge, BarChart3, RefreshCw, Play, Pause,
  Eye, EyeOff, Thermometer, Wind, Droplets, Sun, Cloud, Cpu,
  Target, Award, Clock, AlertCircle, Brain, Sparkles, Globe
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const IoTMonitoringDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState('running');
  const [notification, setNotification] = useState(null);
  const [realTimeData, setRealTimeData] = useState([]);
  const [chartData, setChartData] = useState({
    carbonIntensity: [],
    environmentalScore: [],
    renewableEnergy: [],
    efficiency: []
  });

  // Chart canvas refs
  const carbonChartRef = useRef(null);
  const scoreChartRef = useRef(null);
  const renewableChartRef = useRef(null);
  const efficiencyChartRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
    
    // Real-time data update every 2 seconds
    const realTimeInterval = setInterval(fetchRealTimeData, 2000);
    
    // Dashboard refresh every 30 seconds
    const dashboardInterval = setInterval(fetchDashboardData, 30000);
    
    return () => {
      clearInterval(realTimeInterval);
      clearInterval(dashboardInterval);
    };
  }, []);

  // Update charts when real-time data changes
  useEffect(() => {
    if (realTimeData.length > 0) {
      updateCharts();
    }
  }, [realTimeData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/iot/dashboard');
      setDashboardData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching IoT dashboard:', error);
      setNotification({
        type: 'error',
        message: 'Failed to fetch IoT dashboard data'
      });
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await api.get('/iot/real-time');
      const newData = response.data.data;
      
      setRealTimeData(prev => {
        const updated = [...prev, { ...newData, timestamp: new Date() }];
        // Keep only last 50 data points for smooth charts
        return updated.slice(-50);
      });

      // Update chart data
      setChartData(prev => ({
        carbonIntensity: [...prev.carbonIntensity.slice(-49), newData.averageCarbonIntensity],
        environmentalScore: [...prev.environmentalScore.slice(-49), newData.averageEnvironmentalScore],
        renewableEnergy: [...prev.renewableEnergy.slice(-49), newData.averageRenewableEnergy],
        efficiency: [...prev.efficiency.slice(-49), newData.averageEfficiency]
      }));
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const updateCharts = () => {
    // Update Carbon Intensity Chart
    updateLineChart(carbonChartRef.current, chartData.carbonIntensity, 
      'Carbon Intensity (kg CO2/kg H2)', '#ef4444', '#dc2626');
    
    // Update Environmental Score Chart
    updateLineChart(scoreChartRef.current, chartData.environmentalScore, 
      'Environmental Score', '#10b981', '#059669');
    
    // Update Renewable Energy Chart
    updateLineChart(renewableChartRef.current, chartData.renewableEnergy, 
      'Renewable Energy (%)', '#3b82f6', '#2563eb');
    
    // Update Efficiency Chart
    updateLineChart(efficiencyChartRef.current, chartData.efficiency, 
      'Efficiency (%)', '#f59e0b', '#d97706');
  };

  const updateLineChart = (canvas, data, label, primaryColor, secondaryColor) => {
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([5, 5]);

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 10; i++) {
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Find data range
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Draw line chart
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index;
      const y = height - ((value - min) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw area fill
    ctx.fillStyle = `${primaryColor}20`;
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index;
      const y = height - ((value - min) / range) * height;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Draw data points
    ctx.fillStyle = secondaryColor;
    data.forEach((value, index) => {
      const x = (width / (data.length - 1)) * index;
      const y = height - ((value - min) / range) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = min + (range / 5) * i;
      const y = height - (i / 5) * height;
      ctx.fillText(value.toFixed(2), 30, y + 4);
    }

    // X-axis label
    ctx.fillText(label, width / 2, height - 10);
  };

  const handleSimulationControl = async (action) => {
    try {
      if (action === 'start') {
        await api.post('/iot/simulation/start');
        setSimulationStatus('running');
        setNotification({
          type: 'success',
          message: 'AI Model Simulation started successfully'
        });
      } else {
        await api.post('/iot/simulation/stop');
        setSimulationStatus('stopped');
        setNotification({
          type: 'success',
          message: 'AI Model Simulation stopped successfully'
        });
      }
      fetchDashboardData();
    } catch (error) {
      console.error('Error controlling simulation:', error);
      setNotification({
        type: 'error',
        message: `Failed to ${action} simulation`
      });
    }
  };

  const handleEmergencySimulation = async (facilityId) => {
    try {
      await api.post('/iot/simulation/emergency', { facilityId });
      setNotification({
        type: 'success',
        message: 'Emergency scenario simulated successfully'
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error simulating emergency:', error);
      setNotification({
        type: 'error',
        message: 'Failed to simulate emergency scenario'
      });
    }
  };

  const getCarbonIntensityColor = (intensity) => {
    if (intensity <= 0.5) return 'text-green-400';
    if (intensity <= 1.0) return 'text-blue-400';
    if (intensity <= 2.0) return 'text-yellow-400';
    if (intensity <= 3.0) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCarbonIntensityBadge = (intensity) => {
    if (intensity <= 0.5) return { text: 'Very Low', color: 'bg-green-500/20 text-green-400' };
    if (intensity <= 1.0) return { text: 'Low', color: 'bg-blue-500/20 text-blue-400' };
    if (intensity <= 2.0) return { text: 'Moderate', color: 'bg-yellow-500/20 text-yellow-400' };
    if (intensity <= 3.0) return { text: 'High', color: 'bg-orange-500/20 text-orange-400' };
    return { text: 'Very High', color: 'bg-red-500/20 text-red-400' };
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-400';
    if (efficiency >= 70) return 'text-blue-400';
    if (efficiency >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRenewableColor = (percentage) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-blue-400';
    if (percentage >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" color="green" />
          <p className="text-gray-300 mt-4 text-lg">Loading AI Model Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-gray-300">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No AI Model data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🤖 <span className="gradient-text">AI Model Results</span> Dashboard
            </h1>
            <p className="text-xl text-gray-300">Real-time carbon intensity monitoring with AI-powered insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">AI Status</div>
              <div className="text-white font-semibold capitalize">{simulationStatus}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="modern-card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🔄 Real-time AI Model Status</h2>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live Data</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="btn-outline flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            {simulationStatus === 'running' ? (
              <button
                onClick={() => handleSimulationControl('stop')}
                className="btn-primary bg-red-500 hover:bg-red-600 flex items-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>Stop AI</span>
              </button>
            ) : (
              <button
                onClick={() => handleSimulationControl('start')}
                className="btn-primary bg-green-500 hover:bg-green-600 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start AI</span>
              </button>
            )}
          </div>
        </div>
        
        <div className="modern-grid-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeData.length > 0 ? realTimeData[realTimeData.length - 1].totalFacilities : 0}
            </div>
            <div className="text-gray-400">Active Facilities</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeData.length > 0 ? realTimeData[realTimeData.length - 1].averageEnvironmentalScore?.toFixed(1) : 0}
            </div>
            <div className="text-gray-400">Avg Env Score</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeData.length > 0 ? realTimeData[realTimeData.length - 1].anomaliesDetected : 0}
            </div>
            <div className="text-gray-400">Anomalies</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {realTimeData.length > 0 ? new Date(realTimeData[realTimeData.length - 1].timestamp).toLocaleTimeString() : '--:--:--'}
            </div>
            <div className="text-gray-400">Last Update</div>
          </div>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="modern-grid-2 gap-8 mb-8">
        {/* Carbon Intensity Chart */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">📊 Carbon Intensity Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">kg CO2/kg H2</span>
            </div>
          </div>
          <div className="relative h-64">
            <canvas
              ref={carbonChartRef}
              className="w-full h-full"
              width={600}
              height={256}
            />
            {realTimeData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Waiting for AI model data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Environmental Score Chart */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">🎯 Environmental Score Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Score (0-100)</span>
            </div>
          </div>
          <div className="relative h-64">
            <canvas
              ref={scoreChartRef}
              className="w-full h-full"
              width={600}
              height={256}
            />
            {realTimeData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Waiting for AI model data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="modern-grid-2 gap-8 mb-8">
        {/* Renewable Energy Chart */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">🌱 Renewable Energy Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Percentage (%)</span>
            </div>
          </div>
          <div className="relative h-64">
            <canvas
              ref={renewableChartRef}
              className="w-full h-full"
              width={600}
              height={256}
            />
            {realTimeData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Leaf className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Waiting for AI model data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Efficiency Chart */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">⚡ Production Efficiency Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">Percentage (%)</span>
            </div>
          </div>
          <div className="relative h-64">
            <canvas
              ref={efficiencyChartRef}
              className="w-full h-full"
              width={600}
              height={256}
            />
            {realTimeData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Waiting for AI model data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Model Insights */}
      <div className="modern-card p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🧠 AI Model Insights</h2>
        <div className="modern-grid-3">
          <div className="text-center p-6 bg-white/5 rounded-lg hover-lift">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Carbon Reduction</h3>
            <p className="text-gray-300 text-sm">
              AI predicts {realTimeData.length > 0 ? ((realTimeData[0]?.averageCarbonIntensity - realTimeData[realTimeData.length - 1]?.averageCarbonIntensity) * 100 / realTimeData[0]?.averageCarbonIntensity).toFixed(1) : 0}% improvement
            </p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-lg hover-lift">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Anomaly Detection</h3>
            <p className="text-gray-300 text-sm">
              {realTimeData.length > 0 ? realTimeData[realTimeData.length - 1].anomaliesDetected : 0} patterns identified
            </p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-lg hover-lift">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Optimization</h3>
            <p className="text-gray-300 text-sm">
              AI suggests efficiency improvements up to {realTimeData.length > 0 ? (100 - realTimeData[realTimeData.length - 1]?.averageEfficiency).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Facility Performance */}
      {dashboardData?.facilities && (
        <div className="modern-card p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🏭 Facility Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {dashboardData.facilities.map((facility) => (
              <div key={facility.id} className="modern-card p-4 hover-lift">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{facility.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    facility.status === 'anomaly' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {facility.status === 'anomaly' ? '🚨 Anomaly' : '✅ Normal'}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Carbon Intensity:</span>
                    <span className={`font-medium ${getCarbonIntensityColor(facility.currentData?.carbonIntensity)}`}>
                      {facility.currentData?.carbonIntensity?.toFixed(2) || 'N/A'} kg CO2/kg H2
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Production:</span>
                    <span className="font-medium text-white">
                      {facility.currentData?.productionVolume || 'N/A'} MW
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Renewable:</span>
                    <span className={`font-medium ${getRenewableColor(facility.currentData?.renewablePercentage)}`}>
                      {facility.currentData?.renewablePercentage || 'N/A'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Efficiency:</span>
                    <span className={`font-medium ${getEfficiencyColor(facility.currentData?.efficiency)}`}>
                      {facility.currentData?.efficiency || 'N/A'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Env Score:</span>
                    <span className="font-medium text-purple-400">
                      {facility.currentData?.environmentalScore || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => setSelectedFacility(facility)}
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleEmergencySimulation(facility.id)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                    title="Simulate emergency scenario"
                  >
                    🚨
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      {dashboardData?.recentAlerts && dashboardData.recentAlerts.length > 0 && (
        <div className="modern-card p-6">
          <h2 className="text-2xl font-bold text-white mb-6">🚨 Recent AI Alerts</h2>
          <div className="space-y-4">
            {dashboardData.recentAlerts.map((alert) => (
              <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${
                alert.severity === 'high' ? 'border-red-500 bg-red-500/10' : 'border-orange-500 bg-orange-500/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{alert.message}</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="text-gray-400">Carbon Intensity: </span>
                      <span className="font-medium text-white">{alert.details?.carbonIntensity} kg CO2/kg H2</span>
                      <span className="text-gray-400 ml-2">Expected: </span>
                      <span className="font-medium text-white">{alert.details?.expectedRange}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    alert.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {alert.severity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {notification && (
        <div className="fixed bottom-6 right-6 modern-card p-4 animate-slide-up">
          <div className={`flex items-center space-x-3 ${
            notification.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IoTMonitoringDashboard;

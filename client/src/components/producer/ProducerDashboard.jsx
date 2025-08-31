import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Activity,
  TrendingUp,
  Shield,
  AlertTriangle,
  Plus,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Eye,
  Download,
  Zap,
  Leaf,
  Globe,
  Database,
  Users,
  Award,
  Target,
  Gauge,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Battery,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const ProducerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalCredits: 0,
    verifiedCredits: 0,
    pendingVerifications: 0,
    totalSensors: 0,
    activeSensors: 0,
    productionEfficiency: 0,
    carbonIntensity: 0,
    environmentalScore: 0
  });
  const [recentCredits, setRecentCredits] = useState([]);
  const [recentData, setRecentData] = useState([]);
  const [sensorAlerts, setSensorAlerts] = useState([]);
  const [productionChart, setProductionChart] = useState([]);

  // Modal states
  const [showSensorModal, setShowSensorModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showSensorManagementModal, setShowSensorManagementModal] = useState(false);
  const [showDataDetailsModal, setShowDataDetailsModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [metricsRes, creditsRes, dataRes, alertsRes, chartRes] = await Promise.all([
        api.get('/producer/metrics'),
        api.get('/producer/credits'),
        api.get('/producer/data'),
        api.get('/producer/alerts'),
        api.get('/producer/chart')
      ]);

      setMetrics(metricsRes.data.data);
      setRecentCredits(creditsRes.data.data);
      setRecentData(dataRes.data.data);
      setSensorAlerts(alertsRes.data.data);
      setProductionChart(chartRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    try {
      setActionLoading(true);
      setErrorMessage('');

      switch (action) {
        case 'add-sensor':
          setShowSensorModal(true);
          break;
        case 'issue-credits':
          setShowCreditModal(true);
          break;
        case 'sensor-management':
          setShowSensorManagementModal(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error in quick action:', error);
      setErrorMessage('Failed to perform action');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    // TODO: Show alert details modal
  };

  const handleDataClick = (data) => {
    setSelectedData(data);
    setShowDataDetailsModal(true);
  };

  const handleChartClick = (data, index) => {
    console.log('Chart data clicked:', data, 'at index:', index);
    // TODO: Show detailed chart view or data analysis
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" color="green" />
          <p className="text-gray-300 mt-4 text-lg">Loading your producer dashboard...</p>
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
              Welcome back, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-xl text-gray-300">Monitor your green hydrogen production and manage credits</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Role</div>
              <div className="text-white font-semibold capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="modern-grid-2 mb-8">
        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.totalCredits.toLocaleString()}</div>
          <div className="text-gray-400">Total Credits Issued</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.verifiedCredits.toLocaleString()}</div>
          <div className="text-gray-400">Verified Credits</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.pendingVerifications}</div>
          <div className="text-gray-400">Pending Verifications</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <Activity className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.totalSensors}</div>
          <div className="text-gray-400">Active Sensors</div>
        </div>
      </div>

      {/* Environmental Metrics */}
      <div className="modern-grid-3 mb-8">
        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.productionEfficiency}%</div>
          <div className="text-gray-400">Production Efficiency</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Thermometer className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.carbonIntensity} kg CO2/kg H2</div>
          <div className="text-gray-400">Carbon Intensity</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.environmentalScore}/100</div>
          <div className="text-gray-400">Environmental Score</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="modern-grid-3">
          <button
            onClick={() => handleQuickAction('add-sensor')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Add Sensor</h3>
            <p className="text-gray-300 text-sm">Register new IoT sensor</p>
          </button>

          <button
            onClick={() => handleQuickAction('issue-credits')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Issue Credits</h3>
            <p className="text-gray-300 text-sm">Generate new credits</p>
          </button>

          <button
            onClick={() => handleQuickAction('sensor-management')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Sensor Management</h3>
            <p className="text-gray-300 text-sm">Configure & monitor sensors</p>
          </button>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="modern-grid-2 gap-8">
        {/* Recent Credits */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Credits</h2>
            <button className="text-green-400 hover:text-green-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentCredits.slice(0, 5).map((credit, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${credit.status === 'verified' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <div>
                    <div className="text-white font-medium">{credit.amount} kg H2</div>
                    <div className="text-gray-400 text-sm">{credit.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${credit.status === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {credit.status}
                  </div>
                  <div className="text-gray-400 text-xs">{credit.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor Alerts */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Sensor Alerts</h2>
            <button className="text-red-400 hover:text-red-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {sensorAlerts.slice(0, 5).map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${alert.severity === 'high' ? 'bg-red-400' : alert.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                  <div>
                    <div className="text-white font-medium">{alert.sensorName}</div>
                    <div className="text-gray-400 text-sm">{alert.message}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${alert.severity === 'high' ? 'text-red-400' : alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {alert.severity}
                  </div>
                  <div className="text-gray-400 text-xs">{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Data Chart */}
      <div className="modern-card p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Production Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Sun className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Solar</div>
            <div className="text-gray-400 text-sm">45%</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Wind className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Wind</div>
            <div className="text-gray-400 text-sm">30%</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Battery className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Storage</div>
            <div className="text-gray-400 text-sm">15%</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Droplets className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Grid</div>
            <div className="text-gray-400 text-sm">10%</div>
          </div>
        </div>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Production chart visualization</p>
            <p className="text-sm">Click to view detailed analytics</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 modern-card p-4 animate-slide-up">
          <div className="flex items-center space-x-3 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 modern-card p-4 animate-slide-up">
          <div className="flex items-center space-x-3 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Modals would go here - Add Sensor, Issue Credits, etc. */}
    </div>
  );
};

export default ProducerDashboard;

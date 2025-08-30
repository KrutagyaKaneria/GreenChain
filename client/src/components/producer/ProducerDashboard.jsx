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
  XCircle
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const ProducerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    todayProduction: 0,
    currentCarbonIntensity: 0,
    totalCreditsIssued: 0,
    activeSensors: 0,
    inactiveSensors: 0,
    errorSensors: 0,
    pendingVerifications: 0,
    verifiedCredits: 0
  });
  const [recentData, setRecentData] = useState([]);
  const [sensorAlerts, setSensorAlerts] = useState([]);
  const [productionChart, setProductionChart] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const response = await api.get('/producer/dashboard');
      // setMetrics(response.data);
      
      // Mock data for now
      setMetrics({
        todayProduction: 1250.5,
        currentCarbonIntensity: 2.1,
        totalCreditsIssued: 45,
        activeSensors: 8,
        inactiveSensors: 1,
        errorSensors: 0,
        pendingVerifications: 3,
        verifiedCredits: 42
      });

      setRecentData([
        {
          id: 1,
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          productionVolume: 125.5,
          carbonIntensity: 2.1,
          sensorId: 'SENSOR-001',
          status: 'validated'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          productionVolume: 118.2,
          carbonIntensity: 2.0,
          sensorId: 'SENSOR-002',
          status: 'validated'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          productionVolume: 132.8,
          carbonIntensity: 2.2,
          sensorId: 'SENSOR-001',
          status: 'pending'
        }
      ]);

      setSensorAlerts([
        {
          id: 1,
          sensorId: 'SENSOR-003',
          type: 'warning',
          message: 'Calibration due in 2 days',
          timestamp: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
          id: 2,
          sensorId: 'SENSOR-005',
          type: 'info',
          message: 'Maintenance completed successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 120)
        }
      ]);

      // Mock production chart data
      const chartData = [];
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(Date.now() - i * 60 * 60 * 1000);
        chartData.push({
          hour: hour.getHours(),
          production: Math.random() * 100 + 50,
          carbonIntensity: Math.random() * 1 + 1.5
        });
      }
      setProductionChart(chartData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'validated': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Producer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.companyName}. Monitor your hydrogen production and credit status.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Production</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.todayProduction.toFixed(1)} kg</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">+5.2% vs yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Carbon Intensity</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.currentCarbonIntensity} kg CO₂/kg H₂</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">RFNBO compliant</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalCreditsIssued}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-yellow-600">{metrics.pendingVerifications} pending verification</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sensor Status</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeSensors}/{metrics.activeSensors + metrics.inactiveSensors + metrics.errorSensors}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-red-600">{metrics.errorSensors} errors</span>
            </div>
          </div>
        </div>

        {/* Production Chart and Sensor Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Production Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Production</h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {productionChart.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${(data.production / 150) * 200}px` }}></div>
                  <span className="text-xs text-gray-500">{data.hour}:00</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Production Volume (kg) over 24 hours</p>
            </div>
          </div>

          {/* Sensor Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sensor Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Active Sensors</span>
                </div>
                <span className="text-lg font-bold text-green-600">{metrics.activeSensors}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Inactive Sensors</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{metrics.inactiveSensors}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Error Sensors</span>
                </div>
                <span className="text-lg font-bold text-red-600">{metrics.errorSensors}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Data and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Production Data */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Production Data</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentData.map((data) => (
                  <div key={data.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(data.status)}`}>
                        {data.status === 'validated' && <CheckCircle className="h-4 w-4" />}
                        {data.status === 'pending' && <Clock className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{data.productionVolume} kg</p>
                        <p className="text-sm text-gray-600">{data.carbonIntensity} kg CO₂/kg H₂</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-900">{data.sensorId}</p>
                      <p className="text-xs text-gray-500">
                        {data.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sensor Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sensor Alerts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {sensorAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Sensor: {alert.sensorId} • {alert.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Plus className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Add Sensor</h4>
                <p className="text-sm text-gray-600">Register new IoT sensor</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Issue Credits</h4>
                <p className="text-sm text-gray-600">Create new hydrogen credits</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Sensor Management</h4>
                <p className="text-sm text-gray-600">Configure and calibrate sensors</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;

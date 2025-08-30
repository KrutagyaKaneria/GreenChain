import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Shield, 
  TrendingUp, 
  Activity, 
  Settings, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import NotificationToast from '../common/NotificationToast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSensors: 0,
    activeSensors: 0,
    totalCredits: 0,
    verifiedCredits: 0,
    pendingVerifications: 0,
    marketplaceVolume: 0,
    systemHealth: 'healthy'
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      // const response = await api.get('/admin/dashboard/metrics');
      // setMetrics(response.data);
      
      // Mock data for now
      setMetrics({
        totalUsers: 1250,
        activeUsers: 1180,
        totalSensors: 456,
        activeSensors: 432,
        totalCredits: 8900,
        verifiedCredits: 8200,
        pendingVerifications: 45,
        marketplaceVolume: 1250000,
        systemHealth: 'healthy'
      });

      setRecentActivity([
        {
          id: 1,
          action: 'Credit Verified',
          user: 'HydroGen Corp',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          status: 'success'
        },
        {
          id: 2,
          action: 'New User Registration',
          user: 'GreenTech Solutions',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          status: 'info'
        },
        {
          id: 3,
          action: 'Sensor Anomaly Detected',
          user: 'EcoFuel Industries',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          status: 'warning'
        }
      ]);

      setSystemAlerts([
        {
          id: 1,
          type: 'warning',
          message: '3 sensors require calibration',
          timestamp: new Date(Date.now() - 1000 * 60 * 120)
        },
        {
          id: 2,
          type: 'info',
          message: 'System backup completed successfully',
          timestamp: new Date(Date.now() - 1000 * 60 * 180)
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.companyName}. Here's what's happening with your platform.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">+{metrics.activeUsers} active</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Sensors</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeSensors}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">of {metrics.totalSensors} total</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Credits</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.verifiedCredits.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-yellow-600">{metrics.pendingVerifications} pending</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Marketplace Volume</p>
                <p className="text-2xl font-bold text-gray-900">${(metrics.marketplaceVolume / 1000000).toFixed(1)}M</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">+12.5% this month</span>
            </div>
          </div>
        </div>

        {/* System Health and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Health */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="flex items-center mb-4">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                metrics.systemHealth === 'healthy' ? 'bg-green-500' : 
                metrics.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-900 capitalize">{metrics.systemHealth}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">API Response Time</span>
                <span className="text-green-600">45ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Database Connections</span>
                <span className="text-green-600">12/20</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Blockchain Sync</span>
                <span className="text-green-600">Up to date</span>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      {activity.status === 'success' && <CheckCircle className="h-4 w-4" />}
                      {activity.status === 'warning' && <AlertTriangle className="h-4 w-4" />}
                      {activity.status === 'info' && <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">by {activity.user}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {activity.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">System Settings</h4>
                <p className="text-sm text-gray-600">Configure platform parameters</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">User Management</h4>
                <p className="text-sm text-gray-600">Manage users and permissions</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Reports & Analytics</h4>
                <p className="text-sm text-gray-600">View detailed reports</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

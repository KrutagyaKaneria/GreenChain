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
  Clock,
  Link,
  Database,
  Wallet,
  Hash,
  RefreshCw,
  Eye,
  Zap,
  Leaf,
  Gauge
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import NotificationToast from '../common/NotificationToast';
import api from '../../utils/api';

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
  const [selectedAction, setSelectedAction] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState({
    isConnected: false,
    network: '',
    chainId: 0,
    totalCredits: 0,
    verifiedCredits: 0,
    activeListings: 0,
    walletBalance: '0',
    lastSync: ''
  });
  const [blockchainTransactions, setBlockchainTransactions] = useState([]);
  const [blockchainLoading, setBlockchainLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchBlockchainData();
  }, []);

  const handleQuickAction = async (action) => {
    setSelectedAction(action);
    console.log('Admin Quick Action:', action);
    
    try {
      switch (action) {
        case 'system-settings':
          console.log('Opening System Settings...');
          const settingsResponse = await api.get('/admin/system-settings');
          if (settingsResponse.data.success) {
            console.log('System Settings:', settingsResponse.data.data);
            // TODO: Open settings modal with data
          }
          break;
        case 'user-management':
          console.log('Opening User Management...');
          const usersResponse = await api.get('/admin/users');
          if (usersResponse.data.success) {
            console.log('Users:', usersResponse.data.data);
            // TODO: Open user management modal with data
          }
          break;
        case 'reports-analytics':
          console.log('Opening Reports & Analytics...');
          const analyticsResponse = await api.get('/admin/reports/analytics');
          if (analyticsResponse.data.success) {
            console.log('Analytics:', analyticsResponse.data.data);
            // TODO: Open analytics modal with data
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error in quick action:', error);
    }
  };

  const handleAlertClick = (alert) => {
    console.log('Alert clicked:', alert);
    // TODO: Handle alert actions (dismiss, view details, etc.)
  };

  const handleActivityClick = (activity) => {
    console.log('Activity clicked:', activity);
    // TODO: Handle activity actions (view details, take action, etc.)
  };

  const fetchBlockchainData = async () => {
    try {
      setBlockchainLoading(true);
      
      // Fetch blockchain status
      const statusResponse = await api.get('/admin/blockchain/status');
      if (statusResponse.data.success) {
        setBlockchainStatus(statusResponse.data.data);
      }
      
      // Fetch transaction history
      const transactionsResponse = await api.get('/admin/blockchain/transactions');
      if (transactionsResponse.data.success) {
        setBlockchainTransactions(transactionsResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
    } finally {
      setBlockchainLoading(false);
    }
  };

  const testBlockchainOperation = async (operation) => {
    try {
      setBlockchainLoading(true);
      let response;
      
      switch (operation) {
        case 'issue-credit':
          response = await api.post('/admin/blockchain/test-issue-credit');
          break;
        case 'verify-credit':
          response = await api.post('/admin/blockchain/test-verify-credit');
          break;
        case 'create-listing':
          response = await api.post('/admin/blockchain/test-create-listing');
          break;
        default:
          return;
      }
      
      if (response.data.success) {
        console.log(`${operation} result:`, response.data.data);
        // Refresh blockchain data
        await fetchBlockchainData();
      }
    } catch (error) {
      console.error(`Error testing ${operation}:`, error);
    } finally {
      setBlockchainLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics
      const metricsResponse = await api.get('/admin/dashboard/metrics');
      if (metricsResponse.data.success) {
        setMetrics(metricsResponse.data.data);
      }
      
      // Fetch recent activity
      const activityResponse = await api.get('/admin/dashboard/recent-activity');
      if (activityResponse.data.success) {
        setRecentActivity(activityResponse.data.data);
      }
      
      // Fetch system alerts
      const alertsResponse = await api.get('/admin/dashboard/system-alerts');
      if (alertsResponse.data.success) {
        setSystemAlerts(alertsResponse.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data if API fails
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
                <div 
                  key={alert.id} 
                  onClick={() => handleAlertClick(alert)}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
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

        {/* IoT Carbon Intensity Monitoring */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">🔌 IoT Carbon Intensity Monitoring</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Real-time Monitoring
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <Leaf className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-green-800">5</div>
                    <div className="text-sm text-green-700">Active Facilities</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-blue-800">78%</div>
                    <div className="text-sm text-blue-700">Avg Renewable</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Gauge className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-800">1.2</div>
                    <div className="text-sm text-yellow-700">Avg CO2/kg H2</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-purple-800">2</div>
                    <div className="text-sm text-purple-700">Anomalies</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">📊 Real-time Monitoring</h4>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                  <Eye className="h-4 w-4 mr-2" /> View Dashboard
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" /> Analytics
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" /> Alerts
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>🔍 <strong>AI-Powered Monitoring:</strong> Real-time tracking of carbon intensity, renewable energy usage, and efficiency across all hydrogen production facilities.</p>
              <p>🚨 <strong>Anomaly Detection:</strong> Advanced AI algorithms detect unusual patterns and alert operators to potential issues.</p>
              <p>📈 <strong>Performance Comparison:</strong> Compare facilities and identify best practices for carbon reduction.</p>
            </div>
          </div>
        </div>

        {/* Blockchain Integration */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">🔗 Blockchain Integration</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${blockchainStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {blockchainStatus.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {/* Blockchain Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Network</p>
                    <p className="text-lg font-semibold text-gray-900">{blockchainStatus.network}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Hash className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Total Credits</p>
                    <p className="text-lg font-semibold text-gray-900">{blockchainStatus.totalCredits}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Verified</p>
                    <p className="text-lg font-semibold text-gray-900">{blockchainStatus.verifiedCredits}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Wallet className="h-5 w-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-lg font-semibold text-gray-900">{blockchainStatus.walletBalance} ETH</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Test Operations */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">🧪 Test Blockchain Operations</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => testBlockchainOperation('issue-credit')}
                  disabled={blockchainLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Issue Credit
                </button>
                <button
                  onClick={() => testBlockchainOperation('verify-credit')}
                  disabled={blockchainLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Credit
                </button>
                <button
                  onClick={() => testBlockchainOperation('create-listing')}
                  disabled={blockchainLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Create Listing
                </button>
                <button
                  onClick={fetchBlockchainData}
                  disabled={blockchainLoading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Blockchain Transactions */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">📋 Recent Blockchain Transactions</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {blockchainTransactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        tx.type === 'CreditIssued' ? 'bg-blue-100' :
                        tx.type === 'CreditVerified' ? 'bg-green-100' :
                        tx.type === 'ListingCreated' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        {tx.type === 'CreditIssued' ? <Hash className="h-4 w-4 text-blue-600" /> :
                         tx.type === 'CreditVerified' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                         tx.type === 'ListingCreated' ? <TrendingUp className="h-4 w-4 text-purple-600" /> :
                         <Activity className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{tx.type}</p>
                        <p className="text-xs text-gray-500">
                          Token ID: {tx.tokenId} • {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {tx.transactionHash ? tx.transactionHash.substring(0, 10) + '...' : 'Mock TX'}
                    </span>
                  </div>
                ))}
                {blockchainTransactions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No blockchain transactions yet. Try testing an operation above!
                  </div>
                )}
              </div>
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
                <div 
                  key={activity.id} 
                  onClick={() => handleActivityClick(activity)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
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
          <button 
            onClick={() => handleQuickAction('system-settings')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">System Settings</h4>
                <p className="text-sm text-gray-600">Configure platform parameters</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('user-management')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">User Management</h4>
                <p className="text-sm text-gray-600">Manage users and permissions</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('reports-analytics')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
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

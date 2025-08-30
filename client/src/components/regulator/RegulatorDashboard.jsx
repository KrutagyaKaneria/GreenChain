import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Users,
  BarChart3,
  Download,
  Eye,
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const RegulatorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalCredits: 0,
    verifiedCredits: 0,
    tradedCredits: 0,
    retiredCredits: 0,
    activeProducers: 0,
    activeBuyers: 0,
    complianceRate: 0,
    systemUptime: 0
  });
  const [complianceSummary, setComplianceSummary] = useState([]);
  const [recentAuditLogs, setRecentAuditLogs] = useState([]);
  const [suspiciousActivities, setSuspiciousActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for now
      setMetrics({
        totalCredits: 12500,
        verifiedCredits: 11800,
        tradedCredits: 8900,
        retiredCredits: 7200,
        activeProducers: 45,
        activeBuyers: 32,
        complianceRate: 94.5,
        systemUptime: 99.8
      });

      setComplianceSummary([
        {
          id: 1,
          buyer: 'SteelCorp Industries',
          industry: 'steel',
          requiredCredits: 100,
          purchasedCredits: 95,
          retiredCredits: 90,
          status: 'compliant'
        },
        {
          id: 2,
          buyer: 'AmmoniaTech Ltd',
          industry: 'ammonia',
          requiredCredits: 75,
          purchasedCredits: 70,
          retiredCredits: 65,
          status: 'pending'
        },
        {
          id: 3,
          buyer: 'Transport Solutions',
          industry: 'transport',
          requiredCredits: 50,
          purchasedCredits: 45,
          retiredCredits: 40,
          status: 'non-compliant'
        }
      ]);

      setRecentAuditLogs([
        {
          id: 1,
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          user: 'HydroGen Corp',
          role: 'producer',
          action: 'Credit Issued',
          resource: 'CREDIT-001',
          severity: 'low'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          user: 'GreenTech Solutions',
          role: 'verifier',
          action: 'Credit Verified',
          resource: 'CREDIT-002',
          severity: 'low'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          user: 'SteelCorp Industries',
          role: 'buyer',
          action: 'Credit Purchased',
          resource: 'CREDIT-003',
          severity: 'low'
        }
      ]);

      setSuspiciousActivities([
        {
          id: 1,
          type: 'warning',
          message: 'Unusual trading pattern detected',
          details: 'Rapid buy/sell of same credit within 1 hour',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          severity: 'medium'
        },
        {
          id: 2,
          type: 'info',
          message: 'New producer registration',
          details: 'EcoFuel Industries registered with mixed energy source',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          severity: 'low'
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleEnforcementAction = (buyerId, action) => {
    console.log(`Taking enforcement action ${action} on buyer ${buyerId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Regulator Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.companyName}. Monitor platform compliance and regulatory oversight.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalCredits.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">{metrics.verifiedCredits.toLocaleString()} verified</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.complianceRate}%</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">Platform-wide</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Participants</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeProducers + metrics.activeBuyers}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">{metrics.activeProducers} producers, {metrics.activeBuyers} buyers</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.systemUptime}%</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">High availability</span>
            </div>
          </div>
        </div>

        {/* Compliance Monitoring */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Buyer Compliance Summary</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {complianceSummary.map((buyer) => (
                <div key={buyer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{buyer.buyer}</p>
                      <p className="text-xs text-gray-500 capitalize">{buyer.industry}</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">Required: {buyer.requiredCredits}</p>
                      <p className="text-xs text-gray-600">Credits</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">Purchased: {buyer.purchasedCredits}</p>
                      <p className="text-xs text-gray-600">Credits</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">Retired: {buyer.retiredCredits}</p>
                      <p className="text-xs text-gray-600">Credits</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(buyer.status)}`}>
                        {buyer.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {buyer.status === 'non-compliant' && (
                      <button
                        onClick={() => handleEnforcementAction(buyer.id, 'suspend')}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Audit Logs */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentAuditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(log.severity)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-600">{log.user} ({log.role})</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {log.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suspicious Activities */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Suspicious Activities</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {suspiciousActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getSeverityIcon(activity.severity)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.timestamp.toLocaleTimeString()}
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
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Generate Reports</h4>
                <p className="text-sm text-gray-600">Create compliance reports</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Enforcement Actions</h4>
                <p className="text-sm text-gray-600">Manage compliance violations</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <Download className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-600">Download regulatory data</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboard;

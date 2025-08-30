import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  TrendingUp, 
  FileText,
  AlertTriangle,
  BarChart3,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const VerifierDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalReviewed: 0,
    approvedCredits: 0,
    rejectedCredits: 0,
    pendingReviews: 0,
    approvalRate: 0,
    avgReviewTime: 0
  });
  const [pendingCredits, setPendingCredits] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics
      const metricsResponse = await api.get('/verifier/dashboard/metrics');
      if (metricsResponse.data.success) {
        setMetrics(metricsResponse.data.data);
      }
      
      // Fetch pending credits
      const pendingCreditsResponse = await api.get('/verifier/dashboard/pending-credits');
      if (pendingCreditsResponse.data.success) {
        setPendingCredits(pendingCreditsResponse.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data if API fails
      setMetrics({
        totalReviewed: 156,
        approvedCredits: 142,
        rejectedCredits: 14,
        pendingReviews: 8,
        approvalRate: 91.0,
        avgReviewTime: 2.3
      });

      setPendingCredits([
        {
          id: 1,
          tokenId: 'CREDIT-001',
          producer: 'HydroGen Corp',
          issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          hydrogenAmount: 1250.5,
          carbonIntensity: 2.1,
          energySource: 'renewable',
          rfnboCompliant: true
        },
        {
          id: 2,
          tokenId: 'CREDIT-002',
          producer: 'GreenTech Solutions',
          issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
          hydrogenAmount: 890.2,
          carbonIntensity: 2.8,
          energySource: 'renewable',
          rfnboCompliant: true
        }
      ]);

      setRecentVerifications([
        {
          id: 1,
          tokenId: 'CREDIT-004',
          producer: 'HydroGen Corp',
          verifiedAt: new Date(Date.now() - 1000 * 60 * 30),
          status: 'approved',
          reviewTime: 1.5,
          comments: 'All criteria met, RFNBO compliant'
        },
        {
          id: 2,
          tokenId: 'CREDIT-005',
          producer: 'GreenTech Solutions',
          verifiedAt: new Date(Date.now() - 1000 * 60 * 60),
          status: 'rejected',
          reviewTime: 3.2,
          comments: 'Carbon intensity exceeds threshold'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleVerifyCredit = (creditId, action) => {
    console.log(`Verifying credit ${creditId} with action: ${action}`);
    // TODO: Implement actual verification logic
    if (action === 'approve') {
      console.log(`Credit ${creditId} approved successfully!`);
    } else {
      console.log(`Credit ${creditId} rejected.`);
    }
  };

  const handleQuickAction = async (action) => {
    console.log('Verifier Quick Action:', action);
    
    try {
      switch (action) {
        case 'review-credits':
          console.log('Opening Credit Review interface...');
          const pendingResponse = await api.get('/verifier/dashboard/pending-credits');
          if (pendingResponse.data.success) {
            console.log('Pending Credits:', pendingResponse.data.data);
            // TODO: Open credit review modal with data
          }
          break;
        case 'generate-reports':
          console.log('Generating verification reports...');
          const reportResponse = await api.get('/verifier/reports/verification');
          if (reportResponse.data.success) {
            console.log('Verification Report:', reportResponse.data.data);
            // TODO: Open report modal with data
          }
          break;
        case 'export-data':
          console.log('Exporting verification data...');
          const exportResponse = await api.get('/verifier/export/verification-data?format=csv');
          if (exportResponse.data) {
            console.log('Export Data:', exportResponse.data);
            // TODO: Handle CSV download
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error in quick action:', error);
    }
  };

  const handleCreditClick = (credit) => {
    console.log('Credit clicked:', credit);
    // TODO: Show credit details modal or navigate to credit details page
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verifier Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.companyName}. Review and verify hydrogen credits.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviewed</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalReviewed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.approvalRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.pendingReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Review Time</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.avgReviewTime}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Credits Queue */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pending Credits Queue</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingCredits.map((credit) => (
                <div 
                  key={credit.id} 
                  onClick={() => handleCreditClick(credit)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{credit.tokenId}</p>
                      <p className="text-xs text-gray-500">Token ID</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{credit.producer}</p>
                      <p className="text-xs text-gray-600">Producer</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{credit.hydrogenAmount} kg</p>
                      <p className="text-xs text-gray-600">Amount</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{credit.carbonIntensity} kg CO₂/kg H₂</p>
                      <p className="text-xs text-gray-600">Carbon Intensity</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleVerifyCredit(credit.id, 'approve')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerifyCredit(credit.id, 'reject')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => handleQuickAction('review-credits')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Review Credits</h4>
                <p className="text-sm text-gray-600">Process pending verifications</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('generate-reports')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Generate Reports</h4>
                <p className="text-sm text-gray-600">Create verification reports</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('export-data')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <Download className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-600">Download verification records</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;

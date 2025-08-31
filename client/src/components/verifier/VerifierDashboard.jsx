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
  Filter,
  X,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Award,
  Target,
  Gauge,
  Thermometer,
  Leaf,
  Users,
  Database,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const VerifierDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalVerifications: 0,
    approvedCredits: 0,
    rejectedCredits: 0,
    pendingVerifications: 0,
    averageProcessingTime: 0,
    verificationAccuracy: 0,
    complianceRate: 0,
    totalCreditsReviewed: 0
  });
  const [pendingCredits, setPendingCredits] = useState([]);
  const [recentVerifications, setRecentVerifications] = useState([]);

  // Modal states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showCreditDetailsModal, setShowCreditDetailsModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationDecision, setVerificationDecision] = useState('');

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
      const [metricsRes, pendingRes, recentRes] = await Promise.all([
        api.get('/verifier/metrics'),
        api.get('/verifier/pending-credits'),
        api.get('/verifier/recent-verifications')
      ]);

      setMetrics(metricsRes.data.data);
      setPendingCredits(pendingRes.data.data);
      setRecentVerifications(recentRes.data.data);
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
        case 'review-pending':
          // Show pending credits list
          break;
        case 'generate-report':
          // Generate verification report
          break;
        case 'compliance-check':
          // Run compliance check
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

  const handleCreditClick = (credit) => {
    setSelectedCredit(credit);
    setShowCreditDetailsModal(true);
  };

  const handleVerifyCredit = async (creditId, decision) => {
    try {
      setActionLoading(true);
      setErrorMessage('');

      const response = await api.post(`/verifier/credits/${creditId}/${decision}`, {
        notes: verificationNotes,
        decision: decision
      });

      if (response.data.success) {
        setSuccessMessage(`Credit ${decision === 'approve' ? 'approved' : 'rejected'} successfully!`);
        setShowVerificationModal(false);
        setVerificationNotes('');
        setVerificationDecision('');

        // Refresh data
        await fetchDashboardData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error verifying credit:', error);
      setErrorMessage(error.response?.data?.message || `Failed to ${decision} credit`);
    } finally {
      setActionLoading(false);
    }
  };

  const openVerificationModal = (credit, decision) => {
    setSelectedCredit(credit);
    setVerificationDecision(decision);
    setShowVerificationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" color="blue" />
          <p className="text-gray-300 mt-4 text-lg">Loading your verifier dashboard...</p>
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
              Welcome back, <span className="gradient-text-blue">{user?.name}</span>
            </h1>
            <p className="text-xl text-gray-300">Verify and audit green hydrogen credits with precision</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.totalVerifications.toLocaleString()}</div>
          <div className="text-gray-400">Total Verifications</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.approvedCredits.toLocaleString()}</div>
          <div className="text-gray-400">Approved Credits</div>
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
              <Target className="w-6 h-6 text-white" />
            </div>
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.verificationAccuracy}%</div>
          <div className="text-gray-400">Verification Accuracy</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="modern-grid-3 mb-8">
        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.complianceRate}%</div>
          <div className="text-gray-400">Compliance Rate</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.averageProcessingTime}h</div>
          <div className="text-gray-400">Avg Processing Time</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.totalCreditsReviewed.toLocaleString()}</div>
          <div className="text-gray-400">Total Credits Reviewed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="modern-grid-3">
          <button
            onClick={() => handleQuickAction('review-pending')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Review Pending</h3>
            <p className="text-gray-300 text-sm">Review pending credit verifications</p>
          </button>

          <button
            onClick={() => handleQuickAction('generate-report')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Generate Report</h3>
            <p className="text-gray-300 text-sm">Create verification reports</p>
          </button>

          <button
            onClick={() => handleQuickAction('compliance-check')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Compliance Check</h3>
            <p className="text-gray-300 text-sm">Run compliance verification</p>
          </button>
        </div>
      </div>

      {/* Pending Credits & Recent Verifications */}
      <div className="modern-grid-2 gap-8">
        {/* Pending Credits */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Pending Verifications</h2>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {pendingCredits.slice(0, 5).map((credit, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div>
                    <div className="text-white font-medium">{credit.amount} kg H2</div>
                    <div className="text-gray-400 text-sm">{credit.producer}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openVerificationModal(credit, 'approve')}
                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openVerificationModal(credit, 'reject')}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCreditClick(credit)}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Verifications */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Verifications</h2>
            <button className="text-green-400 hover:text-green-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentVerifications.slice(0, 5).map((verification, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${verification.decision === 'approved' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div>
                    <div className="text-white font-medium">{verification.creditAmount} kg H2</div>
                    <div className="text-gray-400 text-sm">{verification.producer}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${verification.decision === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                    {verification.decision}
                  </div>
                  <div className="text-gray-400 text-xs">{verification.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Statistics */}
      <div className="modern-card p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Verification Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Approved</div>
            <div className="text-gray-400 text-sm">{metrics.approvedCredits}</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Rejected</div>
            <div className="text-gray-400 text-sm">{metrics.rejectedCredits}</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Pending</div>
            <div className="text-gray-400 text-sm">{metrics.pendingVerifications}</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Accuracy</div>
            <div className="text-gray-400 text-sm">{metrics.verificationAccuracy}%</div>
          </div>
        </div>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Verification analytics chart</p>
            <p className="text-sm">Click to view detailed statistics</p>
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

      {/* Verification Modal */}
      {showVerificationModal && selectedCredit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {verificationDecision === 'approve' ? 'Approve' : 'Reject'} Credit
              </h3>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-white font-medium">{selectedCredit.amount} kg H2</div>
                <div className="text-gray-400 text-sm">Producer: {selectedCredit.producer}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Verification Notes</label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  className="modern-input w-full h-24 resize-none"
                  placeholder="Enter verification notes..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleVerifyCredit(selectedCredit.id, verificationDecision)}
                disabled={actionLoading}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  verificationDecision === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                } disabled:opacity-50`}
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  `${verificationDecision === 'approve' ? 'Approve' : 'Reject'} Credit`
                )}
              </button>
              <button
                onClick={() => setShowVerificationModal(false)}
                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Details Modal */}
      {showCreditDetailsModal && selectedCredit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Credit Details</h3>
              <button
                onClick={() => setShowCreditDetailsModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Credit Amount</label>
                  <div className="text-white font-medium">{selectedCredit.amount} kg H2</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Producer</label>
                  <div className="text-white font-medium">{selectedCredit.producer}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Carbon Intensity</label>
                  <div className="text-white font-medium">{selectedCredit.carbonIntensity} kg CO2/kg H2</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Production Date</label>
                  <div className="text-white font-medium">{selectedCredit.productionDate}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Energy Source</label>
                  <div className="text-white font-medium">{selectedCredit.energySource}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Status</label>
                  <div className="text-white font-medium">{selectedCredit.status}</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCreditDetailsModal(false);
                  openVerificationModal(selectedCredit, 'approve');
                }}
                className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  setShowCreditDetailsModal(false);
                  openVerificationModal(selectedCredit, 'reject');
                }}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => setShowCreditDetailsModal(false)}
                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifierDashboard;

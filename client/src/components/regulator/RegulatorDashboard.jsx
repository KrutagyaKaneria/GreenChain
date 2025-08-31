import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  FileText,
  Download,
  Eye,
  Filter,
  X,
  Users,
  Award,
  Target,
  Gauge,
  Thermometer,
  Leaf,
  Database,
  AlertCircle,
  Globe,
  Lock,
  Settings,
  Activity,
  Clock,
  Target as TargetIcon
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const RegulatorDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalComplianceChecks: 0,
    compliantEntities: 0,
    nonCompliantEntities: 0,
    pendingReviews: 0,
    totalViolations: 0,
    resolvedViolations: 0,
    averageResponseTime: 0,
    systemHealth: 'healthy'
  });
  const [complianceReports, setComplianceReports] = useState([]);
  const [violations, setViolations] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modal states
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [selectedAudit, setSelectedAudit] = useState(null);

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
      const [metricsRes, reportsRes, violationsRes, auditRes] = await Promise.all([
        api.get('/regulator/metrics'),
        api.get('/regulator/compliance-reports'),
        api.get('/regulator/violations'),
        api.get('/regulator/audit-logs')
      ]);

      setMetrics(metricsRes.data.data);
      setComplianceReports(reportsRes.data.data);
      setViolations(violationsRes.data.data);
      setAuditLogs(auditRes.data.data);
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
        case 'compliance-review':
          // Show compliance review interface
          break;
        case 'violation-management':
          // Show violation management
          break;
        case 'audit-trail':
          // Show audit trail
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

  const handleReportClick = (report) => {
    setSelectedReport(report);
    setShowComplianceModal(true);
  };

  const handleViolationClick = (violation) => {
    setSelectedViolation(violation);
    setShowViolationModal(true);
  };

  const handleAuditClick = (audit) => {
    setSelectedAudit(audit);
    setShowAuditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" color="indigo" />
          <p className="text-gray-300 mt-4 text-lg">Loading your regulator dashboard...</p>
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
              Welcome back, <span className="gradient-text-indigo">{user?.name}</span>
            </h1>
            <p className="text-xl text-gray-300">Monitor compliance and enforce regulations across the platform</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
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
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.totalComplianceChecks.toLocaleString()}</div>
          <div className="text-gray-400">Total Compliance Checks</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.compliantEntities.toLocaleString()}</div>
          <div className="text-gray-400">Compliant Entities</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <AlertTriangle className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.nonCompliantEntities}</div>
          <div className="text-gray-400">Non-Compliant Entities</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.pendingReviews}</div>
          <div className="text-gray-400">Pending Reviews</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="modern-grid-3 mb-8">
        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.totalViolations}</div>
          <div className="text-gray-400">Total Violations</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.averageResponseTime}h</div>
          <div className="text-gray-400">Avg Response Time</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.resolvedViolations}</div>
          <div className="text-gray-400">Resolved Violations</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="modern-grid-3">
          <button
            onClick={() => handleQuickAction('compliance-review')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Compliance Review</h3>
            <p className="text-gray-300 text-sm">Review compliance reports</p>
          </button>

          <button
            onClick={() => handleQuickAction('violation-management')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Violation Management</h3>
            <p className="text-gray-300 text-sm">Handle violations</p>
          </button>

          <button
            onClick={() => handleQuickAction('audit-trail')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Audit Trail</h3>
            <p className="text-gray-300 text-sm">View audit logs</p>
          </button>
        </div>
      </div>

      {/* Compliance & Violations */}
      <div className="modern-grid-2 gap-8">
        {/* Compliance Reports */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Compliance Reports</h2>
            <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {complianceReports.slice(0, 5).map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${report.status === 'compliant' ? 'bg-green-400' : report.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  <div>
                    <div className="text-white font-medium">{report.entityName}</div>
                    <div className="text-gray-400 text-sm">{report.reportDate}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${report.status === 'compliant' ? 'text-green-400' : report.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {report.status}
                  </div>
                  <div className="text-gray-400 text-xs">{report.score}/100</div>
                </div>
                <button
                  onClick={() => handleReportClick(report)}
                  className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Violations */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Active Violations</h2>
            <button className="text-red-400 hover:text-red-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {violations.slice(0, 5).map((violation, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${violation.severity === 'high' ? 'bg-red-400' : violation.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                  <div>
                    <div className="text-white font-medium">{violation.entityName}</div>
                    <div className="text-gray-400 text-sm">{violation.violationType}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${violation.severity === 'high' ? 'text-red-400' : violation.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {violation.severity}
                  </div>
                  <div className="text-gray-400 text-xs">{violation.date}</div>
                </div>
                <button
                  onClick={() => handleViolationClick(violation)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="modern-card p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Audit Logs</h2>
        <div className="space-y-4">
          {auditLogs.slice(0, 5).map((audit, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${audit.action === 'create' ? 'bg-green-400' : audit.action === 'update' ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                <div>
                  <div className="text-white font-medium">{audit.action}</div>
                  <div className="text-gray-400 text-sm">{audit.entityType} - {audit.entityId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{audit.user}</div>
                <div className="text-gray-400 text-sm">{audit.timestamp}</div>
              </div>
              <button
                onClick={() => handleAuditClick(audit)}
                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="modern-card p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">System Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Security</div>
            <div className="text-gray-400 text-sm">Excellent</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Performance</div>
            <div className="text-gray-400 text-sm">Good</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Database className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Data Integrity</div>
            <div className="text-gray-400 text-sm">Excellent</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-white font-semibold">Access Control</div>
            <div className="text-gray-400 text-sm">Good</div>
          </div>
        </div>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>System health analytics</p>
            <p className="text-sm">Click to view detailed metrics</p>
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

      {/* Compliance Report Modal */}
      {showComplianceModal && selectedReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Compliance Report Details</h3>
              <button
                onClick={() => setShowComplianceModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Entity Name</label>
                  <div className="text-white font-medium">{selectedReport.entityName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Report Date</label>
                  <div className="text-white font-medium">{selectedReport.reportDate}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Compliance Score</label>
                  <div className="text-white font-medium">{selectedReport.score}/100</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Status</label>
                  <div className="text-white font-medium">{selectedReport.status}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Reviewer</label>
                  <div className="text-white font-medium">{selectedReport.reviewer || 'Pending'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Last Updated</label>
                  <div className="text-white font-medium">{selectedReport.lastUpdated}</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                Approve
              </button>
              <button className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                Reject
              </button>
              <button
                onClick={() => setShowComplianceModal(false)}
                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Violation Details Modal */}
      {showViolationModal && selectedViolation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Violation Details</h3>
              <button
                onClick={() => setShowViolationModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Entity Name</label>
                  <div className="text-white font-medium">{selectedViolation.entityName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Violation Type</label>
                  <div className="text-white font-medium">{selectedViolation.violationType}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Severity</label>
                  <div className="text-white font-medium">{selectedViolation.severity}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Date</label>
                  <div className="text-white font-medium">{selectedViolation.date}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Status</label>
                  <div className="text-white font-medium">{selectedViolation.status}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Assigned To</label>
                  <div className="text-white font-medium">{selectedViolation.assignedTo || 'Unassigned'}</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                Assign
              </button>
              <button className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors">
                Resolve
              </button>
              <button
                onClick={() => setShowViolationModal(false)}
                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audit Details Modal */}
      {showAuditModal && selectedAudit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Audit Log Details</h3>
              <button
                onClick={() => setShowAuditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Action</label>
                  <div className="text-white font-medium">{selectedAudit.action}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Entity Type</label>
                  <div className="text-white font-medium">{selectedAudit.entityType}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Entity ID</label>
                  <div className="text-white font-medium">{selectedAudit.entityId}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">User</label>
                  <div className="text-white font-medium">{selectedAudit.user}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Timestamp</label>
                  <div className="text-white font-medium">{selectedAudit.timestamp}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">IP Address</label>
                  <div className="text-white font-medium">{selectedAudit.ipAddress || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                Export
              </button>
              <button
                onClick={() => setShowAuditModal(false)}
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

export default RegulatorDashboard;

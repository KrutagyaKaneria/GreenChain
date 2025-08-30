const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userRole: {
    type: String,
    required: true,
    enum: ['admin', 'producer', 'verifier', 'buyer', 'regulator']
  },
  action: {
    type: String,
    required: true,
    enum: [
      // User actions
      'user_signup', 'user_login', 'user_logout', 'user_password_reset', 'user_profile_update',
      'user_deactivate', 'user_reactivate', 'user_delete', 'user_role_change',
      
      // IoT actions
      'sensor_add', 'sensor_update', 'sensor_deactivate', 'sensor_calibration',
      'data_ingestion', 'data_validation', 'data_anomaly_detected',
      
      // Credit actions
      'credit_issued', 'credit_verified', 'credit_rejected', 'credit_retired',
      'credit_transferred', 'credit_listed', 'credit_delisted',
      
      // Marketplace actions
      'listing_created', 'listing_updated', 'listing_canceled', 'listing_sold',
      'bid_placed', 'bid_withdrawn', 'purchase_completed',
      
      // System actions
      'config_updated', 'feature_toggled', 'maintenance_mode', 'system_backup',
      'report_generated', 'audit_exported',
      
      // Compliance actions
      'verification_requested', 'verification_completed', 'compliance_check',
      'regulatory_report', 'enforcement_action'
    ]
  },
  resourceType: {
    type: String,
    required: true,
    enum: ['user', 'sensor', 'data', 'credit', 'listing', 'purchase', 'system', 'report']
  },
  resourceId: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId, String, or Number
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    required: true,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  sessionId: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  outcome: {
    type: String,
    enum: ['success', 'failure', 'partial', 'pending'],
    default: 'success'
  },
  errorMessage: {
    type: String,
    trim: true
  },
  metadata: {
    requestId: String,
    responseTime: Number, // in milliseconds
    requestSize: Number, // in bytes
    responseSize: Number, // in bytes
    apiEndpoint: String,
    httpMethod: String,
    statusCode: Number
  },
  relatedLogs: [{
    logId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AuditLog'
    },
    relationship: {
      type: String,
      enum: ['parent', 'child', 'related', 'duplicate']
    }
  }]
}, {
  timestamps: true
});

// Indexes
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ severity: 1 });
auditLogSchema.index({ outcome: 1 });
auditLogSchema.index({ ipAddress: 1 });

// Instance method to get human-readable action description
auditLogSchema.methods.getActionDescription = function() {
  const actionDescriptions = {
    'user_signup': 'User Registration',
    'user_login': 'User Login',
    'user_logout': 'User Logout',
    'user_password_reset': 'Password Reset',
    'user_profile_update': 'Profile Update',
    'user_deactivate': 'User Deactivated',
    'user_reactivate': 'User Reactivated',
    'user_delete': 'User Deleted',
    'user_role_change': 'Role Changed',
    'sensor_add': 'Sensor Added',
    'sensor_update': 'Sensor Updated',
    'sensor_deactivate': 'Sensor Deactivated',
    'sensor_calibration': 'Sensor Calibrated',
    'data_ingestion': 'Data Ingested',
    'data_validation': 'Data Validated',
    'data_anomaly_detected': 'Data Anomaly Detected',
    'credit_issued': 'Credit Issued',
    'credit_verified': 'Credit Verified',
    'credit_rejected': 'Credit Rejected',
    'credit_retired': 'Credit Retired',
    'credit_transferred': 'Credit Transferred',
    'credit_listed': 'Credit Listed',
    'credit_delisted': 'Credit Delisted',
    'listing_created': 'Listing Created',
    'listing_updated': 'Listing Updated',
    'listing_canceled': 'Listing Canceled',
    'listing_sold': 'Listing Sold',
    'bid_placed': 'Bid Placed',
    'bid_withdrawn': 'Bid Withdrawn',
    'purchase_completed': 'Purchase Completed',
    'config_updated': 'Configuration Updated',
    'feature_toggled': 'Feature Toggled',
    'maintenance_mode': 'Maintenance Mode',
    'system_backup': 'System Backup',
    'report_generated': 'Report Generated',
    'audit_exported': 'Audit Exported',
    'verification_requested': 'Verification Requested',
    'verification_completed': 'Verification Completed',
    'compliance_check': 'Compliance Check',
    'regulatory_report': 'Regulatory Report',
    'enforcement_action': 'Enforcement Action'
  };
  
  return actionDescriptions[this.action] || this.action;
};

// Instance method to check if log requires immediate attention
auditLogSchema.methods.requiresAttention = function() {
  return this.severity === 'high' || 
         this.severity === 'critical' || 
         this.outcome === 'failure' ||
         this.action.includes('anomaly') ||
         this.action.includes('enforcement');
};

// Static method to get audit logs with filters
auditLogSchema.statics.getAuditLogs = async function(filters = {}) {
  const query = {};
  
  if (filters.userId) query.userId = filters.userId;
  if (filters.userRole) query.userRole = filters.userRole;
  if (filters.action) query.action = filters.action;
  if (filters.resourceType) query.resourceType = filters.resourceType;
  if (filters.severity) query.severity = filters.severity;
  if (filters.outcome) query.outcome = filters.outcome;
  if (filters.ipAddress) query.ipAddress = filters.ipAddress;
  
  if (filters.dateFrom || filters.dateTo) {
    query.createdAt = {};
    if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
  }
  
  const options = {
    sort: { createdAt: -1 },
    limit: filters.limit || 100,
    skip: filters.skip || 0
  };
  
  if (filters.populate) {
    options.populate = filters.populate;
  }
  
  return await this.find(query, null, options);
};

// Static method to get audit statistics
auditLogSchema.statics.getAuditStats = async function(filters = {}) {
  const match = {};
  
  if (filters.userId) match.userId = mongoose.Types.ObjectId(filters.userId);
  if (filters.userRole) match.userRole = filters.userRole;
  if (filters.dateFrom || filters.dateTo) {
    match.createdAt = {};
    if (filters.dateFrom) match.createdAt.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) match.createdAt.$lte = new Date(filters.dateTo);
  }
  
  return await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalLogs: { $sum: 1 },
        byAction: {
          $push: {
            action: '$action',
            count: 1
          }
        },
        bySeverity: {
          $push: {
            severity: '$severity',
            count: 1
          }
        },
        byOutcome: {
          $push: {
            outcome: '$outcome',
            count: 1
          }
        },
        byUserRole: {
          $push: {
            userRole: '$userRole',
            count: 1
          }
        }
      }
    }
  ]);
};

// Static method to get suspicious activities
auditLogSchema.statics.getSuspiciousActivities = async function(timeWindow = 24) {
  const cutoffTime = new Date(Date.now() - (timeWindow * 60 * 60 * 1000));
  
  return await this.aggregate([
    {
      $match: {
        createdAt: { $gte: cutoffTime },
        $or: [
          { severity: { $in: ['high', 'critical'] } },
          { outcome: 'failure' },
          { action: { $in: ['user_login', 'data_anomaly_detected', 'enforcement_action'] } }
        ]
      }
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          ipAddress: '$ipAddress',
          action: '$action'
        },
        count: { $sum: 1 },
        lastOccurrence: { $max: '$createdAt' },
        severity: { $max: '$severity' }
      }
    },
    {
      $match: {
        count: { $gte: 3 } // Flag if action occurs 3+ times in time window
      }
    },
    { $sort: { count: -1 } }
  ]);
};

module.exports = mongoose.model('AuditLog', auditLogSchema);

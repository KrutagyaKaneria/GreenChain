const AuditLog = require('../models/AuditLog');

/**
 * Audit Logger Utility
 * Provides consistent audit logging across the application
 */

class AuditLogger {
  /**
   * Log an audit event
   * @param {Object} params - Audit log parameters
   * @param {string} params.userId - User ID performing the action
   * @param {string} params.userRole - Role of the user
   * @param {string} params.action - Action being performed
   * @param {string} params.resourceType - Type of resource being acted upon
   * @param {*} params.resourceId - ID of the resource
   * @param {Object} params.details - Additional details about the action
   * @param {string} params.ipAddress - IP address of the request
   * @param {string} params.userAgent - User agent string
   * @param {string} params.sessionId - Session ID
   * @param {string} params.severity - Severity level (low, medium, high, critical)
   * @param {string} params.outcome - Outcome of the action (success, failure, partial, pending)
   * @param {string} params.errorMessage - Error message if action failed
   * @param {Object} params.metadata - Additional metadata
   */
  static async log(params) {
    try {
      const {
        userId,
        userRole,
        action,
        resourceType,
        resourceId,
        details = {},
        ipAddress,
        userAgent,
        sessionId,
        severity = 'low',
        outcome = 'success',
        errorMessage,
        metadata = {}
      } = params;

      // Validate required fields
      if (!userId || !userRole || !action || !resourceType || !resourceId || !ipAddress) {
        console.error('AuditLogger: Missing required parameters', params);
        return;
      }

      // Create audit log entry
      const auditLog = new AuditLog({
        userId,
        userRole,
        action,
        resourceType,
        resourceId,
        details,
        ipAddress,
        userAgent,
        sessionId,
        severity,
        outcome,
        errorMessage,
        metadata
      });

      await auditLog.save();

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[AUDIT] ${action} by ${userRole} ${userId} on ${resourceType} ${resourceId} - ${outcome}`);
      }

      return auditLog;
    } catch (error) {
      console.error('AuditLogger: Failed to create audit log', error);
      // Don't throw error to avoid breaking main functionality
    }
  }

  /**
   * Log user authentication events
   */
  static async logAuth(userId, userRole, action, ipAddress, userAgent, sessionId, outcome = 'success', errorMessage = null) {
    return await this.log({
      userId,
      userRole,
      action,
      resourceType: 'user',
      resourceId: userId,
      details: { action: action },
      ipAddress,
      userAgent,
      sessionId,
      severity: outcome === 'success' ? 'low' : 'medium',
      outcome,
      errorMessage
    });
  }

  /**
   * Log IoT sensor events
   */
  static async logSensor(userId, userRole, action, sensorId, details = {}, ipAddress, userAgent, sessionId, outcome = 'success', errorMessage = null) {
    return await this.log({
      userId,
      userRole,
      action,
      resourceType: 'sensor',
      resourceId: sensorId,
      details,
      ipAddress,
      userAgent,
      sessionId,
      severity: outcome === 'success' ? 'low' : 'medium',
      outcome,
      errorMessage
    });
  }

  /**
   * Log credit-related events
   */
  static async logCredit(userId, userRole, action, creditId, details = {}, ipAddress, userAgent, sessionId, outcome = 'success', errorMessage = null) {
    return await this.log({
      userId,
      userRole,
      action,
      resourceType: 'credit',
      resourceId: creditId,
      details,
      ipAddress,
      userAgent,
      sessionId,
      severity: outcome === 'success' ? 'low' : 'medium',
      outcome,
      errorMessage
    });
  }

  /**
   * Log marketplace events
   */
  static async logMarketplace(userId, userRole, action, listingId, details = {}, ipAddress, userAgent, sessionId, outcome = 'success', errorMessage = null) {
    return await this.log({
      userId,
      userRole,
      action,
      resourceType: 'listing',
      resourceId: listingId,
      details,
      ipAddress,
      userAgent,
      sessionId,
      severity: outcome === 'success' ? 'low' : 'medium',
      outcome,
      errorMessage
    });
  }

  /**
   * Log system configuration changes
   */
  static async logConfigChange(userId, userRole, configKey, oldValue, newValue, reason = '', ipAddress, userAgent, sessionId) {
    return await this.log({
      userId,
      userRole,
      action: 'config_updated',
      resourceType: 'system',
      resourceId: configKey,
      details: {
        configKey,
        oldValue,
        newValue,
        reason
      },
      ipAddress,
      userAgent,
      sessionId,
      severity: 'medium',
      outcome: 'success'
    });
  }

  /**
   * Log compliance and verification events
   */
  static async logCompliance(userId, userRole, action, resourceId, details = {}, ipAddress, userAgent, sessionId, outcome = 'success', errorMessage = null) {
    return await this.log({
      userId,
      userRole,
      action,
      resourceType: 'credit',
      resourceId,
      details,
      ipAddress,
      userAgent,
      sessionId,
      severity: 'high', // Compliance events are high priority
      outcome,
      errorMessage
    });
  }

  /**
   * Log suspicious activities with high severity
   */
  static async logSuspiciousActivity(userId, userRole, action, resourceType, resourceId, details = {}, ipAddress, userAgent, sessionId, reason = '') {
    return await this.log({
      userId,
      userRole,
      action,
      resourceType,
      resourceId,
      details: { ...details, reason },
      ipAddress,
      userAgent,
      sessionId,
      severity: 'high',
      outcome: 'failure'
    });
  }

  /**
   * Get audit logs with filters
   */
  static async getLogs(filters = {}) {
    return await AuditLog.getAuditLogs(filters);
  }

  /**
   * Get audit statistics
   */
  static async getStats(filters = {}) {
    return await AuditLog.getAuditStats(filters);
  }

  /**
   * Get suspicious activities
   */
  static async getSuspiciousActivities(timeWindow = 24) {
    return await AuditLog.getSuspiciousActivities(timeWindow);
  }
}

module.exports = AuditLogger;

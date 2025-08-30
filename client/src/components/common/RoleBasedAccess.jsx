import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RoleBasedAccess = ({ allowedRoles, children, fallback = null }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return fallback;
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback;
  }

  return children;
};

export default RoleBasedAccess;
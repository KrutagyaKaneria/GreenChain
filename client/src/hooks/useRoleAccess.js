import { useAuth } from '../contexts/AuthContext';

export const useRoleAccess = () => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role) => {
    return isAuthenticated && user && user.role === role;
  };

  const hasAnyRole = (roles) => {
    return isAuthenticated && user && roles.includes(user.role);
  };

  const isProducer = () => hasRole('producer');
  const isVerifier = () => hasRole('verifier');
  const isBuyer = () => hasRole('buyer');
  const isRegulator = () => hasRole('regulator');
  const isAdmin = () => hasRole('admin');

  const canManageFacilities = () => hasAnyRole(['producer', 'admin']);
  const canVerifyCredits = () => hasAnyRole(['verifier', 'admin']);
  const canPurchaseCredits = () => hasAnyRole(['buyer', 'admin']);
  const canViewAuditTrails = () => hasAnyRole(['regulator', 'admin']);
  const canManageUsers = () => hasRole('admin');

  return {
    hasRole,
    hasAnyRole,
    isProducer,
    isVerifier,
    isBuyer,
    isRegulator,
    isAdmin,
    canManageFacilities,
    canVerifyCredits,
    canPurchaseCredits,
    canViewAuditTrails,
    canManageUsers,
    userRole: user?.role,
    isAuthenticated
  };
};

export default useRoleAccess;
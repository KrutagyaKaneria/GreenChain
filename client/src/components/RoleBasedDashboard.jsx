import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import ProducerDashboard from './producer/ProducerDashboard';
import VerifierDashboard from './verifier/VerifierDashboard';
import BuyerDashboard from './buyer/BuyerDashboard';
import RegulatorDashboard from './regulator/RegulatorDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case 'producer':
        return <ProducerDashboard />;
      case 'verifier':
        return <VerifierDashboard />;
      case 'buyer':
        return <BuyerDashboard />;
      case 'regulator':
        return <RegulatorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-600">Welcome to GreenChain! Your role-specific dashboard is being prepared.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Role-specific content */}
      {renderRoleSpecificContent()}
    </div>
  );
};

export default RoleBasedDashboard;
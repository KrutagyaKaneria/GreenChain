import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Building2, Shield, Leaf, ShoppingCart, Gavel } from 'lucide-react';
import RoleBasedAccess from './common/RoleBasedAccess';
import { useRoleAccess } from '../hooks/useRoleAccess';
import RoleBasedDashboard from './RoleBasedDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { userRole } = useRoleAccess();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'producer':
        return <Leaf className="h-6 w-6 text-green-600" />;
      case 'verifier':
        return <Shield className="h-6 w-6 text-blue-600" />;
      case 'buyer':
        return <ShoppingCart className="h-6 w-6 text-purple-600" />;
      case 'regulator':
        return <Gavel className="h-6 w-6 text-orange-600" />;
      case 'admin':
        return <Shield className="h-6 w-6 text-red-600" />;
      default:
        return <User className="h-6 w-6 text-gray-600" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'producer':
        return 'Green hydrogen facility operator';
      case 'verifier':
        return 'Certification body or auditor';
      case 'buyer':
        return 'Industrial consumer';
      case 'regulator':
        return 'Government authority';
      case 'admin':
        return 'System administrator';
      default:
        return 'User';
    }
  };

  const getRoleFeatures = (role) => {
    switch (role) {
      case 'producer':
        return [
          'Register and manage IoT sensors',
          'View production metrics',
          'Issue new credits via smart contract',
          'Monitor facility performance'
        ];
      case 'verifier':
        return [
          'Access pending credit issuance requests',
          'Verify or reject credits',
          'Generate certification reports',
          'Audit compliance'
        ];
      case 'buyer':
        return [
          'Browse available credits',
          'Purchase credits',
          'View purchase history',
          'Retire credits for compliance'
        ];
      case 'regulator':
        return [
          'View all transactions and audit trails',
          'Enforce compliance rules',
          'Generate system-wide reports',
          'Monitor platform activity'
        ];
      case 'admin':
        return [
          'Manage all users and roles',
          'Configure system settings',
          'Deploy and upgrade smart contracts',
          'System-wide administration'
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">GreenChain</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getRoleIcon(user.role)}
                <span className="text-sm font-medium text-gray-700 capitalize">{user.role}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  {getRoleIcon(user.role)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user.companyName}!
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {getRoleDescription(user.role)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Role-specific Information */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Company Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Company Information
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Company Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.companyName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </dd>
                  </div>
                  {/* Role-specific information */}
                  {user.role === 'producer' && user.facilityDetails && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Facility</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.facilityDetails.facilityName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Capacity</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.facilityDetails.capacity} MW</dd>
                      </div>
                    </>
                  )}
                  {user.role === 'verifier' && user.certificationBody && (
                    <>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Certification Body</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.certificationBody.bodyName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Accreditation</dt>
                        <dd className="mt-1 text-sm text-gray-900">{user.certificationBody.accreditationNumber}</dd>
                      </div>
                    </>
                  )}
                  {user.role === 'buyer' && user.industryType && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Industry</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{user.industryType}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Role Features */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Your Capabilities
                </h3>
                <ul className="space-y-3">
                  {getRoleFeatures(user.role).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      </div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Role-based Dashboard Content */}
          <div className="mt-6">
            <RoleBasedAccess allowedRoles={['admin', 'producer', 'verifier', 'buyer', 'regulator']}>
              <RoleBasedDashboard />
            </RoleBasedAccess>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                      <Leaf className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      View Credits
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Check your available green hydrogen credits
                    </p>
                  </div>
                </button>

                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                      <Building2 className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Reports
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Generate compliance and performance reports
                    </p>
                  </div>
                </button>

                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
                      <Shield className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Settings
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Manage your account and preferences
                    </p>
                  </div>
                </button>

                <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                  <div>
                    <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 ring-4 ring-white">
                      <User className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Profile
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Update your company information
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Users, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Green Hydrogen Production',
      description: 'Track and verify sustainable hydrogen production with IoT integration'
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Secure, transparent transactions powered by blockchain technology'
    },
    {
      icon: Users,
      title: 'Multi-Role Platform',
      description: 'Designed for producers, verifiers, buyers, and regulators'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Comprehensive reporting and compliance monitoring tools'
    }
  ];

  const roles = [
    {
      title: 'Producer',
      description: 'Hydrogen facility operators',
      features: ['IoT sensor management', 'Production tracking', 'Credit issuance']
    },
    {
      title: 'Verifier',
      description: 'Certification bodies',
      features: ['Credit verification', 'Compliance auditing', 'Certification reports']
    },
    {
      title: 'Buyer',
      description: 'Industrial consumers',
      features: ['Credit marketplace', 'Purchase tracking', 'Compliance reporting']
    },
    {
      title: 'Regulator',
      description: 'Government authorities',
      features: ['System monitoring', 'Audit trails', 'Policy enforcement']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              GreenChain
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              The future of sustainable hydrogen credit trading powered by blockchain technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-green-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for transparent and secure hydrogen credit trading
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Role-based access ensures each user gets the tools they need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roles.map((role, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                <p className="text-gray-600 mb-6">{role.description}</p>
                <ul className="space-y-3">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join the Green Revolution?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Start trading sustainable hydrogen credits today and be part of the clean energy future
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-green-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
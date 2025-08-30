import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShoppingCart, 
  TrendingUp, 
  Shield, 
  DollarSign, 
  MapPin,
  BarChart3,
  Download,
  Eye,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalPurchased: 0,
    totalSpent: 0,
    complianceStatus: 'compliant',
    requiredCredits: 0,
    purchasedCredits: 0,
    retiredCredits: 0
  });
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics
      const metricsResponse = await api.get('/buyer/dashboard/metrics');
      if (metricsResponse.data.success) {
        setMetrics(metricsResponse.data.data);
      }
      
      // Fetch marketplace listings
      const marketplaceResponse = await api.get('/buyer/marketplace');
      if (marketplaceResponse.data.success) {
        setMarketplaceListings(marketplaceResponse.data.data);
      }
      
      // Fetch purchase history
      const historyResponse = await api.get('/buyer/purchase-history');
      if (historyResponse.data.success) {
        setPurchaseHistory(historyResponse.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data if API fails
      setMetrics({
        totalPurchased: 45,
        totalSpent: 125000,
        complianceStatus: 'compliant',
        requiredCredits: 50,
        purchasedCredits: 45,
        retiredCredits: 40
      });

      setMarketplaceListings([
        {
          id: 1,
          tokenId: 'CREDIT-001',
          producer: 'HydroGen Corp',
          price: 2500,
          amount: 1250.5,
          carbonIntensity: 2.1,
          energySource: 'renewable',
          rfnboCompliant: true,
          listedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        {
          id: 2,
          tokenId: 'CREDIT-002',
          producer: 'GreenTech Solutions',
          price: 1800,
          amount: 890.2,
          carbonIntensity: 2.8,
          energySource: 'renewable',
          rfnboCompliant: true,
          listedAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
        },
        {
          id: 3,
          tokenId: 'CREDIT-003',
          producer: 'EcoFuel Industries',
          price: 3200,
          amount: 2100.0,
          carbonIntensity: 3.2,
          energySource: 'mixed',
          rfnboCompliant: false,
          listedAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
        }
      ]);

      setPurchaseHistory([
        {
          id: 1,
          tokenId: 'CREDIT-004',
          producer: 'HydroGen Corp',
          purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
          amount: 1500.0,
          price: 3000,
          status: 'retired',
          retiredAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
        },
        {
          id: 2,
          tokenId: 'CREDIT-005',
          producer: 'GreenTech Solutions',
          purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 48),
          amount: 800.5,
          price: 1600,
          status: 'owned',
          retiredAt: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleBuyCredit = (listingId) => {
    console.log(`Buying credit from listing ${listingId}`);
  };

  const handleRetireCredit = (creditId) => {
    console.log(`Retiring credit ${creditId}`);
  };

  const handleQuickAction = async (action) => {
    console.log('Buyer Quick Action:', action);
    
    try {
      switch (action) {
        case 'browse-marketplace':
          console.log('Opening Marketplace...');
          const marketplaceResponse = await api.get('/buyer/marketplace');
          if (marketplaceResponse.data.success) {
            console.log('Marketplace Listings:', marketplaceResponse.data.data);
            // TODO: Open marketplace modal with data
          }
          break;
        case 'compliance-report':
          console.log('Opening Compliance Report...');
          const complianceResponse = await api.get('/buyer/compliance-report');
          if (complianceResponse.data.success) {
            console.log('Compliance Report:', complianceResponse.data.data);
            // TODO: Open compliance report modal with data
          }
          break;
        case 'export-portfolio':
          console.log('Exporting Portfolio...');
          const exportResponse = await api.get('/buyer/export/portfolio?format=csv');
          if (exportResponse.data) {
            console.log('Portfolio Export:', exportResponse.data);
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

  const handleListingClick = (listing) => {
    console.log('Marketplace listing clicked:', listing);
    // TODO: Show listing details modal or navigate to listing details
  };

  const handlePurchaseClick = (purchase) => {
    console.log('Purchase history clicked:', purchase);
    // TODO: Show purchase details modal or navigate to purchase details
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.companyName}. Manage your hydrogen credit portfolio and compliance.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Purchased</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalPurchased}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">${metrics.totalSpent.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Status</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{metrics.complianceStatus}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600">{metrics.purchasedCredits}/{metrics.requiredCredits} credits</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Retired Credits</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.retiredCredits}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">of {metrics.purchasedCredits} purchased</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-gray-900">${(metrics.totalSpent / metrics.totalPurchased).toFixed(0)}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-600">per credit</span>
            </div>
          </div>
        </div>

        {/* Marketplace Listings */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Available Credits</h3>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Filter</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {marketplaceListings.map((listing) => (
                <div 
                  key={listing.id} 
                  onClick={() => handleListingClick(listing)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{listing.tokenId}</p>
                      <p className="text-xs text-gray-500">Token ID</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{listing.producer}</p>
                      <p className="text-xs text-gray-600">Producer</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{listing.amount} kg</p>
                      <p className="text-xs text-gray-600">Amount</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{listing.carbonIntensity} kg CO₂/kg H₂</p>
                      <p className="text-xs text-gray-600">Carbon Intensity</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        listing.rfnboCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {listing.rfnboCompliant ? 'RFNBO' : 'Non-RFNBO'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${listing.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Price</p>
                    </div>
                    <button
                      onClick={() => handleBuyCredit(listing.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchase History */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {purchaseHistory.map((purchase) => (
                <div 
                  key={purchase.id} 
                  onClick={() => handlePurchaseClick(purchase)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{purchase.tokenId}</p>
                      <p className="text-xs text-gray-500">Token ID</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{purchase.producer}</p>
                      <p className="text-xs text-gray-600">Producer</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">{purchase.amount} kg</p>
                      <p className="text-xs text-gray-600">Amount</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <p className="text-sm font-medium text-gray-900">${purchase.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Price</p>
                    </div>
                    <div className="border-l border-gray-300 pl-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.status === 'retired' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {purchase.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    {purchase.status === 'owned' && (
                      <button
                        onClick={() => handleRetireCredit(purchase.tokenId)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Retire
                      </button>
                    )}
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Eye className="h-4 w-4" />
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
            onClick={() => handleQuickAction('browse-marketplace')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Browse Marketplace</h4>
                <p className="text-sm text-gray-600">Find available credits</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('compliance-report')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Compliance Report</h4>
                <p className="text-sm text-gray-600">View compliance status</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => handleQuickAction('export-portfolio')}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <Download className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Export Portfolio</h4>
                <p className="text-sm text-gray-600">Download credit data</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;

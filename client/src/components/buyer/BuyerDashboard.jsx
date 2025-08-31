import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  Eye,
  Download,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Minus,
  Users,
  Award,
  Target,
  Gauge,
  Thermometer,
  Leaf,
  Database,
  AlertCircle,
  Wallet,
  CreditCard,
  History
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    creditsOwned: 0,
    averagePrice: 0,
    portfolioValue: 0,
    carbonOffset: 0,
    tradingVolume: 0,
    activeListings: 0
  });
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  // Modal states
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRetireModal, setShowRetireModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [retireAmount, setRetireAmount] = useState('');

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
      const [metricsRes, listingsRes, historyRes, portfolioRes] = await Promise.all([
        api.get('/buyer/metrics'),
        api.get('/buyer/marketplace'),
        api.get('/buyer/purchase-history'),
        api.get('/buyer/portfolio')
      ]);

      setMetrics(metricsRes.data.data);
      setMarketplaceListings(listingsRes.data.data);
      setPurchaseHistory(historyRes.data.data);
      setPortfolio(portfolioRes.data.data);
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
        case 'browse-marketplace':
          // Navigate to marketplace
          break;
        case 'view-portfolio':
          setShowPortfolioModal(true);
          break;
        case 'export-data':
          // Export portfolio data
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

  const handleBuyCredit = async (listingId, amount) => {
    try {
      setActionLoading(true);
      setErrorMessage('');

      const response = await api.post(`/buyer/purchase/${listingId}`, {
        amount: parseFloat(amount)
      });

      if (response.data.success) {
        setSuccessMessage('Credit purchased successfully!');
        setShowBuyModal(false);
        setBuyAmount('');
        setSelectedListing(null);

        // Refresh data
        await fetchDashboardData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error purchasing credit:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to purchase credit');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRetireCredit = async (creditId, amount) => {
    try {
      setActionLoading(true);
      setErrorMessage('');

      const response = await api.post(`/buyer/retire/${creditId}`, {
        amount: parseFloat(amount)
      });

      if (response.data.success) {
        setSuccessMessage('Credit retired successfully!');
        setShowRetireModal(false);
        setRetireAmount('');
        setSelectedCredit(null);

        // Refresh data
        await fetchDashboardData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error retiring credit:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to retire credit');
    } finally {
      setActionLoading(false);
    }
  };

  const openBuyModal = (listing) => {
    setSelectedListing(listing);
    setShowBuyModal(true);
  };

  const openRetireModal = (credit) => {
    setSelectedCredit(credit);
    setShowRetireModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" color="orange" />
          <p className="text-gray-300 mt-4 text-lg">Loading your buyer dashboard...</p>
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
              Welcome back, <span className="gradient-text-orange">{user?.name}</span>
            </h1>
            <p className="text-xl text-gray-300">Trade green hydrogen credits and build your sustainable portfolio</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.totalPurchases.toLocaleString()}</div>
          <div className="text-gray-400">Total Purchases</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">${metrics.totalSpent.toLocaleString()}</div>
          <div className="text-gray-400">Total Spent</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <Leaf className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.creditsOwned.toLocaleString()}</div>
          <div className="text-gray-400">Credits Owned</div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">${metrics.portfolioValue.toLocaleString()}</div>
          <div className="text-gray-400">Portfolio Value</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="modern-grid-3 mb-8">
        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
            <Gauge className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.carbonOffset.toFixed(1)}</div>
          <div className="text-gray-400">Carbon Offset (tons)</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <Thermometer className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">${metrics.averagePrice.toFixed(2)}</div>
          <div className="text-gray-400">Average Price</div>
        </div>

        <div className="modern-card p-6 text-center hover-lift">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{metrics.tradingVolume.toLocaleString()}</div>
          <div className="text-gray-400">Trading Volume</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="modern-grid-3">
          <button
            onClick={() => handleQuickAction('browse-marketplace')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Browse Marketplace</h3>
            <p className="text-gray-300 text-sm">Find credits to purchase</p>
          </button>

          <button
            onClick={() => handleQuickAction('view-portfolio')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">View Portfolio</h3>
            <p className="text-gray-300 text-sm">Manage your credits</p>
          </button>

          <button
            onClick={() => handleQuickAction('export-data')}
            disabled={actionLoading}
            className="modern-card p-6 text-center hover-lift transition-all duration-300 hover:scale-105"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Export Data</h3>
            <p className="text-gray-300 text-sm">Download portfolio reports</p>
          </button>
        </div>
      </div>

      {/* Marketplace & Portfolio */}
      <div className="modern-grid-2 gap-8">
        {/* Marketplace Listings */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Marketplace Listings</h2>
            <button className="text-orange-400 hover:text-orange-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {marketplaceListings.slice(0, 5).map((listing, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <div>
                    <div className="text-white font-medium">{listing.amount} kg H2</div>
                    <div className="text-gray-400 text-sm">{listing.producer}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${listing.price}</div>
                  <div className="text-gray-400 text-sm">{listing.carbonIntensity} kg CO2/kg H2</div>
                </div>
                <button
                  onClick={() => openBuyModal(listing)}
                  className="p-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Portfolio</h2>
            <button className="text-green-400 hover:text-green-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {portfolio.slice(0, 5).map((credit, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${credit.status === 'active' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                  <div>
                    <div className="text-white font-medium">{credit.amount} kg H2</div>
                    <div className="text-gray-400 text-sm">{credit.producer}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">${credit.value}</div>
                  <div className="text-gray-400 text-sm">{credit.purchaseDate}</div>
                </div>
                <button
                  onClick={() => openRetireModal(credit)}
                  className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purchase History */}
      <div className="modern-card p-6 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Purchase History</h2>
        <div className="space-y-4">
          {purchaseHistory.slice(0, 5).map((purchase, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div>
                  <div className="text-white font-medium">{purchase.amount} kg H2</div>
                  <div className="text-gray-400 text-sm">{purchase.producer}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">${purchase.price}</div>
                <div className="text-gray-400 text-sm">{purchase.date}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  purchase.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {purchase.status}
                </span>
              </div>
            </div>
          ))}
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

      {/* Buy Credit Modal */}
      {showBuyModal && selectedListing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Buy Credits</h3>
              <button
                onClick={() => setShowBuyModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-white font-medium">{selectedListing.amount} kg H2</div>
                <div className="text-gray-400 text-sm">Producer: {selectedListing.producer}</div>
                <div className="text-gray-400 text-sm">Price: ${selectedListing.price}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Buy (kg H2)</label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  className="modern-input w-full"
                  placeholder="Enter amount..."
                  min="0"
                  max={selectedListing.amount}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleBuyCredit(selectedListing.id, buyAmount)}
                disabled={actionLoading || !buyAmount || parseFloat(buyAmount) <= 0}
                className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  'Buy Credits'
                )}
              </button>
              <button
                onClick={() => setShowBuyModal(false)}
                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retire Credit Modal */}
      {showRetireModal && selectedCredit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Retire Credits</h3>
              <button
                onClick={() => setShowRetireModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-white font-medium">{selectedCredit.amount} kg H2</div>
                <div className="text-gray-400 text-sm">Producer: {selectedCredit.producer}</div>
                <div className="text-gray-400 text-sm">Value: ${selectedCredit.value}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Amount to Retire (kg H2)</label>
                <input
                  type="number"
                  value={retireAmount}
                  onChange={(e) => setRetireAmount(e.target.value)}
                  className="modern-input w-full"
                  placeholder="Enter amount..."
                  min="0"
                  max={selectedCredit.amount}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleRetireCredit(selectedCredit.id, retireAmount)}
                disabled={actionLoading || !retireAmount || parseFloat(retireAmount) <= 0}
                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  'Retire Credits'
                )}
              </button>
              <button
                onClick={() => setShowRetireModal(false)}
                className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="modern-modal-content p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Your Portfolio</h3>
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {portfolio.map((credit, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${credit.status === 'active' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <div className="text-white font-medium">{credit.amount} kg H2</div>
                      <div className="text-gray-400 text-sm">{credit.producer}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${credit.value}</div>
                    <div className="text-gray-400 text-sm">{credit.purchaseDate}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      credit.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {credit.status}
                    </span>
                    <button
                      onClick={() => {
                        setShowPortfolioModal(false);
                        openRetireModal(credit);
                      }}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;

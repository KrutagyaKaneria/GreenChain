import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Leaf, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard as Dashboard,
  BarChart3,
  Shield,
  Users,
  Zap,
  Globe,
  ChevronDown
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'producer':
        return <Zap className="w-4 h-4" />;
      case 'verifier':
        return <BarChart3 className="w-4 h-4" />;
      case 'buyer':
        return <Users className="w-4 h-4" />;
      case 'regulator':
        return <Globe className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-purple-500 to-pink-500';
      case 'producer':
        return 'from-green-500 to-teal-500';
      case 'verifier':
        return 'from-blue-500 to-cyan-500';
      case 'buyer':
        return 'from-orange-500 to-red-500';
      case 'regulator':
        return 'from-indigo-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/20 backdrop-blur-xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">GreenChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/dashboard') 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Dashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                
                {/* Role-based quick actions */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                  >
                    <span>Quick Actions</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 modern-card p-4 animate-slide-up">
                      <div className="space-y-2">
                        {user.role === 'producer' && (
                          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <Zap className="w-5 h-5 text-green-400" />
                            <span>Issue Credits</span>
                          </Link>
                        )}
                        {user.role === 'verifier' && (
                          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <BarChart3 className="w-5 h-5 text-blue-400" />
                            <span>Verify Credits</span>
                          </Link>
                        )}
                        {user.role === 'buyer' && (
                          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <Users className="w-5 h-5 text-orange-400" />
                            <span>Buy Credits</span>
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                            <Shield className="w-5 h-5 text-purple-400" />
                            <span>System Admin</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center`}>
                      {getRoleIcon(user.role)}
                    </div>
                    <span className="text-white font-medium hidden sm:block">{user.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 modern-card p-4 animate-slide-up">
                      <div className="space-y-2">
                        <div className="p-3 border-b border-white/10">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRoleColor(user.role)} flex items-center justify-center`}>
                              {getRoleIcon(user.role)}
                            </div>
                            <div>
                              <div className="text-white font-medium">{user.name}</div>
                              <div className="text-sm text-gray-400 capitalize">{user.role}</div>
                            </div>
                          </div>
                        </div>
                        
                        <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <Dashboard className="w-5 h-5 text-gray-400" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link to="/settings" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                          <Settings className="w-5 h-5 text-gray-400" />
                          <span>Settings</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline">Login</Link>
                <Link to="/signup" className="btn-primary">Get Started</Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden modern-card mx-6 mb-4 p-6 animate-slide-up">
          <div className="space-y-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Dashboard className="w-5 h-5 text-gray-400" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/settings" 
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Settings</span>
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <a href="#features" className="block p-3 rounded-lg hover:bg-white/5 transition-colors">Features</a>
                <a href="#about" className="block p-3 rounded-lg hover:bg-white/5 transition-colors">About</a>
                <a href="#contact" className="block p-3 rounded-lg hover:bg-white/5 transition-colors">Contact</a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

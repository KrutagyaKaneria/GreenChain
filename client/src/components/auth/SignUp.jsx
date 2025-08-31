import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Leaf, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Phone,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    role: 'producer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signup(formData);
      setSuccess('Account created successfully! Please check your email for verification.');
      setTimeout(() => {
        navigate('/verify-email');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'producer',
      label: 'Producer',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-green-500 to-teal-500',
      description: 'Generate and issue green hydrogen credits'
    },
    {
      value: 'verifier',
      label: 'Verifier',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      description: 'Verify and audit credit authenticity'
    },
    {
      value: 'buyer',
      label: 'Buyer',
      icon: <Users className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      description: 'Purchase and trade credits'
    },
    {
      value: 'regulator',
      label: 'Regulator',
      icon: <Globe className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      description: 'Monitor compliance and policy'
    }
  ];

  const benefits = [
    "AI-Powered IoT Monitoring",
    "Real-time Carbon Tracking",
    "Blockchain Verification",
    "Automated Compliance",
    "Smart Contract Integration",
    "Environmental Scoring"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Form */}
        <div className="modern-card p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Join <span className="gradient-text">GreenChain</span>
            </h1>
            <p className="text-gray-300">Create your account and start your sustainable energy journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="modern-input w-full pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="modern-input w-full pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Company Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="modern-input w-full pl-10"
                  placeholder="Enter your company name"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="modern-input w-full pl-10"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((role) => (
                  <label
                    key={role.value}
                    className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.role === role.value
                        ? 'border-green-400 bg-green-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                        {role.icon}
                      </div>
                      <div>
                        <div className="font-medium text-white">{role.label}</div>
                        <div className="text-xs text-gray-400">{role.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="modern-input w-full pl-10 pr-12"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="modern-input w-full pl-10 pr-12"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="gradient-text hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">GreenChain</span>?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Join thousands of companies already using our platform to monitor, 
              track, and trade green hydrogen credits with unprecedented transparency.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="modern-card p-4 hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-blue-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Platform Stats */}
          <div className="modern-card p-6 text-center">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold gradient-text mb-1">500+</div>
                <div className="text-gray-400 text-sm">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold gradient-text-blue mb-1">10M+</div>
                <div className="text-gray-400 text-sm">Credits Issued</div>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="modern-card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-300 text-sm">
              Bank-level encryption, blockchain verification, and real-time compliance monitoring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
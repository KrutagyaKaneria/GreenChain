import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  RefreshCw,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email, companyName } = location.state || {};

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setTimeLeft(300);
    setError('');
    setSuccess('OTP resent successfully!');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Monitoring",
      description: "Real-time IoT sensor data analysis",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Blockchain Security",
      description: "Immutable credit verification",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance Ready",
      description: "Automated regulatory reporting",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-green-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - OTP Form */}
        <div className="modern-card p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">
              Verify Your <span className="gradient-text">Email</span>
            </h1>
            <p className="text-gray-300">
              We've sent a 6-digit verification code to<br />
              <span className="text-white font-medium">{email || 'your email'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Input Fields */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-14 h-14 text-center text-2xl font-bold modern-input border-2 focus:border-green-400"
                    maxLength={1}
                    autoComplete="off"
                  />
                ))}
              </div>
            </div>

            {/* Timer and Resend */}
            <div className="text-center space-y-4">
              {!canResend ? (
                <div className="flex items-center justify-center space-x-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Resend OTP in {formatTime(timeLeft)}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="flex items-center space-x-2 mx-auto text-green-400 hover:text-green-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Resend OTP</span>
                </button>
              )}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm text-center flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="btn-primary w-full py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Verify Email</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* Back to Sign Up */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/signup')}
              className="flex items-center space-x-2 mx-auto text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign Up</span>
            </button>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Almost There! <span className="gradient-text">Complete</span> Your Setup
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Once verified, you'll have access to the most advanced green hydrogen 
              credit platform with AI-powered monitoring and blockchain security.
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="modern-card p-6 hover-lift">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Company Info */}
          {companyName && (
            <div className="modern-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome, {companyName}!</h3>
              <p className="text-gray-300 text-sm">
                You're joining a network of forward-thinking companies committed to sustainable energy
              </p>
            </div>
          )}

          {/* Security Note */}
          <div className="modern-card p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Verification</h3>
            <p className="text-gray-300 text-sm">
              Your verification code is encrypted and will expire in 5 minutes for security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;


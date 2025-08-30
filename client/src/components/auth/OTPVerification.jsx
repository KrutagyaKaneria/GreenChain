import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyOTP, resendOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const companyName = location.state?.companyName;

  useEffect(() => {
    if (!email || !companyName) {
      navigate('/signup');
      return;
    }

    // Start countdown for resend button
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, companyName, navigate]);

  const handleOtpChange = (index, value) => {
    console.log('OTP change:', { index, value, currentOtp: otp });
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      console.log('Updated OTP array:', newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[type="text"]:nth-of-type(${index + 2})`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[type="text"]:nth-of-type(${index})`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP(email);
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      
      // Reset countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const otpString = otp.join('');
      console.log('Submitting OTP:', { email, otpString, otpArray: otp });
      
      if (otpString.length !== 4) {
        console.error('OTP must be exactly 4 digits');
        return;
      }
      
      const result = await verifyOTP(email, otpString);
      console.log('OTP verification result:', result);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!email || !companyName) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to
          </p>
          <p className="text-sm font-medium text-gray-900">{email}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">?</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                <strong>Why do we need this?</strong> Email verification ensures the security of your account and helps us maintain the integrity of the GreenChain platform.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-center mb-4">
              Enter the 4-digit code from your email
            </label>
            
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-16 h-16 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                    placeholder=""
                  />
                  {digit && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-gray-900">{digit}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-blue-600 hover:text-blue-500 font-medium inline-flex items-center space-x-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Resend</span>
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Resend in {countdown}s
                  </span>
                )}
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={otp.join('').length !== 4 || isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                'Verify Email'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sign Up
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            The verification code will expire in 10 minutes for security reasons.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;


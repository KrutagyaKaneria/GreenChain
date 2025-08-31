import React from 'react';

const LoadingSpinner = ({ size = 'default', color = 'green' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    green: 'border-green-400',
    blue: 'border-blue-400',
    purple: 'border-purple-400',
    white: 'border-white'
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div className={`w-full h-full border-2 border-gray-200 rounded-full ${colorClasses[color]} border-t-transparent`}></div>
    </div>
  );
};

export default LoadingSpinner;


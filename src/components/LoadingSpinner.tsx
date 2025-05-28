import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium',
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-blue-500 border-t-transparent animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;
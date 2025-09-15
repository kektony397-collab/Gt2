
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
      <p className="text-brand-text-secondary font-mono text-sm">LOADING...</p>
    </div>
  );
};

export default LoadingSpinner;

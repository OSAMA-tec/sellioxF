import React from 'react';

export default function LoadingSpinner({ size = 'md' }) {
  // Size classes
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  
  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <div className={`${sizeClass} rounded-full border-t-transparent border-primaryA0 animate-spin`}></div>
  );
} 
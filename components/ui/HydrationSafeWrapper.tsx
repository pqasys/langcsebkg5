'use client';

import React, { useState, useEffect } from 'react';

interface HydrationSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const HydrationSafeWrapper: React.FC<HydrationSafeWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HydrationSafeWrapper; 
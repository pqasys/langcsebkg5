'use client';

import React, { useState, useEffect } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  ssr?: boolean;
}

/**
 * ClientOnly component that prevents hydration mismatches
 * by only rendering children on the client side
 */
const ClientOnly: React.FC<ClientOnlyProps> = ({ 
  children, 
  fallback = null,
  ssr = false 
}) => {
  const [hasMounted, setHasMounted] = useState(ssr);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ClientOnly; 
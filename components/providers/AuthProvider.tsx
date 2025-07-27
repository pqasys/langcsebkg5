'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={0} // Disable automatic refetch to prevent conflicts
      refetchOnWindowFocus={true} // Enable refetch when window gains focus
      refetchWhenOffline={false} // Disable refetch when offline
    >
      {children}
    </SessionProvider>
  );
} 
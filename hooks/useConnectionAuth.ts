'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ConnectionAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingConnectionRequest: {
    targetUserId: string;
    message?: string;
  } | null;
  redirectAfterAuth: string | null;
}

export function useConnectionAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [authState, setAuthState] = useState<ConnectionAuthState>({
    isAuthenticated: false,
    isLoading: true,
    pendingConnectionRequest: null,
    redirectAfterAuth: null
  });

  // Check for pending connection request in URL params
  useEffect(() => {
    const targetUserId = searchParams.get('connect');
    const message = searchParams.get('message');
    const redirectUrl = searchParams.get('redirect');

    if (targetUserId) {
      setAuthState(prev => ({
        ...prev,
        pendingConnectionRequest: {
          targetUserId,
          message: message || undefined
        },
        redirectAfterAuth: redirectUrl
      }));
    }
  }, [searchParams]);

  // Update authentication state when session changes
  useEffect(() => {
    setAuthState(prev => ({
      ...prev,
      isAuthenticated: status === 'authenticated' && !!session?.user,
      isLoading: status === 'loading'
    }));
  }, [session, status]);

  // Handle authentication for connection requests
  const authenticateForConnection = useCallback(async (
    targetUserId: string, 
    message?: string,
    redirectUrl?: string
  ) => {
    if (status === 'authenticated' && session?.user) {
      // User is already authenticated, proceed with connection
      return { success: true, userId: session.user.id };
    }

    // Store pending connection request
    setAuthState(prev => ({
      ...prev,
      pendingConnectionRequest: { targetUserId, message },
      redirectAfterAuth: redirectUrl || window.location.pathname
    }));

    // Redirect to login with callback
    const callbackUrl = new URL('/auth/login', window.location.origin);
    callbackUrl.searchParams.set('callbackUrl', redirectUrl || window.location.pathname);
    callbackUrl.searchParams.set('connect', targetUserId);
    if (message) {
      callbackUrl.searchParams.set('message', message);
    }

    router.push(callbackUrl.toString());
    return { success: false, requiresAuth: true };
  }, [session, status, router]);

  // Execute pending connection request after authentication
  const executePendingConnection = useCallback(async () => {
    if (!authState.pendingConnectionRequest || !session?.user) {
      return { success: false, error: 'No pending connection request' };
    }

    const { targetUserId, message } = authState.pendingConnectionRequest;

    try {
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: targetUserId,
          message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send connection request');
      }

      const result = await response.json();

      // Clear pending request
      setAuthState(prev => ({
        ...prev,
        pendingConnectionRequest: null,
        redirectAfterAuth: null
      }));

      // Redirect if specified
      if (authState.redirectAfterAuth) {
        router.push(authState.redirectAfterAuth);
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error executing pending connection:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [authState.pendingConnectionRequest, authState.redirectAfterAuth, session?.user, router]);

  // Check if user can connect with target user
  const canConnectWith = useCallback((targetUserId: string) => {
    if (!session?.user) return false;
    if (session.user.id === targetUserId) return false; // Can't connect with self
    return true;
  }, [session?.user]);

  // Get connection status with target user
  const getConnectionStatus = useCallback(async (targetUserId: string) => {
    if (!session?.user) return null;

    try {
      const response = await fetch(`/api/connections/status?targetUserId=${targetUserId}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error('Error getting connection status:', error);
      return null;
    }
  }, [session?.user]);

  return {
    // State
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    pendingConnectionRequest: authState.pendingConnectionRequest,
    
    // Actions
    authenticateForConnection,
    executePendingConnection,
    canConnectWith,
    getConnectionStatus,
    
    // Utilities
    session,
    status
  };
}

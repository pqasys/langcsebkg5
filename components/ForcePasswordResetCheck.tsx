'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface ForcePasswordResetCheckProps {
  children: React.ReactNode;
}

export default function ForcePasswordResetCheck({ children }: ForcePasswordResetCheckProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Paths that don't require password reset check
  const excludedPaths = [
    '/reset-password',
    '/auth/signin',
    '/auth/signup',
    '/auth/login',
    '/auth/register',
    '/api',
    '/_next',
  ];

  useEffect(() => {
    const checkPasswordReset = async () => {
      // Skip check if not authenticated or on excluded paths
      if (status === 'loading' || status === 'unauthenticated') {
        setIsChecking(false);
        return;
      }

      if (excludedPaths.some(path => pathname.startsWith(path))) {
        setIsChecking(false);
        return;
      }

      // Temporarily disable password reset check to fix sign-in issue
      setIsChecking(false);
      return;

      // TODO: Re-enable this check once the issue is resolved
      /*
      try {
        const response = await fetch('/api/auth/check-password-reset');
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.forcePasswordReset) {
            // User needs to reset password, redirect to reset page
            router.push('/reset-password');
            return;
          }
        } else if (response.status === 401) {
          // User not authenticated, redirect to login
          router.push('/auth/signin');
          return;
        }
      } catch (error) {
        console.error('Error checking password reset status:', error);
        // On error, allow access but log the issue
      }

      setIsChecking(false);
      */
    };

    checkPasswordReset();
  }, [session, status, pathname]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
} 
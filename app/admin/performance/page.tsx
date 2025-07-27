'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PerformanceDashboard } from '@/components/admin/PerformanceDashboard';

export default function AdminPerformancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Check if user is authenticated and has admin role
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <PerformanceDashboard />
    </div>
  );
} 
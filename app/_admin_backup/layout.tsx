'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import AdminSidebar from '@/components/admin/Sidebar';
import { useInstitutionContext } from '@/components/providers/InstitutionProvider';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const { institution: institutionData, loading: institutionLoading } = useInstitutionContext();
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Get institutionId from URL or path
    const id = pathname.startsWith('/admin/institutions/')
      ? pathname.split('/admin/institutions/')[1].split('/')[0]
      : pathname.startsWith('/admin/tags') || pathname.startsWith('/admin/courses')
        ? new URLSearchParams(window.location.search).get('institutionId')
        : null;
    
    setInstitutionId(id);
  }, [pathname]);

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
  }, [session, status]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (status === 'loading' || institutionLoading) {
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
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-gray-900 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <div className="flex-shrink-0">
              <h2 className="text-white text-lg font-semibold">Admin Panel</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="text-white hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <AdminSidebar 
            institutionId={institutionId} 
            institutionData={institutionData}
            onNavigate={closeSidebar}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 
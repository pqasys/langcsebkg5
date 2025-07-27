import { Suspense } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Suspense fallback={<div className="w-64 bg-gray-900 animate-pulse" />}>
          <AdminSidebar />
        </Suspense>
      </div>

      {/* Mobile sidebar overlay */}
      <div className="md:hidden">
        {/* Mobile menu button would go here */}
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
} 
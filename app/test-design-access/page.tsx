'use client';

import { useSession } from 'next-auth/react';
import { EnhancedPromotionalSidebar } from '@/components/design/EnhancedPromotionalSidebar';

export default function TestDesignAccessPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Design Toolkit Access Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Session Information</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>User Role:</strong> {session?.user?.role || 'None'}</p>
              <p><strong>User Email:</strong> {session?.user?.email || 'Not signed in'}</p>
              <p><strong>Institution Approved:</strong> {session?.user?.institutionApproved ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {/* Access Control Logic */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Access Control Logic</h2>
            <div className="space-y-2">
              <p><strong>showDesignToolkit prop:</strong> {session?.user?.role === 'ADMIN' || session?.user?.role === 'INSTITUTION' ? 'true' : 'false'}</p>
              <p><strong>Can Access Design Toolkit:</strong> {
                (session?.user?.role === 'ADMIN' || session?.user?.role === 'INSTITUTION') && 
                (session?.user?.role === 'ADMIN' || session?.user?.institutionApproved) ? 'Yes' : 'No'
              }</p>
            </div>
          </div>
        </div>

        {/* Enhanced Promotional Sidebar */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Enhanced Promotional Sidebar</h2>
          <div className="flex justify-center">
            <EnhancedPromotionalSidebar 
              maxItems={4}
              showSponsored={true}
              showDesignToolkit={session?.user?.role === 'ADMIN' || session?.user?.role === 'INSTITUTION'}
              userRole={session?.user?.role}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

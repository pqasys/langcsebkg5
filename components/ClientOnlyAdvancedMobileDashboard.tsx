'use client';

import { useEffect, useState } from 'react';

export function ClientOnlyAdvancedMobileDashboard() {
  const [AdvancedMobileDashboard, setAdvancedMobileDashboard] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamically import the AdvancedMobileDashboard only on the client side
    import('./AdvancedMobileDashboard').then((module) => {
import { toast } from 'sonner';
      setAdvancedMobileDashboard(() => module.AdvancedMobileDashboard);
    }).catch((error) => {
      toast.error('Failed to load AdvancedMobileDashboard:');
    });
  }, []);

  // Show loading or placeholder during SSR
  if (!isClient || !AdvancedMobileDashboard) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <h1 className="text-2xl font-bold">Mobile Dashboard</h1>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading mobile dashboard...</p>
        </div>
      </div>
    );
  }

  // Render the actual component on client side
  return <AdvancedMobileDashboard />;
} 
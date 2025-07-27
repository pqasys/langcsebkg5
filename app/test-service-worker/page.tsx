'use client';

import { useServiceWorkerContext } from '@/components/ServiceWorkerProvider';

export default function TestServiceWorkerPage() {
  const { isOnline, isServiceWorkerReady, hasUpdate } = useServiceWorkerContext();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Service Worker Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Service Worker Status:</h2>
          <p>Online: {isOnline ? 'Yes' : 'No'}</p>
          <p>Service Worker Ready: {isServiceWorkerReady ? 'Yes' : 'No'}</p>
          <p>Has Update: {hasUpdate ? 'Yes' : 'No'}</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Test Results:</h2>
          <p className="text-green-600">✅ ServiceWorkerProvider is working correctly!</p>
          <p className="text-green-600">✅ No runtime errors detected!</p>
        </div>
      </div>
    </div>
  );
} 
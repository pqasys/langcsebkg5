'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  RefreshCw
} from 'lucide-react';

interface DesignConfig {
  id: string;
  name: string;
  description?: string;
  approvalStatus: string;
  approvalNotes?: string;
  createdAt: string;
  isApproved: boolean;
  approvedAt?: string;
}

export function DesignApprovalStatus() {
  const { data: session } = useSession();
  const [designConfigs, setDesignConfigs] = useState<DesignConfig[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDesignConfigs = async () => {
    if (session?.user?.role !== 'INSTITUTION') return;

    try {
      setLoading(true);
      const response = await fetch('/api/institution/design-configs');
      if (response.ok) {
        const data = await response.json();
        setDesignConfigs(data.designConfigs || []);
      }
    } catch (error) {
      console.error('Error fetching design configs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignConfigs();
  }, [session]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PENDING':
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'PENDING':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
    }
  };

  if (session?.user?.role !== 'INSTITUTION') {
    return null;
  }

  const pendingConfigs = designConfigs.filter(c => c.approvalStatus === 'PENDING');
  const approvedConfigs = designConfigs.filter(c => c.approvalStatus === 'APPROVED');
  const rejectedConfigs = designConfigs.filter(c => c.approvalStatus === 'REJECTED');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Design Configuration Status</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDesignConfigs}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {designConfigs.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600">No design configurations found.</p>
          </div>
        ) : (
          <>
            {pendingConfigs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-yellow-700">
                  Pending Review ({pendingConfigs.length})
                </h4>
                <div className="space-y-2">
                  {pendingConfigs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(config.approvalStatus)}
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-gray-600">
                            Submitted {new Date(config.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(config.approvalStatus)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {approvedConfigs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-green-700">
                  Approved ({approvedConfigs.length})
                </h4>
                <div className="space-y-2">
                  {approvedConfigs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(config.approvalStatus)}
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-gray-600">
                            Approved {config.approvedAt ? new Date(config.approvedAt).toLocaleDateString() : 'recently'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(config.approvalStatus)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {rejectedConfigs.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-700">
                  Rejected ({rejectedConfigs.length})
                </h4>
                <div className="space-y-2">
                  {rejectedConfigs.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(config.approvalStatus)}
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-gray-600">
                            Rejected {config.approvedAt ? new Date(config.approvedAt).toLocaleDateString() : 'recently'}
                          </p>
                          {config.approvalNotes && (
                            <p className="text-xs text-red-600 mt-1">
                              Note: {config.approvalNotes}
                            </p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(config.approvalStatus)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Palette,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

interface DesignConfig {
  id: string;
  name: string;
  description?: string;
  approvalStatus: string;
  approvalNotes?: string;
  createdAt: string;
  createdBy: string;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  promotionalItems: any[];
  advertisingItems: any[];
  _count: {
    promotionalItems: number;
    advertisingItems: number;
  };
}

export default function DesignApprovalsPage() {
  const { data: session, status } = useSession();
  const [designConfigs, setDesignConfigs] = useState<DesignConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<DesignConfig | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  // Check if user is admin
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You need admin privileges to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fetchDesignConfigs = async (status: string = 'PENDING') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/design-configs/approve?status=${status}`);
      if (!response.ok) throw new Error('Failed to fetch design configs');
      const data = await response.json();
      setDesignConfigs(data.designConfigs);
    } catch (error) {
      console.error('Error fetching design configs:', error);
      toast.error('Failed to load design configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignConfigs(activeTab.toUpperCase());
  }, [activeTab]);

  const handleApproval = async (configId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      const response = await fetch('/api/admin/design-configs/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designConfigId: configId,
          action,
          notes: approvalNotes
        }),
      });

      if (!response.ok) throw new Error('Failed to update approval status');
      
      const data = await response.json();
      toast.success(data.message);
      
      // Refresh the list
      fetchDesignConfigs(activeTab.toUpperCase());
      setSelectedConfig(null);
      setApprovalNotes('');
    } catch (error) {
      console.error('Error updating approval status:', error);
      toast.error('Failed to update approval status');
    }
  };

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
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Design Configuration Approvals</h1>
          <p className="text-gray-600 mt-2">
            Review and approve design configurations from institutions
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending ({designConfigs.filter(c => c.approvalStatus === 'PENDING').length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved ({designConfigs.filter(c => c.approvalStatus === 'APPROVED').length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Rejected ({designConfigs.filter(c => c.approvalStatus === 'REJECTED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading design configurations...</p>
            </div>
          ) : designConfigs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No design configurations found</h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' && 'No pending design configurations to review.'}
                  {activeTab === 'approved' && 'No approved design configurations found.'}
                  {activeTab === 'rejected' && 'No rejected design configurations found.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {designConfigs.map((config) => (
                <Card key={config.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(config.approvalStatus)}
                        <div>
                          <CardTitle className="text-lg">{config.name}</CardTitle>
                          <p className="text-sm text-gray-600">
                            Created {new Date(config.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(config.approvalStatus)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedConfig(selectedConfig?.id === config.id ? null : config)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {selectedConfig?.id === config.id ? 'Hide' : 'Details'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {config.description && (
                    <CardContent className="pt-0 pb-3">
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </CardContent>
                  )}

                  {selectedConfig?.id === config.id && (
                    <CardContent className="pt-0 border-t">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">Usage Information</h4>
                          <div className="space-y-2 text-sm">
                            <p><strong>Promotional Items:</strong> {config._count.promotionalItems}</p>
                            <p><strong>Advertising Items:</strong> {config._count.advertisingItems}</p>
                          </div>
                        </div>

                        {config.approvalStatus === 'PENDING' && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="approval-notes" className="text-sm font-medium">
                                Approval Notes (Optional)
                              </Label>
                              <Textarea
                                id="approval-notes"
                                value={approvalNotes}
                                onChange={(e) => setApprovalNotes(e.target.value)}
                                placeholder="Add notes about your decision..."
                                rows={3}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApproval(config.id, 'APPROVE')}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => handleApproval(config.id, 'REJECT')}
                                variant="destructive"
                                className="flex-1"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}

                        {config.approvalNotes && (
                          <div>
                            <h4 className="font-semibold mb-2">Approval Notes</h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                              {config.approvalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

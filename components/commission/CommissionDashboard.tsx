'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  UserCheck,
  MessageCircle,
  Video,
  CreditCard
} from 'lucide-react';

interface CommissionStats {
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  totalPayouts: number;
  pendingPayouts: number;
  completedPayouts: number;
}

interface CommissionData {
  id: string;
  instructorId?: string;
  hostId?: string;
  sessionId?: string;
  conversationId?: string;
  commissionAmount: number;
  commissionRate: number;
  status: string;
  sessionType: string;
  createdAt: string;
  metadata?: any;
  instructor?: {
    name: string;
    email: string;
  };
  host?: {
    name: string;
    email: string;
  };
  session?: {
    title: string;
    startTime: string;
  };
  conversation?: {
    title: string;
    startTime: string;
  };
}

export default function CommissionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<CommissionStats>({
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    totalPayouts: 0,
    pendingPayouts: 0,
    completedPayouts: 0
  });
  const [instructorCommissions, setInstructorCommissions] = useState<CommissionData[]>([]);
  const [hostCommissions, setHostCommissions] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      setLoading(true);
      
      // Fetch instructor commissions
      const instructorResponse = await fetch('/api/commission/instructor/list');
      const instructorData = await instructorResponse.json();
      
      // Fetch host commissions
      const hostResponse = await fetch('/api/commission/host/list');
      const hostData = await hostResponse.json();

      setInstructorCommissions(instructorData.commissions || []);
      setHostCommissions(hostData.commissions || []);

      // Calculate stats
      const allCommissions = [...instructorData.commissions, ...hostData.commissions];
      const allPayouts = [...instructorData.payouts, ...hostData.payouts];

      setStats({
        totalCommissions: allCommissions.length,
        pendingCommissions: allCommissions.filter((c: CommissionData) => c.status === 'PENDING').length,
        paidCommissions: allCommissions.filter((c: CommissionData) => c.status === 'PAID').length,
        totalPayouts: allPayouts.length,
        pendingPayouts: allPayouts.filter((p: any) => p.status === 'PENDING').length,
        completedPayouts: allPayouts.filter((p: any) => p.status === 'COMPLETED').length
      });

    } catch (error) {
      console.error('Error fetching commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      PROCESSED: { color: 'bg-blue-100 text-blue-800', label: 'Processed' },
      PAID: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      FAILED: { color: 'bg-red-100 text-red-800', label: 'Failed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Commission Dashboard</h1>
        <Button onClick={fetchCommissionData} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
          <TabsTrigger value="hosts">Hosts</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCommissions}</div>
                <p className="text-xs text-muted-foreground">
                  Across all instructors and hosts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Commissions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingCommissions}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting payout processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPayouts}</div>
                <p className="text-xs text-muted-foreground">
                  Processed payments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Commission Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...instructorCommissions, ...hostCommissions]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 10)
                  .map((commission) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {commission.sessionType === 'LIVE_CLASS' ? (
                          <Video className="h-5 w-5 text-blue-500" />
                        ) : (
                          <MessageCircle className="h-5 w-5 text-green-500" />
                        )}
                        <div>
                          <p className="font-medium">
                            {commission.instructor?.name || commission.host?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {commission.session?.title || commission.conversation?.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(commission.commissionAmount)}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(commission.status)}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(commission.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Instructor Commissions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instructorCommissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Video className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{commission.instructor?.name}</p>
                        <p className="text-sm text-muted-foreground">{commission.session?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(commission.session?.startTime || '')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(commission.commissionAmount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {commission.commissionRate}% rate
                      </p>
                      {getStatusBadge(commission.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hosts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Host Commissions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hostCommissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">{commission.host?.name}</p>
                        <p className="text-sm text-muted-foreground">{commission.conversation?.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(commission.conversation?.startTime || '')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(commission.commissionAmount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {commission.commissionRate}% rate
                      </p>
                      {getStatusBadge(commission.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payout Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="w-full" variant="outline">
                  Process Instructor Payouts
                </Button>
                <Button className="w-full" variant="outline">
                  Process Host Payouts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

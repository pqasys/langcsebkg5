'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  MessageSquare,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Star,
  Crown,
  Settings,
  Plus,
  BarChart3,
  Award,
  Target
} from 'lucide-react';

interface HostStats {
  totalConversations: number;
  totalEarnings: number;
  averageRating: number;
  totalParticipants: number;
  currentTier: string;
  tierProgress: number;
  nextTierRequirements: string;
  tierBenefits: string[];
  thisMonthConversations: number;
  thisMonthEarnings: number;
}

interface Conversation {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  participants: number;
  maxParticipants: number;
  earnings: number;
  rating?: number;
}

interface Commission {
  id: string;
  conversationTitle: string;
  date: string;
  amount: number;
  status: string;
  tier: string;
  commissionRate: number;
}

export default function StudentHostDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<HostStats | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session) {
      router.replace('/auth/signin');
      return;
    }

    if (session.user?.role !== 'STUDENT') {
      toast.error('Access denied. Student privileges required.');
      router.replace('/dashboard');
      return;
    }

    fetchHostData();
  }, [session, status, router]);

  const fetchHostData = async () => {
    try {
      setLoading(true);
      
      // Fetch host data
      const [statsRes, conversationsRes, commissionsRes] = await Promise.all([
        fetch(`/api/student/host-stats?userId=${session?.user?.id}`),
        fetch('/api/student/host-conversations'),
        fetch('/api/student/host-commissions')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (conversationsRes.ok) {
        const conversationsData = await conversationsRes.json();
        setConversations(conversationsData.conversations || []);
      }

      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json();
        setCommissions(commissionsData.commissions || []);
      }
    } catch (error) {
      console.error('Error fetching host data:', error);
      toast.error('Failed to load host data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Community': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Experienced': return 'bg-purple-100 text-purple-800';
      case 'Professional': return 'bg-yellow-100 text-yellow-800';
      case 'Master': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span>Loading host dashboard...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Hosting Journey</h2>
            <p className="text-gray-600 mb-6">You haven't hosted any conversations yet. Start hosting to earn commissions and grow your community!</p>
            <Button onClick={() => router.push('/live-conversations/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Host Your First Conversation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host Dashboard</h1>
          <p className="text-gray-600">Manage your conversations, track earnings, and grow your hosting business</p>
        </div>

        {/* Tier Status Card */}
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">Current Tier: {stats.currentTier}</h3>
                </div>
                <p className="text-green-100 mb-4">{stats.nextTierRequirements}</p>
                <Progress value={stats.tierProgress} className="w-full" />
                <p className="text-sm text-green-100 mt-2">{stats.tierProgress}% to next tier</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
                <p className="text-green-100">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.thisMonthConversations} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalParticipants}</div>
              <p className="text-xs text-muted-foreground">
                Across all conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                From participants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.thisMonthEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="conversations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="conversations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Conversations</CardTitle>
                  <Button onClick={() => router.push('/live-conversations/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Host New Conversation
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversations.map((conversation) => (
                      <TableRow key={conversation.id}>
                        <TableCell className="font-medium">{conversation.title}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(conversation.startTime).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {new Date(conversation.startTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(conversation.status)}>
                            {conversation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {conversation.participants}/{conversation.maxParticipants}
                        </TableCell>
                        <TableCell>${conversation.earnings}</TableCell>
                        <TableCell>
                          {conversation.rating ? (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {conversation.rating.toFixed(1)}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Conversation</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissions.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">{commission.conversationTitle}</TableCell>
                        <TableCell>{new Date(commission.date).toLocaleDateString()}</TableCell>
                        <TableCell>${commission.amount}</TableCell>
                        <TableCell>
                          <Badge variant={commission.status === 'PAID' ? 'default' : 'secondary'}>
                            {commission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTierColor(commission.tier)}>
                            {commission.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>{commission.commissionRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Rating</span>
                        <span>{stats.averageRating.toFixed(1)}/5.0</span>
                      </div>
                      <Progress value={(stats.averageRating / 5) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Participant Engagement</span>
                        <span>{stats.totalParticipants} total</span>
                      </div>
                      <Progress value={Math.min((stats.totalParticipants / 100) * 100, 100)} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tier Progress</span>
                        <span>{stats.tierProgress}%</span>
                      </div>
                      <Progress value={stats.tierProgress} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => router.push('/live-conversations/create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Host New Conversation
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/student/host-schedule')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/student/host-earnings')}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Earnings Report
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/student/host-settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Host Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


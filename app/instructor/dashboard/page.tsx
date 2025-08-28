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
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  Award,
  Target,
  BarChart3,
  Video,
  MessageSquare,
  Settings,
  Crown,
  Trophy,
  Zap
} from 'lucide-react';

interface InstructorStats {
  totalClasses: number;
  totalStudents: number;
  totalEarnings: number;
  averageRating: number;
  completionRate: number;
  thisMonthClasses: number;
  thisMonthEarnings: number;
  tierLevel: string;
  tierProgress: number;
  nextTierRequirements: string;
}

interface LiveClass {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: string;
  enrolledStudents: number;
  maxStudents: number;
  price: number;
  commission: number;
}

interface Commission {
  id: string;
  classTitle: string;
  date: string;
  amount: number;
  status: string;
  tier: string;
  commissionRate: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  totalClasses: number;
  averageRating: number;
  lastActive: string;
}

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session) {
      router.replace('/auth/signin');
      return;
    }

    if (session.user?.role !== 'INSTRUCTOR') {
      toast.error('Access denied. Instructor privileges required.');
      router.replace('/dashboard');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch instructor dashboard data
      const [statsRes, classesRes, commissionsRes, studentsRes] = await Promise.all([
        fetch('/api/instructor/dashboard/stats'),
        fetch('/api/instructor/dashboard/classes'),
        fetch('/api/instructor/dashboard/commissions'),
        fetch('/api/instructor/dashboard/students')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setLiveClasses(classesData.classes || []);
      }

      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json();
        setCommissions(commissionsData.commissions || []);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData.students || []);
      }
    } catch (error) {
      console.error('Error fetching instructor dashboard data:', error);
      toast.error('Failed to load dashboard data');
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
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Platinum': return 'bg-blue-100 text-blue-800';
      case 'Diamond': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span>Loading instructor dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Instructor Dashboard</h1>
          <p className="text-gray-600">Manage your live classes, track earnings, and grow your teaching business</p>
        </div>

        {/* Tier Status Card */}
        {stats && (
          <Card className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">Current Tier: {stats.tierLevel}</h3>
                  </div>
                  <p className="text-indigo-100 mb-4">{stats.nextTierRequirements}</p>
                  <Progress value={stats.tierProgress} className="w-full" />
                  <p className="text-sm text-indigo-100 mt-2">{stats.tierProgress}% to next tier</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</div>
                  <p className="text-indigo-100">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClasses}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.thisMonthClasses} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  Across all classes
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
                  {stats.completionRate}% completion rate
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
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="classes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="classes">Live Classes</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Classes</CardTitle>
                  <Button onClick={() => router.push('/instructor/classes/create')}>
                    Create New Class
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Title</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Commission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveClasses.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">{classItem.title}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(classItem.startTime).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {new Date(classItem.startTime).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(classItem.status)}>
                            {classItem.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {classItem.enrolledStudents}/{classItem.maxStudents}
                        </TableCell>
                        <TableCell>${classItem.price}</TableCell>
                        <TableCell>${classItem.commission}</TableCell>
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
                      <TableHead>Class</TableHead>
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
                        <TableCell className="font-medium">{commission.classTitle}</TableCell>
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

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Classes Taken</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.totalClasses}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {student.averageRating.toFixed(1)}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(student.lastActive).toLocaleDateString()}</TableCell>
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
                        <span>Completion Rate</span>
                        <span>{stats?.completionRate}%</span>
                      </div>
                      <Progress value={stats?.completionRate || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Student Satisfaction</span>
                        <span>{stats?.averageRating.toFixed(1)}/5.0</span>
                      </div>
                      <Progress value={(stats?.averageRating || 0) * 20} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Tier Progress</span>
                        <span>{stats?.tierProgress}%</span>
                      </div>
                      <Progress value={stats?.tierProgress || 0} />
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
                    <Button className="w-full" onClick={() => router.push('/instructor/classes/create')}>
                      <Video className="h-4 w-4 mr-2" />
                      Create New Class
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/instructor/schedule')}>
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/instructor/earnings')}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Earnings Report
                    </Button>
                    <Button className="w-full" variant="outline" onClick={() => router.push('/instructor/settings')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
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

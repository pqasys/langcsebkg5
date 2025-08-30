'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { 
  Shield,
  Search,
  Filter,
  Eye,
  EyeOff,
  Users,
  Calendar,
  Award,
  Globe,
  Lock,
  Settings,
  MoreHorizontal,
  Trophy,
  Star,
  Users as UsersIcon
} from 'lucide-react';

interface UserPrivacyData {
  id: string;
  name: string;
  email: string;
  social_visibility: string;
  createdAt: string;
  privacyStats: {
    publicCertificates: number;
    publicCourseAchievements: number;
    publicConnectionAchievements: number;
    publicQuizAchievements: number;
    totalCertificates: number;
    totalCourseAchievements: number;
    totalConnectionAchievements: number;
    totalQuizAchievements: number;
  };
}

export default function AdminAchievementPrivacyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserPrivacyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/achievement-privacy');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users || []);
      } else {
        toast.error('Failed to fetch users');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySetting = async (userId: string, action: string, achievementType: string) => {
    try {
      const response = await fetch('/api/admin/achievement-privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, achievementType })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchUsers(); // Refresh the list
      } else {
        toast.error('Failed to update privacy setting');
      }
    } catch (error) {
      console.error('Error updating privacy setting:', error);
      toast.error('Failed to update privacy setting');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVisibility = !filterVisibility || user.social_visibility === filterVisibility;
    
    return matchesSearch && matchesVisibility;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC': return 'bg-green-100 text-green-800';
      case 'FRIENDS_ONLY': return 'bg-blue-100 text-blue-800';
      case 'PRIVATE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrivacyPercentage = (publicCount: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((publicCount / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Achievement Privacy Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Profiles</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.social_visibility === 'PUBLIC').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Lock className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Private Profiles</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.social_visibility === 'PRIVATE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Friends Only</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.social_visibility === 'FRIENDS_ONLY').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Profile Visibility</label>
              <select
                value={filterVisibility}
                onChange={(e) => setFilterVisibility(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Visibility Levels</option>
                <option value="PUBLIC">Public</option>
                <option value="FRIENDS_ONLY">Friends Only</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Privacy Settings ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Profile Visibility</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Course Achievements</TableHead>
                <TableHead>Connection Achievements</TableHead>
                <TableHead>Quiz Achievements</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getVisibilityColor(user.social_visibility)}>
                      {user.social_visibility.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {user.privacyStats.publicCertificates}/{user.privacyStats.totalCertificates}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPrivacyPercentage(user.privacyStats.publicCertificates, user.privacyStats.totalCertificates)}% public
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {user.privacyStats.publicCourseAchievements}/{user.privacyStats.totalCourseAchievements}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPrivacyPercentage(user.privacyStats.publicCourseAchievements, user.privacyStats.totalCourseAchievements)}% public
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {user.privacyStats.publicConnectionAchievements}/{user.privacyStats.totalConnectionAchievements}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPrivacyPercentage(user.privacyStats.publicConnectionAchievements, user.privacyStats.totalConnectionAchievements)}% public
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {user.privacyStats.publicQuizAchievements}/{user.privacyStats.totalQuizAchievements}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPrivacyPercentage(user.privacyStats.publicQuizAchievements, user.privacyStats.totalQuizAchievements)}% public
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => updatePrivacySetting(user.id, 'make_public', 'all')}
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Make All Public
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updatePrivacySetting(user.id, 'make_private', 'all')}
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Make All Private
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updatePrivacySetting(user.id, 'make_public', 'certificates')}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          Make Certificates Public
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updatePrivacySetting(user.id, 'make_public', 'course_achievements')}
                        >
                          <Trophy className="h-4 w-4 mr-2" />
                          Make Course Achievements Public
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updatePrivacySetting(user.id, 'make_public', 'connection_achievements')}
                        >
                          <UsersIcon className="h-4 w-4 mr-2" />
                          Make Connection Achievements Public
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updatePrivacySetting(user.id, 'make_public', 'quiz_achievements')}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Make Quiz Achievements Public
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, Edit, Trash2, Calendar, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface LiveClass {
  id: string;
  title: string;
  description: string;
  sessionType: string;
  language: string;
  level: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  price: number;
  currency: string;
  status: string;
  isPublic: boolean;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
  };
  participants: Array<{
    id: string;
    userId: string;
    role: string;
    joinedAt: string;
    leftAt: string;
    isActive: boolean;
  }>;
}

export default function InstitutionLiveClassesPage() {
  const { data: session } = useSession();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLiveClasses();
  }, [currentPage, searchTerm, statusFilter, languageFilter, levelFilter]);

  const fetchLiveClasses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter }),
        ...(languageFilter && languageFilter !== 'all' && { language: languageFilter }),
        ...(levelFilter && levelFilter !== 'all' && { level: levelFilter }),
      });

      const response = await fetch(`/api/institution/live-classes?${params}`);
      if (!response.ok) throw new Error('Failed to fetch live classes');

      const data = await response.json();
      setLiveClasses(data.liveClasses);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching live classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live class?')) return;

    try {
      const response = await fetch(`/api/institution/live-classes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete live class');

      fetchLiveClasses(); // Refresh the list
    } catch (error) {
      console.error('Error deleting live class:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      BEGINNER: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
      INTERMEDIATE: { color: 'bg-yellow-100 text-yellow-800', label: 'Intermediate' },
      ADVANCED: { color: 'bg-red-100 text-red-800', label: 'Advanced' },
    };

    const config = levelConfig[level as keyof typeof levelConfig] || { color: 'bg-gray-100 text-gray-800', label: level };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (!session?.user || session.user.role !== 'INSTITUTION_STAFF') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Access denied. Institution staff privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Institution Live Classes</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Live Class
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Live Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading live classes...</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liveClasses.map((liveClass) => (
                    <TableRow key={liveClass.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{liveClass.title}</div>
                          <div className="text-sm text-gray-500">{liveClass.sessionType}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{liveClass.instructor.name}</div>
                          <div className="text-sm text-gray-500">{liveClass.instructor.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {liveClass.course ? (
                          <div className="font-medium">{liveClass.course.title}</div>
                        ) : (
                          <Badge variant="secondary">No Course</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{liveClass.language.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>{getLevelBadge(liveClass.level)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {format(new Date(liveClass.startTime), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {liveClass.participants.length}/{liveClass.maxParticipants}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {liveClass.price} {liveClass.currency}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(liveClass.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(liveClass.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
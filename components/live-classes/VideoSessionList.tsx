'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Users, Video, Filter, Search, Plus, Play, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface VideoSession {
  id: string;
  title: string;
  description?: string;
  sessionType: string;
  language: string;
  level: string;
  startTime: string;
  endTime: string;
  duration: number;
  maxParticipants: number;
  currentParticipants: number;
  status: string;
  price: number;
  isPublic: boolean;
  isRecorded: boolean;
  instructor?: {
    id: string;
    name: string;
    image?: string;
  };
  host?: {
    id: string;
    name: string;
    image?: string;
  };
  isUserParticipant: boolean;
  canJoin: boolean;
  canManage: boolean;
}

interface VideoSessionListProps {
  userType?: string;
  canCreateSessions?: boolean;
}

export function VideoSessionList({ userType, canCreateSessions }: VideoSessionListProps) {
  const { data: session } = useSession();
  const { userType: accessUserType, canAccessLiveClasses } = useSubscription();
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: 'all',
    language: 'all',
    level: 'all',
    sessionType: 'all',
    search: ''
  });

  const effectiveUserType = userType || accessUserType;
  const canCreate = canCreateSessions || effectiveUserType === 'INSTITUTION_STAFF';

  useEffect(() => {
    fetchSessions();
  }, [page, filters]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'all')
        )
      });

      const response = await fetch(`/api/video-sessions?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video sessions');
      }

      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions);
        setTotalPages(data.totalPages);
      } else {
        throw new Error(data.error || 'Failed to fetch video sessions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to load video sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/video-sessions/${sessionId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join session');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Successfully joined session');
        // Redirect to video session interface
        window.location.href = `/video-session/${sessionId}`;
      } else {
        throw new Error(data.error || 'Failed to join session');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to join session');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      const response = await fetch(`/api/video-sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Session deleted successfully');
        fetchSessions(); // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to delete session');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { color: 'bg-blue-100 text-blue-800', label: 'Scheduled' },
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Live' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SCHEDULED;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      BEGINNER: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
      INTERMEDIATE: { color: 'bg-yellow-100 text-yellow-800', label: 'Intermediate' },
      ADVANCED: { color: 'bg-red-100 text-red-800', label: 'Advanced' },
    };

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.BEGINNER;
    
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  if (!canAccessLiveClasses) {
    return (
      <div className="text-center py-12">
        <Video className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No access to live classes</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upgrade your subscription to access live classes and interactive learning sessions.
        </p>
        <div className="mt-6">
          <Link href="/subscription-signup">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Video className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading sessions</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <Button onClick={fetchSessions}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Classes</h2>
          <p className="text-gray-600">
            Join interactive language learning sessions with expert instructors
          </p>
        </div>
        {canCreate && (
          <Link href="/live-classes/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sessions..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="ACTIVE">Live</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Language</label>
              <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Level</label>
              <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All levels</SelectItem>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Type</label>
              <Select value={filters.sessionType} onValueChange={(value) => setFilters(prev => ({ ...prev, sessionType: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="GROUP">Group</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.status || filters.language || filters.level || filters.sessionType
              ? 'Try adjusting your filters'
              : 'No video sessions are currently available.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                          {getStatusBadge(session.status)}
                          {getLevelBadge(session.level)}
                        </div>
                        
                        {session.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">{session.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDateTime(session.startTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(session.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {session.currentParticipants}/{session.maxParticipants} participants
                          </div>
                          {session.price > 0 && (
                            <div className="font-medium text-green-600">
                              ${session.price}
                            </div>
                          )}
                        </div>

                        {session.instructor && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-sm text-gray-500">Instructor:</span>
                            <div className="flex items-center gap-2">
                              {session.instructor.image && (
                                <img
                                  src={session.instructor.image}
                                  alt={session.instructor.name}
                                  className="h-6 w-6 rounded-full"
                                />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {session.instructor.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {session.isUserParticipant ? (
                      <Button variant="outline" disabled>
                        Already Joined
                      </Button>
                    ) : session.canJoin ? (
                      <Button onClick={() => handleJoinSession(session.id)}>
                        <Play className="mr-2 h-4 w-4" />
                        Join Session
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        Session Full
                      </Button>
                    )}

                    {session.canManage && (
                      <div className="flex gap-2">
                        <Link href={`/live-classes/${session.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 
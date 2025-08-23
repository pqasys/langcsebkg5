'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Users, 
  Filter, 
  Globe,
  Star,
  Repeat,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Club {
  id: string;
  title: string;
  language: string;
  level: string;
  start: string;
  end: string;
  capacity: number;
  isRecurring: boolean;
  recurringPatternId?: string;
}

export default function CommunityClubsPage() {
  const { data: session } = useSession();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    language: 'all',
    level: 'all'
  });

  useEffect(() => {
    fetchClubs();
  }, [filters]);

  const fetchClubs = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.language && filters.language !== 'all') params.append('language', filters.language);
      if (filters.level && filters.level !== 'all') params.append('level', filters.level);
      
      // Set date range for next 30 days
      const from = new Date().toISOString();
      const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      params.append('from', from);
      params.append('to', to);
      
      const response = await fetch(`/api/community/clubs?${params.toString()}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setClubs(data);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      toast.error('Failed to load weekly clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (clubId: string) => {
    try {
      const response = await fetch(`/api/community/clubs/${clubId}/rsvp`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('RSVP successful!');
        fetchClubs(); // Refresh to update capacity
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to RSVP');
      }
    } catch (error) {
      console.error('Error RSVPing to club:', error);
      toast.error('Failed to RSVP');
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'fr': '🇫🇷',
      'es': '🇪🇸',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'zh': '🇨🇳',
      'ja': '🇯🇵',
      'ko': '🇰🇷'
    };
    return flags[language] || '🌍';
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-purple-100 text-purple-800',
      'All Levels': 'bg-gray-100 text-gray-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    };
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Weekly Clubs</h1>
            <p className="text-xl text-blue-100 mb-6">
              Join weekly language practice sessions and connect with learners
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/community">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Back to Community
                </Button>
              </Link>
              <Link href="/community/circles">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Users className="h-4 w-4 mr-2" />
                  View Circles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
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
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="All Levels">All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing clubs for the next 30 days
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => {
            const startDateTime = formatDateTime(club.start);
            const endDateTime = formatDateTime(club.end);
            const isUpcomingSession = isUpcoming(club.start);
            
            return (
              <Card key={club.id} className={`hover:shadow-lg transition-shadow ${!isUpcomingSession ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{club.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getLanguageFlag(club.language)}</span>
                        <Badge className={getLevelColor(club.level)}>
                          {club.level}
                        </Badge>
                        {club.isRecurring && (
                          <Badge variant="outline" className="text-xs">
                            <Repeat className="h-3 w-3 mr-1" />
                            Recurring
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{startDateTime.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{startDateTime.time} - {endDateTime.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>Capacity: {club.capacity} participants</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRSVP(club.id)}
                      disabled={!isUpcomingSession}
                    >
                      {isUpcomingSession ? 'RSVP' : 'Past Session'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/video-sessions/${club.id}`}
                      disabled={!isUpcomingSession}
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {clubs.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No clubs found</h3>
              <p className="text-gray-600 mb-4">
                {filters.language || filters.level 
                  ? 'Try adjusting your filters or check back later for new sessions.'
                  : 'No weekly clubs scheduled for the next 30 days. Check back soon!'
                }
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/live-conversations">
                  <Button>
                    Browse Live Conversations
                  </Button>
                </Link>
                <Link href="/community/circles">
                  <Button variant="outline">
                    Join Study Circles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}



'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Trophy, 
  Star, 
  Heart, 
  Share2, 
  Users, 
  TrendingUp,
  Globe,
  Award,
  Calendar,
  MessageCircle,
  Plus,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface Announcement {
  id: string;
  title: string;
  message: string;
  language: string;
  cefrLevel: string;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  certificateId?: string;
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    language: 'all',
    level: 'all'
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    language: 'en',
    cefrLevel: 'A1'
  });
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCertificates: 0,
    totalAchievements: 0,
    activeToday: 0
  });

  const fetchAnnouncements = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.language && filters.language !== 'all') params.append('language', filters.language);
      if (filters.level && filters.level !== 'all') params.append('level', filters.level);
      
      const response = await fetch(`/api/community/announcements?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setAnnouncements(data.data || []);
      } else {
        console.error('API returned error:', data.error);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load community updates');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    // Mock stats for now - in real app, this would come from API
    setStats({
      totalMembers: 1247,
      totalCertificates: 3421,
      totalAchievements: 1893,
      activeToday: 156
    });
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, [fetchAnnouncements, fetchStats]);

  const handleLike = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/community/announcements/${announcementId}/like`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Update local state
        setAnnouncements(prev => prev.map(announcement => 
          announcement.id === announcementId 
            ? { ...announcement, likes: announcement.likes + 1 }
            : announcement
        ));
        toast.success('Liked!');
      }
    } catch (error) {
      console.error('Error liking announcement:', error);
      toast.error('Failed to like announcement');
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.message || !newAnnouncement.language || !newAnnouncement.cefrLevel) {
      toast.error('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/community/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Achievement shared with community!');
        setShowCreateDialog(false);
        setNewAnnouncement({ title: '', message: '', language: 'en', cefrLevel: 'A1' });
        fetchAnnouncements(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to share achievement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to share achievement');
    } finally {
      setCreating(false);
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
      'A1': 'bg-gray-100 text-gray-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-green-100 text-green-800',
      'B2': 'bg-yellow-100 text-yellow-800',
      'C1': 'bg-orange-100 text-orange-800',
      'C2': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-4xl font-bold mb-4">FluentShip Community</h1>
            <p className="text-xl text-blue-100 mb-6">
              Celebrate language learning achievements and connect with fellow learners
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/community/circles">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Users className="h-4 w-4 mr-2" />
                  Join Study Circles
                </Button>
              </Link>
              <Link href="/community/clubs">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Calendar className="h-4 w-4 mr-2" />
                  RSVP to Clubs
                </Button>
              </Link>
              <Link href="/features/community-learning">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Community Members</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.totalCertificates.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Certificates Earned</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{stats.totalAchievements.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Achievements Unlocked</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{stats.activeToday}</div>
              <div className="text-sm text-gray-600">Active Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
                <SelectItem value="A1">A1</SelectItem>
                <SelectItem value="A2">A2</SelectItem>
                <SelectItem value="B1">B1</SelectItem>
                <SelectItem value="B2">B2</SelectItem>
                <SelectItem value="C1">C1</SelectItem>
                <SelectItem value="C2">C2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {session?.user && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Achievement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Achievement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="e.g., Passed B2 Spanish Test!"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Share your learning journey..."
                      value={newAnnouncement.message}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <Select value={newAnnouncement.language} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
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
                    <div>
                      <label className="text-sm font-medium">CEFR Level</label>
                      <Select value={newAnnouncement.cefrLevel} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, cefrLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1</SelectItem>
                          <SelectItem value="A2">A2</SelectItem>
                          <SelectItem value="B1">B1</SelectItem>
                          <SelectItem value="B2">B2</SelectItem>
                          <SelectItem value="C1">C1</SelectItem>
                          <SelectItem value="C2">C2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAnnouncement} disabled={creating}>
                      {creating ? 'Sharing...' : 'Share'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
            Recent Achievements
          </h2>
          
          <div className="grid gap-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={announcement.user.image} />
                      <AvatarFallback>
                        {announcement.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{announcement.user.name}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                      <p className="text-gray-600 mb-4">{announcement.message}</p>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getLanguageFlag(announcement.language)}</span>
                          <span className="font-medium">{announcement.language.toUpperCase()}</span>
                        </div>
                        
                        <Badge className={getLevelColor(announcement.cefrLevel)}>
                          {announcement.cefrLevel}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(announcement.id)}
                            className="flex items-center space-x-1"
                          >
                            <Heart className="h-4 w-4" />
                            <span>{announcement.likes}</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>Comment</span>
                          </Button>
                        </div>
                        
                        {session?.user?.id === announcement.user.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Share2 className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {announcements.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                <p className="text-gray-600 mb-4">
                  Be the first to share your language learning achievements!
                </p>
                <Button onClick={() => window.location.href = '/language-proficiency-test'}>
                  Take Your First Test
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        {session?.user && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">Share Your Achievement</h3>
              <p className="text-gray-600 mb-4">
                Have you earned a certificate? Share it with the community and inspire others!
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => window.location.href = '/language-proficiency-test'}>
                  Take a Test
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(true)}>
                  Share Achievement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 
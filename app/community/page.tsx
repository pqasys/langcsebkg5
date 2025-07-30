'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  MessageCircle
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
  certificate: {
    certificateId: string;
    language: string;
    languageName: string;
    cefrLevel: string;
    score: number;
    totalQuestions: number;
  };
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalCertificates: 0,
    totalAchievements: 0,
    activeToday: 0
  });

  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/community/announcements?limit=50');
      const data = await response.json();
      
      if (data.success) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to load community updates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Mock stats for now - in real app, this would come from API
    setStats({
      totalMembers: 1247,
      totalCertificates: 3421,
      totalAchievements: 1893,
      activeToday: 156
    });
  };

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

  const handleShare = async (certificateId: string) => {
    try {
      const response = await fetch('/api/community/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId, isPublic: true })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Certificate shared with community!');
        fetchAnnouncements(); // Refresh the list
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
      toast.error('Failed to share certificate');
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
            <p className="text-xl text-blue-100">
              Celebrate language learning achievements and connect with fellow learners
            </p>
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
                          <span className="font-medium">{announcement.certificate.languageName}</span>
                        </div>
                        
                        <Badge className={getLevelColor(announcement.certificate.cefrLevel)}>
                          {announcement.certificate.cefrLevel}
                        </Badge>
                        
                        <div className="text-sm text-gray-600">
                          Score: {announcement.certificate.score}/{announcement.certificate.totalQuestions}
                        </div>
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
                            onClick={() => handleShare(announcement.certificate.certificateId)}
                            className="flex items-center space-x-1"
                          >
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
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
                <Button variant="outline" onClick={() => window.location.href = '/certificates'}>
                  View My Certificates
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 
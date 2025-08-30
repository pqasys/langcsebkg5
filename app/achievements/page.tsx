'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Trophy, 
  Award,
  Star,
  Globe,
  Search,
  Filter,
  Users,
  Calendar,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  Download,
  Printer
} from 'lucide-react';
import Link from 'next/link';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  language?: string;
  languageName?: string;
  cefrLevel?: string;
  score?: number;
  totalQuestions?: number;
  completionDate: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  isOwn?: boolean;
}

export default function AchievementsPage() {
  const { data: session, status } = useSession();
  const [ownAchievements, setOwnAchievements] = useState<Achievement[]>([]);
  const [publicAchievements, setPublicAchievements] = useState<Achievement[]>([]);
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showPublic, setShowPublic] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    fetchAchievements();
  }, [session]);

  useEffect(() => {
    filterAchievements();
  }, [ownAchievements, publicAchievements, activeTab, showPublic, searchTerm, languageFilter, levelFilter]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        // Fetch own achievements and certificates
        const [ownRes, publicRes] = await Promise.all([
          fetch('/api/student/dashboard/achievements'),
          fetch('/api/achievements/public')
        ]);

        if (ownRes.ok) {
          const ownData = await ownRes.json();
          setOwnAchievements(ownData.map((ach: any) => ({ ...ach, isOwn: true })) || []);
        }

        if (publicRes.ok) {
          const publicData = await publicRes.json();
          setPublicAchievements(publicData.data || []);
        }
      } else {
        // Fetch only public achievements for unauthenticated users
        const publicRes = await fetch('/api/achievements/public');
        if (publicRes.ok) {
          const publicData = await publicRes.json();
          setPublicAchievements(publicData.data || []);
        }
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAchievements = () => {
    let filtered: Achievement[] = [];

    // Determine which achievements to show based on tab and settings
    if (activeTab === 'own' && isAuthenticated) {
      filtered = ownAchievements;
    } else if (activeTab === 'public') {
      filtered = publicAchievements;
    } else if (activeTab === 'all') {
      if (isAuthenticated) {
        filtered = [...ownAchievements];
        if (showPublic) {
          filtered = [...filtered, ...publicAchievements];
        }
      } else {
        filtered = publicAchievements;
      }
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        achievement.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (achievement.languageName && achievement.languageName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply language filter
    if (languageFilter && languageFilter !== 'all') {
      filtered = filtered.filter(achievement =>
        achievement.language === languageFilter
      );
    }

    // Apply level filter
    if (levelFilter && levelFilter !== 'all') {
      filtered = filtered.filter(achievement =>
        achievement.cefrLevel === levelFilter
      );
    }

    // Sort by completion date (most recent first)
    filtered.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());

    setFilteredAchievements(filtered);
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

  const handlePrint = async (achievementId: string) => {
    try {
      const response = await fetch(`/certificates/${achievementId}`);
      if (response.ok) {
        const htmlContent = await response.text();
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
          setTimeout(() => {
            newWindow.print();
          }, 500);
        }
      }
    } catch (error) {
      console.error('Error printing certificate:', error);
    }
  };

  const handleDownload = async (achievementId: string) => {
    try {
      const response = await fetch(`/api/certificates/${achievementId}/pdf`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${achievementId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {isAuthenticated ? 'My Achievements' : 'Community Achievements'}
            </h1>
            <p className="text-xl text-blue-100">
              {isAuthenticated 
                ? 'Track your progress and discover community achievements'
                : 'Discover and celebrate language learning achievements from our global community'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs for authenticated users */}
        {isAuthenticated && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                All Achievements
              </TabsTrigger>
              <TabsTrigger value="own" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                My Achievements ({ownAchievements.length})
              </TabsTrigger>
              <TabsTrigger value="public" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Community ({publicAchievements.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Achievements
              </div>
              {isAuthenticated && activeTab === 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPublic(!showPublic)}
                  className="flex items-center gap-2"
                >
                  {showPublic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPublic ? 'Hide Public' : 'Show Public'}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search achievements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="A1">A1 - Beginner</SelectItem>
                  <SelectItem value="A2">A2 - Elementary</SelectItem>
                  <SelectItem value="B1">B1 - Intermediate</SelectItem>
                  <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                  <SelectItem value="C1">C1 - Advanced</SelectItem>
                  <SelectItem value="C2">C2 - Mastery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAchievements.length} achievement{filteredAchievements.length !== 1 ? 's' : ''}
            {isAuthenticated && activeTab === 'all' && (
              <span className="ml-2">
                ({ownAchievements.length} own, {publicAchievements.length} public)
              </span>
            )}
          </p>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Award className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
              <p className="text-gray-600 mb-4">
                {isAuthenticated 
                  ? 'Try adjusting your filters or take a language test to earn your first certificate!'
                  : 'Try adjusting your filters or check back later for new achievements.'
                }
              </p>
              {isAuthenticated && (
                <Button asChild>
                  <Link href="/language-proficiency-test">Take Language Test</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <p className="text-sm text-gray-600">{achievement.user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {achievement.isOwn && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mine
                        </Badge>
                      )}
                      {achievement.cefrLevel && (
                        <Badge className={getLevelColor(achievement.cefrLevel)}>
                          {achievement.cefrLevel}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    
                    {achievement.score && achievement.totalQuestions && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {achievement.score}/{achievement.totalQuestions}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round((achievement.score / achievement.totalQuestions) * 100)}% Accuracy
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Earned: {new Date(achievement.completionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {/* Action buttons for own achievements */}
                    {achievement.isOwn && (
                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrint(achievement.id)}
                          className="flex items-center gap-1"
                        >
                          <Printer className="h-3 w-3" />
                          Print
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(achievement.id)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Download, 
  Share2, 
  Eye, 
  Award,
  Star,
  Globe,
  TrendingUp,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface Certificate {
  id: string;
  certificateId: string;
  language: string;
  languageName: string;
  cefrLevel: string;
  score: number;
  totalQuestions: number;
  completionDate: string;
  certificateUrl: string;
  isPublic: boolean;
  sharedAt?: string;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
}

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState({
    totalCertificates: 0,
    totalAchievements: 0,
    averageScore: 0,
    languagesTested: 0,
    highestLevel: 'A1'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCertificates();
      fetchStats();
    }
  }, [session]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/certificates');
      const data = await response.json();
      
      if (data.success) {
        setCertificates(data.data || []);
      } else {
        console.error('Failed to fetch certificates:', data.error);
        setCertificates([]);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/certificates/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data || {
          totalCertificates: 0,
          totalAchievements: 0,
          averageScore: 0,
          languagesTested: 0,
          highestLevel: 'A1'
        });
      } else {
        console.error('Failed to fetch stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleShare = async (certificateId: string, isPublic: boolean) => {
    try {
      const response = await fetch('/api/community/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId, isPublic })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(isPublic ? 'Certificate shared with community!' : 'Certificate made private');
        fetchCertificates(); // Refresh the list
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
      toast.error('Failed to share certificate');
    }
  };

  const handleDownload = (certificateUrl: string, certificateId: string) => {
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = `FluentShip_Certificate_${certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Certificate downloaded!');
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

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in to view your certificates</h1>
          <Button onClick={() => window.location.href = '/auth/signin'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold mb-4">My Certificates</h1>
            <p className="text-xl text-blue-100">
              Your language learning achievements and certificates
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.totalCertificates}</div>
              <div className="text-sm text-gray-600">Certificates</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{stats.totalAchievements}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{stats.languagesTested}</div>
              <div className="text-sm text-gray-600">Languages</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Star className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{stats.highestLevel}</div>
              <div className="text-sm text-gray-600">Highest Level</div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
              Your Certificates
            </h2>
            <Button onClick={() => window.location.href = '/language-proficiency-test'}>
              Take New Test
            </Button>
          </div>
          
          {certificates.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
                <p className="text-gray-600 mb-4">
                  Take your first language proficiency test to earn your first certificate!
                </p>
                <Button onClick={() => window.location.href = '/language-proficiency-test'}>
                  Take Your First Test
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates && certificates.map((certificate) => (
                <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getLanguageFlag(certificate.language)}</span>
                        <div>
                          <CardTitle className="text-lg">{certificate.languageName || certificate.language}</CardTitle>
                          <p className="text-sm text-gray-600">Certificate #{certificate.certificateId || certificate.id}</p>
                        </div>
                      </div>
                      <Badge className={getLevelColor(certificate.cefrLevel)}>
                        {certificate.cefrLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {certificate.score || 0}/{certificate.totalQuestions || 160}
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round(((certificate.score || 0) / (certificate.totalQuestions || 160)) * 100)}% Accuracy
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span>Completed: {certificate.completionDate ? new Date(certificate.completionDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {certificate.isPublic && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span>Shared with community</span>
                          </div>
                        )}
                      </div>
                      
                      {certificate.achievements && certificate.achievements.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Achievements</h4>
                          <div className="space-y-2">
                            {certificate.achievements.map((achievement) => (
                              <div key={achievement.id} className="flex items-center space-x-2 text-sm">
                                <span style={{ color: achievement.color }}>{achievement.icon}</span>
                                <span>{achievement.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(certificate.certificateUrl, certificate.certificateId)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(certificate.certificateUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant={certificate.isPublic ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleShare(certificate.certificateId, !certificate.isPublic)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Ready for your next challenge?</h3>
            <p className="text-gray-600 mb-4">
              Take tests in different languages or improve your score to reach higher CEFR levels!
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.location.href = '/language-proficiency-test'}>
                Take Another Test
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/community'}>
                View Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
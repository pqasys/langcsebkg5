'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  Eye, 
  Award,
  Calendar,
  Star,
  Globe
} from 'lucide-react';

interface CertificateData {
  id: string;
  certificateId: string;
  language: string;
  languageName: string;
  cefrLevel: string;
  score: number;
  totalQuestions: number;
  completionDate: string;
  certificateUrl: string;
  user: {
    name: string;
  };
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: string;
}

export default function CertificateVerificationPage() {
  const params = useParams();
  const certificateId = params.certificateId as string;
  
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (certificateId) {
      verifyCertificate();
    }
  }, [certificateId]);

  const verifyCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/verify/${certificateId}`);
      const data = await response.json();
      
      if (data.success) {
        setCertificate(data.data);
      } else {
        setError(data.error || 'Certificate not found');
      }
    } catch (error) {
      console.error('Error verifying certificate:', error);
      setError('Failed to verify certificate');
    } finally {
      setLoading(false);
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

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h1 className="text-2xl font-bold mb-2">Certificate Not Found</h1>
            <p className="text-gray-600 mb-4">
              {error || 'The certificate you are looking for does not exist or is not publicly accessible.'}
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Certificate Verification</h1>
            <p className="text-xl text-blue-100">
              Verify the authenticity of this FluentShip language proficiency certificate
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Verification Status */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h2 className="text-xl font-semibold text-green-800">Certificate Verified</h2>
                  <p className="text-green-700">This certificate is authentic and has been issued by FluentShip</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Details */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{getLanguageFlag(certificate.language)}</span>
                  <div>
                    <CardTitle className="text-2xl">{certificate.languageName} Language Proficiency</CardTitle>
                    <p className="text-gray-600">Certificate ID: {certificate.certificateId}</p>
                  </div>
                </div>
                <Badge className={getLevelColor(certificate.cefrLevel)}>
                  CEFR {certificate.cefrLevel}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Score Section */}
              <div className="text-center py-6 bg-blue-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {certificate.score}/{certificate.totalQuestions}
                </div>
                <div className="text-lg text-gray-600">
                  {Math.round((certificate.score / certificate.totalQuestions) * 100)}% Accuracy
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-semibold">Certificate Holder</div>
                      <div className="text-gray-600">{certificate.user.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">Language</div>
                      <div className="text-gray-600">{certificate.languageName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-semibold">CEFR Level</div>
                      <div className="text-gray-600">{certificate.cefrLevel}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold">Completion Date</div>
                      <div className="text-gray-600">
                        {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-semibold">Test Type</div>
                      <div className="text-gray-600">Language Proficiency Assessment</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold">Achievements</div>
                      <div className="text-gray-600">{certificate.achievements.length} unlocked</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              {certificate.achievements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Achievements Earned</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {certificate.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span style={{ color: achievement.color }} className="text-2xl">
                          {achievement.icon}
                        </span>
                        <div>
                          <div className="font-semibold">{achievement.title}</div>
                          <div className="text-sm text-gray-600">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-center space-x-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => window.open(certificate.certificateUrl, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Certificate</span>
                </Button>
                
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = certificate.certificateUrl;
                    link.download = `FluentShip_Certificate_${certificate.certificateId}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-2">
                This certificate has been verified and is authentic.
              </p>
              <p className="text-sm text-gray-500">
                Issued by FluentShip • Certificate ID: {certificate.certificateId}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
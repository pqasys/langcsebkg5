'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { 
  Trophy, 
  Lock, 
  Globe, 
  Users, 
  Award, 
  Star,
  Eye,
  EyeOff,
  Settings,
  Shield,
  User
} from 'lucide-react';

interface AchievementPrivacySettings {
  certificates: boolean;
  courseAchievements: boolean;
  connectionAchievements: boolean;
  quizAchievements: boolean;
  overallProfile: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
}

interface AchievementPrivacyManagerProps {
  userId: string;
  disabled?: boolean;
}

export default function AchievementPrivacyManager({ userId, disabled = false }: AchievementPrivacyManagerProps) {
  const [settings, setSettings] = useState<AchievementPrivacySettings>({
    certificates: false,
    courseAchievements: false,
    connectionAchievements: false,
    quizAchievements: false,
    overallProfile: 'PRIVATE'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
  }, [userId]);

  const fetchPrivacySettings = async () => {
    try {
      const response = await fetch(`/api/student/achievement-privacy/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySetting = async (key: keyof AchievementPrivacySettings, value: boolean | string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/student/achievement-privacy/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });

      if (response.ok) {
        setSettings(prev => ({ ...prev, [key]: value }));
        toast.success('Privacy setting updated successfully');
      } else {
        toast.error('Failed to update privacy setting');
      }
    } catch (error) {
      console.error('Error updating privacy setting:', error);
      toast.error('Failed to update privacy setting');
    } finally {
      setSaving(false);
    }
  };

  const getPrivacyIcon = (isPublic: boolean) => {
    return isPublic ? <Globe className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-gray-600" />;
  };

  const getPrivacyLabel = (isPublic: boolean) => {
    return isPublic ? 'Public' : 'Private';
  };

  const getPrivacyBadge = (isPublic: boolean) => {
    return (
      <Badge variant={isPublic ? "default" : "secondary"} className="text-xs">
        {getPrivacyIcon(isPublic)}
        <span className="ml-1">{getPrivacyLabel(isPublic)}</span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Achievement Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Achievement Privacy Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          Control which achievements and certificates are visible to others
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Profile Privacy */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-600" />
              <Label className="text-sm font-medium">Overall Profile Visibility</Label>
            </div>
            <Badge variant="outline" className="text-xs">
              {settings.overallProfile.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-xs text-gray-600">
            This setting affects how your overall profile appears to other users
          </p>
        </div>

        {/* Individual Achievement Types */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Individual Achievement Types</h4>
          
          {/* Certificates */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <Label className="text-sm font-medium">Language Certificates</Label>
                <p className="text-xs text-gray-600">CEFR level certificates and test results</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getPrivacyBadge(settings.certificates)}
              <Switch
                checked={settings.certificates}
                onCheckedChange={(checked) => updatePrivacySetting('certificates', checked)}
                disabled={disabled || saving}
              />
            </div>
          </div>

          {/* Course Achievements */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Trophy className="h-5 w-5 text-blue-600" />
              <div>
                <Label className="text-sm font-medium">Course Achievements</Label>
                <p className="text-xs text-gray-600">Achievements earned through course completion</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getPrivacyBadge(settings.courseAchievements)}
              <Switch
                checked={settings.courseAchievements}
                onCheckedChange={(checked) => updatePrivacySetting('courseAchievements', checked)}
                disabled={disabled || saving}
              />
            </div>
          </div>

          {/* Connection Achievements */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <Label className="text-sm font-medium">Connection Achievements</Label>
                <p className="text-xs text-gray-600">Achievements earned through social interactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getPrivacyBadge(settings.connectionAchievements)}
              <Switch
                checked={settings.connectionAchievements}
                onCheckedChange={(checked) => updatePrivacySetting('connectionAchievements', checked)}
                disabled={disabled || saving}
              />
            </div>
          </div>

          {/* Quiz Achievements */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Star className="h-5 w-5 text-purple-600" />
              <div>
                <Label className="text-sm font-medium">Quiz Achievements</Label>
                <p className="text-xs text-gray-600">Achievements earned through quiz performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getPrivacyBadge(settings.quizAchievements)}
              <Switch
                checked={settings.quizAchievements}
                onCheckedChange={(checked) => updatePrivacySetting('quizAchievements', checked)}
                disabled={disabled || saving}
              />
            </div>
          </div>
        </div>

        {/* Privacy Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Eye className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <h5 className="font-medium text-blue-900 mb-1">Privacy Information</h5>
              <ul className="text-blue-800 space-y-1 text-xs">
                <li>• <strong>Public:</strong> Visible to all users on the platform</li>
                <li>• <strong>Private:</strong> Only visible to you</li>
                <li>• <strong>Friends Only:</strong> Visible to your connections</li>
                <li>• Changes take effect immediately</li>
                <li>• You can change these settings at any time</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newSettings = {
                certificates: true,
                courseAchievements: true,
                connectionAchievements: true,
                quizAchievements: true,
                overallProfile: 'PUBLIC' as const
              };
              setSettings(newSettings);
              // Update all settings
              Object.entries(newSettings).forEach(([key, value]) => {
                updatePrivacySetting(key as keyof AchievementPrivacySettings, value);
              });
            }}
            disabled={disabled || saving}
            className="flex-1"
          >
            <Globe className="h-4 w-4 mr-2" />
            Make All Public
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newSettings = {
                certificates: false,
                courseAchievements: false,
                connectionAchievements: false,
                quizAchievements: false,
                overallProfile: 'PRIVATE' as const
              };
              setSettings(newSettings);
              // Update all settings
              Object.entries(newSettings).forEach(([key, value]) => {
                updatePrivacySetting(key as keyof AchievementPrivacySettings, value);
              });
            }}
            disabled={disabled || saving}
            className="flex-1"
          >
            <Lock className="h-4 w-4 mr-2" />
            Make All Private
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

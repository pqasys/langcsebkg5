'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Trophy, 
  Award, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Users, 
  Eye, 
  EyeOff,
  Share2,
  Download,
  Star,
  Sparkles,
  BarChart3,
  Target,
  Globe,
  Zap,
  Bell,
  FileText,
  ChevronRight,
  ExternalLink,
  Settings,
  UserPlus,
  Heart,
  Crown,
  BookOpen,
  TrendingUp,
  Calendar,
  MapPin,
  Languages,
  Brain,
  Timer,
  Bookmark,
  Lightbulb,
  CheckSquare,
  Square
} from 'lucide-react';

interface TestResult {
  score: number;
  level: string;
  description: string;
  emailSent: boolean;
  answers: Record<string, string>;
  timeSpent: number;
  questions: any[];
}

interface TestCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: TestResult;
  language: string;
  onOptInChange?: (optedIn: boolean) => void;
}

const CEFR_COLORS = {
  'A1': 'bg-gray-100 text-gray-800',
  'A2': 'bg-blue-100 text-blue-800',
  'B1': 'bg-green-100 text-green-800',
  'B2': 'bg-yellow-100 text-yellow-800',
  'C1': 'bg-orange-100 text-orange-800',
  'C2': 'bg-purple-100 text-purple-800'
};

const CEFR_DESCRIPTIONS = {
  'A1': 'Beginner - Can understand and use familiar everyday expressions and very basic phrases.',
  'A2': 'Elementary - Can communicate in simple and routine tasks requiring a simple exchange of information.',
  'B1': 'Intermediate - Can deal with most situations likely to arise while travelling in an area where the language is spoken.',
  'B2': 'Upper Intermediate - Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers possible.',
  'C1': 'Advanced - Can express ideas fluently and spontaneously without much searching for expressions.',
  'C2': 'Mastery - Can understand with ease virtually everything heard or read. Can express very fluently and precisely.'
};

export function TestCompletionModal({ 
  isOpen, 
  onClose, 
  results, 
  language,
  onOptInChange 
}: TestCompletionModalProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [optedInToCommunity, setOptedInToCommunity] = useState(false);
  const [dontRemindAgain, setDontRemindAgain] = useState(false);
  const [currentStep, setCurrentStep] = useState<'results' | 'community' | 'complete'>('results');

  const languageNames: { [key: string]: string } = {
    'en': 'English',
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ko': 'Korean'
  };

  const languageName = languageNames[language] || language;

  // Auto-send notifications and generate certificate on modal open
  useEffect(() => {
    if (isOpen && session?.user?.id && !notificationSent) {
      sendNotificationsAndCertificate();
    }
  }, [isOpen, session?.user?.id, notificationSent]);

  const sendNotificationsAndCertificate = async () => {
    setIsLoading(true);
    try {
      // Send email with results and certificate
      const emailResponse = await fetch('/api/language-proficiency-test/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          results: results,
          language: language
        })
      });

      if (emailResponse.ok) {
        setNotificationSent(true);
        setCertificateGenerated(true);
        toast.success('Certificate and results sent to your email!');
      }

      // Send achievement notification to community (if opted in)
      if (optedInToCommunity) {
        await fetch('/api/community/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Achieved ${results.level} Level in ${languageName}!`,
            message: `I just completed the ${languageName} proficiency test and achieved ${results.level} level with a score of ${results.score}/80. Excited to continue my language learning journey!`,
            language: language,
            cefrLevel: results.level
          })
        });
      }

    } catch (error) {
      console.error('Error sending notifications:', error);
      toast.error('Failed to send notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptInToCommunity = async () => {
    try {
      // Update user profile to make achievements public
      await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievementsPublic: true
        })
      });

      setOptedInToCommunity(true);
      onOptInChange?.(true);
      toast.success('Your achievements are now visible to the community!');
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleSkipCommunity = () => {
    if (dontRemindAgain) {
      // Store preference to not remind again
      localStorage.setItem('dontRemindCommunityOptIn', 'true');
    }
    setCurrentStep('complete');
  };

  const handleViewCertificate = () => {
    window.open('/certificates', '_blank');
  };

  const handleShareAchievement = () => {
    const shareText = `I just achieved ${results.level} level in ${languageName} with a score of ${results.score}/80 on FluentShip! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: 'Language Proficiency Achievement',
        text: shareText,
        url: window.location.origin
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      toast.success('Achievement copied to clipboard!');
    }
  };

  const renderResultsStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Trophy className="h-16 w-16 text-yellow-500" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2" />
          </div>
        </div>
        <DialogTitle className="text-3xl font-bold text-gray-800 mb-2">
          Test Complete! 🎉
        </DialogTitle>
        <DialogDescription className="text-lg text-gray-600">
          Congratulations on completing your {languageName} proficiency test
        </DialogDescription>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {results.score}/80
          </div>
          <div className="text-sm text-gray-600">Total Score</div>
        </Card>
        <Card className="text-center p-4">
          <div className={`text-3xl font-bold mb-1 ${CEFR_COLORS[results.level as keyof typeof CEFR_COLORS].split(' ')[1]}`}>
            {results.level}
          </div>
          <div className="text-sm text-gray-600">CEFR Level</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-purple-600 mb-1">
            {Math.round((results.score / 80) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Percentage</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {Math.floor(results.timeSpent / 60)}m
          </div>
          <div className="text-sm text-gray-600">Time Used</div>
        </Card>
      </div>

      {/* Level Description */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Your Level: {results.level}</h3>
          </div>
          <p className="text-gray-700 text-sm">
            {CEFR_DESCRIPTIONS[results.level as keyof typeof CEFR_DESCRIPTIONS]}
          </p>
        </CardContent>
      </Card>

      {/* Performance Breakdown */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Performance Breakdown</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(cefrLevel => {
              const levelQuestions = results.questions?.filter((q: any) => q.level === cefrLevel) || [];
              const levelCorrect = levelQuestions.filter((q: any) => results.answers[q.id] === q.correctAnswer).length;
              const levelPercentage = levelQuestions.length > 0 ? Math.round((levelCorrect / levelQuestions.length) * 100) : 0;
              
              return (
                <div key={cefrLevel} className="text-center p-3 border rounded-lg bg-gray-50">
                  <div className={`text-lg font-bold mb-1 ${CEFR_COLORS[cefrLevel as keyof typeof CEFR_COLORS].split(' ')[1]}`}>
                    {cefrLevel}
                  </div>
                  <div className="text-xs text-gray-600">{levelCorrect}/{levelQuestions.length}</div>
                  <div className="text-xs text-gray-500 font-medium">{levelPercentage}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notification Status */}
      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          {notificationSent ? (
            <span className="text-green-600">✓ Certificate and results sent to your email</span>
          ) : (
            <span className="text-blue-600">Sending certificate and results to your email...</span>
          )}
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={() => setCurrentStep('community')}
          className="flex-1"
          disabled={isLoading}
        >
          <Users className="h-4 w-4 mr-2" />
          Continue
        </Button>
        <Button 
          variant="outline" 
          onClick={onClose}
          className="flex-1"
        >
          Close
        </Button>
      </div>
    </div>
  );

  const renderCommunityStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Users className="h-16 w-16 text-blue-500" />
            <Heart className="h-6 w-6 text-red-400 absolute -top-2 -right-2" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
          Share Your Achievement
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Make your achievements visible to the community and connect with other learners
        </DialogDescription>
      </div>

      {/* Benefits */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Community Benefits
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Connect with learners at your level</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Find study partners and practice groups</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Share learning tips and resources</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Get motivated by seeing others' progress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Alert>
        <Eye className="h-4 w-4" />
        <AlertDescription>
          Only your name, level, and language will be visible. Your email and personal details remain private.
        </AlertDescription>
      </Alert>

      {/* Opt-in Options */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="dontRemind" 
            checked={dontRemindAgain}
            onCheckedChange={(checked) => setDontRemindAgain(checked as boolean)}
          />
          <Label htmlFor="dontRemind" className="text-sm text-gray-600">
            Don't remind me again about community visibility
          </Label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleOptInToCommunity}
          className="flex-1"
          disabled={isLoading}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Make My Achievements Public
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSkipCommunity}
          className="flex-1"
        >
          Maybe Later
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2" />
          </div>
        </div>
        <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
          All Set! 🎉
        </DialogTitle>
        <DialogDescription className="text-gray-600">
          Your test results have been saved and your certificate is ready
        </DialogDescription>
      </div>

      {/* Next Steps */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            What's Next?
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-green-500" />
              <span>View and download your certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Explore courses at your level</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>Join study groups and connect with learners</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <span>Set learning goals and track your progress</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button 
          onClick={handleViewCertificate}
          variant="outline"
          className="w-full"
        >
                          <FileText className="h-4 w-4 mr-2" />
          View Certificate
        </Button>
        <Button 
          onClick={handleShareAchievement}
          variant="outline"
          className="w-full"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Achievement
        </Button>
      </div>

      <Button 
        onClick={onClose}
        className="w-full"
      >
        <ChevronRight className="h-4 w-4 mr-2" />
        Continue Learning
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          {currentStep === 'results' && renderResultsStep()}
          {currentStep === 'community' && renderCommunityStep()}
          {currentStep === 'complete' && renderCompleteStep()}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

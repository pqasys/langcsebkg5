'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  BookOpen, 
  Target, 
  Clock, 
  Trophy, 
  Award,
  CheckCircle,
  Star,
  Languages,
  Brain,
  Zap,
  Mail,
  LogIn,
  UserPlus,
  ChevronRight,
  Flag,
  GraduationCap,
  Users,
  BarChart3,
  Timer,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedLanguageProficiencyTestInterface } from '@/components/EnhancedLanguageProficiencyTestInterface';
import Link from 'next/link';

interface TestResult {
  score: number;
  level: string;
  description: string;
  emailSent: boolean;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  status: 'available' | 'coming-soon' | 'beta';
  description: string;
}

const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    status: 'available',
    description: 'Proficiency Test'
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    status: 'available',
    description: 'Proficiency Test'
  },
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    status: 'coming-soon',
    description: 'Proficiency Test'
  },
  {
    code: 'de',
    name: 'German',
    flag: '🇩🇪',
    status: 'coming-soon',
    description: 'Proficiency Test'
  },
  {
    code: 'it',
    name: 'Italian',
    flag: '🇮🇹',
    status: 'coming-soon',
    description: 'Proficiency Test'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    flag: '🇵🇹',
    status: 'coming-soon',
    description: 'Proficiency Test'
  },
  {
    code: 'ru',
    name: 'Russian',
    flag: '🇷🇺',
    status: 'coming-soon',
    description: 'Proficiency Test'
  },
  {
    code: 'zh',
    name: 'Chinese',
    flag: '🇨🇳',
    status: 'coming-soon',
    description: 'Proficiency Test'
  },
  {
    code: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
    status: 'coming-soon',
    description: 'Proficiency Test'
  },
  {
    code: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
    status: 'coming-soon',
    description: 'Proficiency Test'
  }
];

export default function LanguageProficiencyTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showTest, setShowTest] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [hasJustSignedIn, setHasJustSignedIn] = useState(false);
  const [timeLimit, setTimeLimit] = useState<number>(60); // Default 60 minutes

  const selectedLang = AVAILABLE_LANGUAGES.find(lang => lang.code === selectedLanguage);

  // Check if user just returned from sign-in and should start test automatically
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Check if there's a language parameter in the URL indicating user just signed in
      const urlParams = new URLSearchParams(window.location.search);
      const languageParam = urlParams.get('language');
      
      // Also check localStorage for a stored language preference
      const storedLanguage = localStorage.getItem('selectedLanguageForTest');
      
      console.log('Auth check:', { 
        search: window.location.search, 
        languageParam, 
        storedLanguage,
        status, 
        hasUser: !!session?.user 
      });
      
      // If there's a language parameter or stored language, it means user just signed in and should start the test
      const languageToUse = languageParam || storedLanguage;
      if (languageToUse && AVAILABLE_LANGUAGES.find(lang => lang.code === languageToUse)) {
        console.log('Setting up auto-start for language:', languageToUse);
        setSelectedLanguage(languageToUse);
        setHasJustSignedIn(true);
        
        // Clear stored language and URL parameters
        localStorage.removeItem('selectedLanguageForTest');
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [status, session]);

  // Start test automatically when user has just signed in and language is available
  useEffect(() => {
    console.log('Auto-start effect triggered:', { hasJustSignedIn, status, selectedLang });
    if (hasJustSignedIn && status === 'authenticated' && selectedLang?.status === 'available') {
      console.log('Starting test automatically for:', selectedLang.name);
      setShowTest(true);
      setTestResults(null);
      toast.success(`Welcome back! Starting ${selectedLang.name} proficiency test...`);
    }
  }, [hasJustSignedIn, status, selectedLang]);

  const handleStartTest = () => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=/language-proficiency-test?language=${selectedLanguage}`);
      return;
    }
    
    if (status === 'authenticated') {
      if (selectedLang?.status === 'available') {
        setShowTest(true);
        setTestResults(null);
      } else {
        toast.info(`${selectedLang?.name} test is coming soon! Currently only English is available.`);
      }
    }
  };

  const handleTestComplete = async (results: any) => {
    setTestResults(results);
    setShowTest(false);
    
    try {
      const response = await fetch('/api/language-proficiency-test/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          results: results,
          language: selectedLanguage
        })
      });
      
      if (response.ok) {
        toast.success('Test results have been sent to your email!');
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const handleExitTest = () => {
    setShowTest(false);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showTest) {
    return (
      <div className="container mx-auto p-6">
        <EnhancedLanguageProficiencyTestInterface
          onComplete={handleTestComplete}
          onExit={handleExitTest}
          language={selectedLanguage}
          timeLimit={timeLimit}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex items-center justify-center mb-6">
              <Globe className="h-16 w-16 mr-4" />
              <h1 className="text-5xl lg:text-6xl font-bold">
                Language Proficiency Test
              </h1>
            </div>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Assess your language skills with our comprehensive CEFR-aligned tests. 
              Get detailed results and personalized recommendations for your learning journey.
            </p>
            
            {/* Language and Timer Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-3">
                    Choose Your Language
                  </label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-full bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_LANGUAGES.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="flex-shrink-0">{language.flag}</span>
                              <span className="font-medium w-20 text-left">{language.name}</span>
                              <span className="text-xs text-gray-500">- {language.description}</span>
                            </div>
                            <Badge 
                              variant={language.status === 'available' ? 'default' : 'secondary'}
                              className="text-xs flex-shrink-0"
                            >
                              {language.status === 'available' ? 'Available' : 'Coming Soon'}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Timer Selection */}
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-3">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Time Limit
                  </label>
                  <Select value={timeLimit.toString()} onValueChange={(value) => setTimeLimit(parseInt(value))}>
                    <SelectTrigger className="w-full bg-white/20 border-white/30 text-white placeholder:text-blue-100">
                      <SelectValue placeholder="Select time limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="45">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>45 minutes (Recommended)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="60">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>60 minutes (Extended)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="90">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>90 minutes (Relaxed)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {status === 'authenticated' ? (
                <Button 
                  onClick={handleStartTest}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                  disabled={selectedLang?.status !== 'available'}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  {selectedLang?.status === 'available' 
                    ? `Start ${selectedLang.name} Test` 
                    : `${selectedLang?.name} Coming Soon`
                  }
                </Button>
              ) : (
                                 <>
                   <Link href={`/auth/signin?callbackUrl=/language-proficiency-test`}>
                     <Button 
                       size="lg"
                       className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                       onClick={() => {
                         // Store the selected language for after sign-in
                         localStorage.setItem('selectedLanguageForTest', selectedLanguage);
                       }}
                     >
                       <LogIn className="h-5 w-5 mr-2" />
                       Sign In to Start
                     </Button>
                   </Link>
                                     <Link href={`/auth/signup?callbackUrl=/language-proficiency-test`}>
                     <Button 
                       variant="outline" 
                       size="lg"
                       className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold bg-transparent"
                       onClick={() => {
                         // Store the selected language for after sign-in
                         localStorage.setItem('selectedLanguageForTest', selectedLanguage);
                       }}
                     >
                       <UserPlus className="h-5 w-5 mr-2" />
                       Create Account
                     </Button>
                   </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        {/* Language Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Languages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our growing collection of language proficiency tests. 
              More languages are being added regularly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_LANGUAGES.map((language) => (
              language.status === 'available' && status === 'unauthenticated' ? (
                <Link 
                  key={language.code}
                  href={`/auth/signin?callbackUrl=/language-proficiency-test`}
                  className="block"
                >
                  <Card 
                    className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-300 cursor-pointer hover:scale-105 hover:shadow-xl"
                    onClick={() => {
                      // Store the selected language for after sign-in
                      localStorage.setItem('selectedLanguageForTest', language.code);
                      toast.info(`Redirecting to sign in for ${language.name} test...`);
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{language.flag}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {language.name}
                          </h3>
                          <div className="mt-3 flex items-center gap-2">
                            <Badge 
                              variant="default"
                              className="text-xs"
                            >
                              Available Now
                            </Badge>
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              Click to Start
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card 
                  key={language.code} 
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    language.status === 'available' 
                      ? 'hover:border-blue-300 cursor-pointer hover:scale-105 hover:shadow-xl' 
                      : 'opacity-75 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (language.status === 'available') {
                      setSelectedLanguage(language.code);
                      // Auto-start test if user is authenticated
                      if (status === 'authenticated') {
                        setShowTest(true);
                        setTestResults(null);
                        toast.success(`Starting ${language.name} proficiency test!`);
                      }
                    }
                  }}
                >
                  {language.status !== 'available' && (
                    <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center z-10">
                      <Badge variant="secondary" className="text-sm">
                        Coming Soon
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{language.flag}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {language.name}
                        </h3>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge 
                            variant={language.status === 'available' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {language.status === 'available' ? 'Available Now' : 'Coming Soon'}
                          </Badge>
                          {language.status === 'available' && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              Click to Start
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enhanced Quiz Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern, interactive, and user-friendly interface with advanced features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Timer className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Timer</h3>
              <p className="text-gray-600 text-sm">
                Configurable time limits (45-90 min) with visual warnings and auto-submission
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Bookmark className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Question Bookmarks</h3>
              <p className="text-gray-600 text-sm">
                Mark questions for review and easily navigate through your test
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Real-time progress indicators and detailed performance breakdown
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Visual Feedback</h3>
              <p className="text-gray-600 text-sm">
                Color-coded CEFR levels, instant feedback, and beautiful results display
              </p>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Language Tests?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive, accurate, and internationally recognized language assessments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="flex justify-center mb-6">
                <Target className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">CEFR Aligned</h3>
              <p className="text-gray-600">
                All tests follow the Common European Framework of Reference for Languages (A1-C2), 
                ensuring international recognition and accuracy.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="flex justify-center mb-6">
                <Brain className="h-16 w-16 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Comprehensive Assessment</h3>
              <p className="text-gray-600">
                Tests cover grammar, vocabulary, idioms, and advanced language structures 
                to provide a complete picture of your proficiency.
              </p>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="flex justify-center mb-6">
                <Mail className="h-16 w-16 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Detailed Results</h3>
              <p className="text-gray-600">
                Receive comprehensive results via email with personalized recommendations 
                and learning suggestions.
              </p>
            </Card>
          </div>
        </div>

        {/* Test Information */}
        {selectedLang && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedLang.name} Test Details
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <BookOpen className="h-6 w-6 mr-3" />
                    Test Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <Badge variant="outline">80 questions</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time Limit:</span>
                    <Badge variant="outline">{timeLimit} minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Format:</span>
                    <Badge variant="outline">Multiple Choice</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <Badge className="bg-green-100 text-green-800">Free</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Trophy className="h-6 w-6 mr-3" />
                    CEFR Levels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">A1 - Beginner</span>
                    <Badge variant="secondary">0-15 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">A2 - Elementary</span>
                    <Badge variant="secondary">16-30 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">B1 - Intermediate</span>
                    <Badge variant="secondary">31-45 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">B2 - Upper Intermediate</span>
                    <Badge variant="secondary">46-55 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">C1 - Advanced</span>
                    <Badge variant="secondary">56-70 points</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">C2 - Proficient</span>
                    <Badge variant="secondary">71-80 points</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Results Display */}
        {testResults && (
          <Card className="mb-16 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-green-600 text-xl">
                <CheckCircle className="h-6 w-6 mr-3" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {testResults.score}/80
                  </div>
                  <div className="text-sm text-gray-600">Total Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {testResults.level}
                  </div>
                  <div className="text-sm text-gray-600">CEFR Level</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {Math.round((testResults.score / 80) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Percentage</div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">{testResults.description}</p>
              </div>
              {testResults.emailSent && (
                <Alert className="mt-4">
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Detailed results have been sent to your email address.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Star className="h-6 w-6 mr-3" />
                What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Your current CEFR language level
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Detailed breakdown of your strengths
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Areas for improvement
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Personalized learning recommendations
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Certificate of completion
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Languages className="h-6 w-6 mr-3" />
                Test Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Grammar and syntax
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Vocabulary and idioms
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Advanced language structures
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Contextual understanding
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Language precision
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
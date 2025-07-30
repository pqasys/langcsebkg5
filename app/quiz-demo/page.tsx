'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedLanguageProficiencyTestInterface } from '@/components/EnhancedLanguageProficiencyTestInterface';
import { 
  Timer, 
  Bookmark, 
  BarChart3, 
  Sparkles, 
  Clock, 
  Target, 
  Brain, 
  Award,
  Play,
  Settings,
  Zap
} from 'lucide-react';

interface TestResult {
  score: number;
  level: string;
  description: string;
  emailSent: boolean;
}

export default function QuizDemoPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [timeLimit, setTimeLimit] = useState<number>(45);
  const [testResults, setTestResults] = useState<TestResult | null>(null);

  const handleTestComplete = (results: TestResult) => {
    setTestResults(results);
    setShowQuiz(false);
  };

  const handleExitTest = () => {
    setShowQuiz(false);
  };

  if (showQuiz) {
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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <Zap className="h-16 w-16 mr-4" />
            <h1 className="text-5xl font-bold">Enhanced Quiz Demo</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Experience the new and improved language proficiency test interface with advanced features, 
            smart timer, and beautiful visual design.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Configuration Section */}
        <Card className="mb-12 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center text-2xl">
              <Settings className="h-6 w-6 mr-3" />
              Quiz Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Language
                </label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="fr">🇫🇷 French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Time Limit
                </label>
                <Select value={timeLimit.toString()} onValueChange={(value) => setTimeLimit(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="45">45 minutes (Recommended)</SelectItem>
                    <SelectItem value="60">60 minutes (Extended)</SelectItem>
                    <SelectItem value="90">90 minutes (Relaxed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                onClick={() => setShowQuiz(true)}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Demo Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features Showcase */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Enhanced Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes our new quiz interface special
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <Timer className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Smart Timer</h3>
              <p className="text-gray-600 text-sm">
                Configurable time limits with visual warnings at 10 and 5 minutes remaining
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <Bookmark className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Question Bookmarks</h3>
              <p className="text-gray-600 text-sm">
                Mark questions for review and easily navigate through your test
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-600 text-sm">
                Real-time progress indicators and detailed performance breakdown
              </p>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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

        {/* Results Display */}
        {testResults && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-16 w-16 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">Demo Complete!</CardTitle>
              <p className="text-gray-600">Here are your test results</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
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
              <div className="p-4 bg-white rounded-lg">
                <p className="text-gray-700">{testResults.description}</p>
              </div>
              <div className="mt-6 text-center">
                <Button 
                  onClick={() => setTestResults(null)}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technical Details */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Technical Improvements
            </h2>
            <p className="text-gray-600">
              Built with modern React patterns and enhanced user experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold">Performance</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Optimized re-renders with useCallback</li>
                <li>• Efficient timer management</li>
                <li>• Smooth animations and transitions</li>
              </ul>
            </Card>

            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold">User Experience</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Intuitive navigation</li>
                <li>• Clear visual feedback</li>
                <li>• Responsive design</li>
              </ul>
            </Card>

            <Card className="p-6 border-0 shadow-md">
              <div className="flex items-center mb-4">
                <Clock className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold">Timer Features</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Configurable time limits</li>
                <li>• Smart warnings</li>
                <li>• Auto-submission</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Database, 
  Plus, 
  BarChart3, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target,
  Brain,
  Award
} from 'lucide-react';

interface QuestionBankStats {
  totalQuestions: number;
  questionsByLevel: Record<string, number>;
  questionsByCategory: Record<string, number>;
  questionsByDifficulty: Record<string, number>;
}

export default function LanguageProficiencyBanksPage() {
  const [stats, setStats] = useState<QuestionBankStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/language-proficiency-test/initialize?languageCode=en');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load question bank statistics');
    } finally {
      setLoading(false);
    }
  };

  const initializeBank = async () => {
    setInitializing(true);
    try {
      const response = await fetch('/api/language-proficiency-test/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languageCode: 'en' })
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        toast.success('Question bank initialized successfully!');
      } else {
        toast.error('Failed to initialize question bank');
      }
    } catch (error) {
      console.error('Error initializing bank:', error);
      toast.error('Failed to initialize question bank');
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const categories = ['grammar', 'vocabulary', 'reading'];
  const difficulties = ['easy', 'medium', 'hard'];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Language Proficiency Question Banks</h1>
          <p className="text-muted-foreground">
            Manage and monitor language proficiency test question banks
          </p>
        </div>
        <Button onClick={initializeBank} disabled={initializing}>
          {initializing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Initialize Bank
            </>
          )}
        </Button>
      </div>

      {stats ? (
        <div className="grid gap-6">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                English Question Bank Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(stats.questionsByLevel).length}
                  </div>
                  <div className="text-sm text-gray-600">CEFR Levels</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(stats.questionsByCategory).length}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Object.keys(stats.questionsByDifficulty).length}
                  </div>
                  <div className="text-sm text-gray-600">Difficulty Levels</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CEFR Levels Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                CEFR Level Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {cefrLevels.map(level => (
                  <div key={level} className="text-center p-3 border rounded-lg">
                    <div className="text-lg font-semibold">{level}</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.questionsByLevel[level] || 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stats.totalQuestions > 0 
                        ? `${Math.round(((stats.questionsByLevel[level] || 0) / stats.totalQuestions) * 100)}%`
                        : '0%'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categories Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map(category => (
                  <div key={category} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold capitalize">{category}</span>
                      <Badge variant="outline">
                        {stats.questionsByCategory[category] || 0}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${stats.totalQuestions > 0 
                            ? ((stats.questionsByCategory[category] || 0) / stats.totalQuestions) * 100 
                            : 0}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Difficulty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map(difficulty => (
                  <div key={difficulty} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold capitalize">{difficulty}</span>
                      <Badge 
                        variant={difficulty === 'easy' ? 'default' : 
                                difficulty === 'medium' ? 'secondary' : 'destructive'}
                      >
                        {stats.questionsByDifficulty[difficulty] || 0}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          difficulty === 'easy' ? 'bg-green-600' :
                          difficulty === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{
                          width: `${stats.totalQuestions > 0 
                            ? ((stats.questionsByDifficulty[difficulty] || 0) / stats.totalQuestions) * 100 
                            : 0}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Question Bank Status</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading question bank statistics...
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No question bank found. Click "Initialize Bank" to create the English question bank.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={loadStats} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Refresh Stats
                </>
              )}
            </Button>
            <Button onClick={initializeBank} disabled={initializing} variant="outline">
              {initializing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Initialize Bank
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
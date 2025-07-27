'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Star,
  ArrowRight,
  Target,
  Users,
  Award,
  Zap,
  Heart,
  Eye,
  Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  type: 'course' | 'module' | 'resource' | 'practice';
  title: string;
  description: string;
  reason: string;
  matchScore: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  category: string;
  tags: string[];
  image?: string;
  instructor?: string;
  rating?: number;
  enrolledCount?: number;
  isNew?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
}

interface LearningProfile {
  interests: string[];
  preferredDifficulty: string;
  averageStudyTime: number;
  preferredCategories: string[];
  completedCourses: string[];
  currentStreak: number;
  learningGoals: string[];
}

interface PersonalizedRecommendationsProps {
  studentId: string;
  maxRecommendations?: number;
}

export default function PersonalizedRecommendations({ 
  studentId, 
  maxRecommendations = 6 
}: PersonalizedRecommendationsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [learningProfile, setLearningProfile] = useState<LearningProfile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchRecommendations();
  }, [studentId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/recommendations?studentId=${studentId}&limit=${maxRecommendations}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
        setLearningProfile(data.learningProfile);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load recommendations. Please try again or contact support if the problem persists.`);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleRecommendationClick = (recommendation: Recommendation) => {
    switch (recommendation.type) {
      case 'course':
        router.push(`/courses/${recommendation.id}`);
        break;
      case 'module':
        router.push(`/student/courses/${recommendation.id}`);
        break;
      case 'resource':
        router.push(`/resources/${recommendation.id}`);
        break;
      case 'practice':
        router.push(`/practice/${recommendation.id}`);
        break;
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const categories = ['all', ...new Set(recommendations.map(rec => rec.category))];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Personalized Recommendations
          </CardTitle>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
        {learningProfile && (
          <p className="text-sm text-muted-foreground">
            Based on your {learningProfile.currentStreak} day learning streak and preferences
          </p>
        )}
      </CardHeader>
      <CardContent>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'All' : category}
            </Button>
          ))}
        </div>

        {/* Recommendations Grid */}
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations available.</p>
            <p className="text-sm">Complete more courses to get personalized recommendations!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredRecommendations.map((recommendation) => (
              <Card 
                key={recommendation.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group h-full flex flex-col"
                onClick={() => handleRecommendationClick(recommendation)}
              >
                <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                  {/* Header with badges */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getDifficultyColor(recommendation.difficulty)}`}
                      >
                        {recommendation.difficulty}
                      </Badge>
                      {recommendation.isNew && (
                        <Badge variant="default" className="bg-green-600 text-xs">
                          New
                        </Badge>
                      )}
                      {recommendation.isPopular && (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {recommendation.isTrending && (
                        <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xs sm:text-sm font-semibold ${getMatchScoreColor(recommendation.matchScore)}`}>
                        {recommendation.matchScore}% match
                      </div>
                      <Progress 
                        value={recommendation.matchScore} 
                        className="w-12 sm:w-16 h-1 mt-1" 
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors text-sm sm:text-base">
                    {recommendation.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3 flex-grow">
                    {recommendation.description}
                  </p>

                  {/* Reason */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-lg mb-2 sm:mb-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300 line-clamp-2">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      {recommendation.reason}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(recommendation.estimatedTime)}
                      </span>
                      {recommendation.rating && (
                        <span className="flex items-center">
                          <Star className="w-3 h-3 mr-1 text-yellow-500" />
                          {recommendation.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    {recommendation.instructor && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        by {recommendation.instructor}
                      </p>
                    )}
                    {recommendation.enrolledCount && (
                      <p className="text-xs text-muted-foreground">
                        {recommendation.enrolledCount} students enrolled
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  {recommendation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                      {recommendation.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {recommendation.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{recommendation.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-auto"
                    variant="outline"
                  >
                    {recommendation.type === 'course' && <BookOpen className="w-3 h-3 mr-1" />}
                    {recommendation.type === 'module' && <Play className="w-3 h-3 mr-1" />}
                    {recommendation.type === 'resource' && <Eye className="w-3 h-3 mr-1" />}
                    {recommendation.type === 'practice' && <Target className="w-3 h-3 mr-1" />}
                    <span className="hidden sm:inline">{recommendation.type === 'course' ? 'View Course' : 'Start Learning'}</span>
                    <span className="sm:hidden">{recommendation.type === 'course' ? 'View' : 'Start'}</span>
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Learning Profile Summary */}
        {learningProfile && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
            <h4 className="font-medium mb-2">Your Learning Profile</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Streak</p>
                <p className="font-semibold">{learningProfile.currentStreak} days</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Study Time</p>
                <p className="font-semibold">{formatTime(learningProfile.averageStudyTime)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Completed Courses</p>
                <p className="font-semibold">{learningProfile.completedCourses.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Preferred Difficulty</p>
                <p className="font-semibold capitalize">{learningProfile.preferredDifficulty}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
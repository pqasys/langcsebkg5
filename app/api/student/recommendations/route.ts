import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Quick auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const category = searchParams.get('category');

    // Return mock data immediately - no database queries
    const mockRecommendations = [
      {
        id: '1',
        type: 'course',
        title: 'Introduction to Language Learning',
        description: 'A comprehensive course for beginners.',
        reason: 'Perfect for beginners starting their journey',
        matchScore: 95,
        difficulty: 'beginner',
        estimatedTime: 120,
        category: 'Language Learning',
        tags: ['beginner', 'comprehensive'],
        instructor: 'Language Institute',
        rating: 4.8,
        enrolledCount: 150,
        isNew: true,
        isPopular: true,
        isTrending: false
      },
      {
        id: '2',
        type: 'course',
        title: 'Advanced Grammar Mastery',
        description: 'Master complex grammatical structures.',
        reason: 'Builds on your current knowledge',
        matchScore: 88,
        difficulty: 'intermediate',
        estimatedTime: 180,
        category: 'Grammar',
        tags: ['advanced', 'grammar'],
        instructor: 'Advanced Language Center',
        rating: 4.6,
        enrolledCount: 89,
        isNew: false,
        isPopular: true,
        isTrending: true
      }
    ];

    const learningProfile = {
      interests: ['Language Learning', 'Grammar'],
      preferredDifficulty: 'intermediate',
      averageStudyTime: 45,
      preferredCategories: ['Language Learning'],
      completedCourses: 2,
      inProgressCourses: 1,
      currentStreak: 7,
      learningGoals: ['Improve skills', 'Complete certification'],
      averageScore: 78
    };

    return NextResponse.json({
      recommendations: mockRecommendations.slice(0, limit),
      learningProfile
    });

  } catch (error) {
    console.error('Error in recommendations API:');
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 
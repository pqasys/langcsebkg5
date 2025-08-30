import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Fetch all public achievements including certificates
    const [studentAchievements, connectionAchievements, certificates] = await Promise.all([
      // Fetch public student achievements
      prisma.studentAchievement.findMany({
        where: {
          isPublic: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          earnedAt: 'desc'
        }
      }),
      
      // Fetch public connection achievements
      prisma.connectionAchievement.findMany({
        where: {
          isPublic: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          earnedAt: 'desc'
        }
      }),

      // Fetch public certificates
      prisma.certificate.findMany({
        where: {
          isPublic: true
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    // Combine and format all achievements
    const allAchievements = [
      // Student achievements
      ...studentAchievements.map(ach => ({
        id: ach.id,
        title: ach.achievement,
        description: `Student achievement: ${ach.achievement}`,
        icon: '🎓',
        color: '#10b981',
        completionDate: ach.earnedAt,
        user: ach.user
      })),
      
      // Connection achievements
      ...connectionAchievements.map(ach => ({
        id: ach.id,
        title: ach.title,
        description: ach.description || `Connection achievement: ${ach.achievementType}`,
        icon: ach.icon,
        color: '#3b82f6',
        completionDate: ach.earnedAt,
        user: ach.user
      })),

      // Certificates (treating them as achievements)
      ...certificates.map(cert => ({
        id: cert.id,
        title: `${cert.languageName} Proficiency Certificate`,
        description: `Achieved CEFR Level ${cert.cefrLevel} in ${cert.languageName}`,
        icon: '🏆',
        color: '#3b82f6',
        language: cert.language,
        languageName: cert.languageName,
        cefrLevel: cert.cefrLevel,
        score: cert.score,
        totalQuestions: cert.totalQuestions,
        completionDate: cert.completionDate,
        user: cert.user
      }))
    ];

    // Sort by completion date (most recent first)
    allAchievements.sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
    
    return NextResponse.json({
      success: true,
      data: allAchievements,
      message: 'Public achievements retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching public achievements:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch public achievements',
      message: 'Unable to retrieve public achievements at this time'
    }, { status: 500 });
  }
}

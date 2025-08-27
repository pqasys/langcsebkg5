import { prisma } from '@/lib/prisma';

export interface QuizAccessStatus {
  hasAccess: boolean;
  reason?: string;
  restrictions?: {
    maxQuestions: number;
    showExplanations: boolean;
    allowRetry: boolean;
    trackProgress: boolean;
  };
  upgradePrompt?: {
    message: string;
    cta: string;
    planType: 'PREMIUM' | 'PRO';
  };
}

export class CommunityQuizAccessService {
  /**
   * Check if a user has access to a specific quiz
   */
  static async checkQuizAccess(
    userId: string,
    quizId: string
  ): Promise<QuizAccessStatus> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      });

      if (!user) {
        return { hasAccess: false, reason: 'User not found' };
      }

      // Premium users have unlimited access
      if (user.subscription?.planType === 'PREMIUM' || user.subscription?.planType === 'PRO') {
        return { hasAccess: true, restrictions: null };
      }

      // Check monthly usage for free users
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      if (!user.lastQuizReset || user.lastQuizReset < startOfMonth) {
        // Reset monthly usage
        await prisma.user.update({
          where: { id: userId },
          data: { monthlyQuizUsage: 0, lastQuizReset: now }
        });
      }

      if (user.monthlyQuizUsage >= 1) {
        return {
          hasAccess: false,
          reason: 'Monthly free quiz limit reached',
          upgradePrompt: {
            message: 'Upgrade to Premium for unlimited quiz access!',
            cta: 'Upgrade Now',
            planType: 'PREMIUM'
          }
        };
      }

      return {
        hasAccess: true,
        restrictions: {
          maxQuestions: 10,
          showExplanations: false,
          allowRetry: false,
          trackProgress: false
        }
      };
    } catch (error) {
      console.error('Error checking quiz access:', error);
      return { hasAccess: false, reason: 'Error checking access' };
    }
  }

  /**
   * Get user's quiz usage statistics
   */
  static async getUserQuizUsage(userId: string): Promise<{
    monthlyUsage: number;
    totalAttempts: number;
    averageScore: number;
    lastReset: Date | null;
  }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          monthlyQuizUsage: true,
          lastQuizReset: true
        }
      });

      const attempts = await prisma.communityQuizAttempt.findMany({
        where: { userId },
        select: {
          score: true,
          percentage: true
        }
      });

      const totalAttempts = attempts.length;
      const averageScore = attempts.length > 0 
        ? attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length 
        : 0;

      return {
        monthlyUsage: user?.monthlyQuizUsage || 0,
        totalAttempts,
        averageScore: Math.round(averageScore * 100) / 100,
        lastReset: user?.lastQuizReset || null
      };
    } catch (error) {
      console.error('Error getting user quiz usage:', error);
      return {
        monthlyUsage: 0,
        totalAttempts: 0,
        averageScore: 0,
        lastReset: null
      };
    }
  }

  /**
   * Get available quizzes for community members
   */
  static async getAvailableQuizzes(limit: number = 20): Promise<any[]> {
    try {
      const quizzes = await prisma.quizzes.findMany({
        where: {
          is_published: true,
          // Only show quizzes from active institutions
          module: {
            course: {
              institution: {
                subscription: {
                  status: 'ACTIVE'
                }
              }
            }
          }
        },
        include: {
          module: {
            include: {
              course: {
                include: {
                  institution: {
                    select: { name: true }
                  }
                }
              }
            }
          },
          quiz_questions: {
            select: { id: true }
          }
        },
        take: limit,
        orderBy: { created_at: 'desc' }
      });

      return quizzes.map(quiz => ({
        ...quiz,
        questionCount: quiz.quiz_questions.length
      }));
    } catch (error) {
      console.error('Error getting available quizzes:', error);
      return [];
    }
  }
}

import { prisma } from '@/lib/prisma'
import { notificationService } from '@/lib/notification'

export interface ConnectionAchievement {
  type: string
  title: string
  description: string
  icon: string
  points: number
  condition: (userId: string) => Promise<boolean>
}

export interface ConnectionActivity {
  type: string
  points: number
  description: string
}

export interface RewardTier {
  points: number
  reward: string
  description: string
  type: 'TRIAL' | 'DISCOUNT' | 'SESSION' | 'CERTIFICATE' | 'SUBSCRIPTION'
}

export class ConnectionIncentivesService {
  // Connection activity points
  private static readonly CONNECTION_POINTS: { [key: string]: ConnectionActivity } = {
    sendConnectionRequest: { type: 'sendConnectionRequest', points: 5, description: 'Sent a connection request' },
    acceptConnectionRequest: { type: 'acceptConnectionRequest', points: 10, description: 'Accepted a connection request' },
    completeStudySession: { type: 'completeStudySession', points: 25, description: 'Completed a study session with connection' },
    shareAchievement: { type: 'shareAchievement', points: 15, description: 'Shared an achievement with connections' },
    participateInCircle: { type: 'participateInCircle', points: 20, description: 'Participated in a community circle' },
    helpOtherLearner: { type: 'helpOtherLearner', points: 30, description: 'Helped another learner improve their skills' },
    createStudyGroup: { type: 'createStudyGroup', points: 50, description: 'Created a study group' },
    referNewUser: { type: 'referNewUser', points: 100, description: 'Referred a new user to the platform' }
  }

  // Connection achievements
  private static readonly CONNECTION_ACHIEVEMENTS: ConnectionAchievement[] = [
    {
      type: 'first_connection',
      title: 'Social Butterfly',
      description: 'Made your first connection',
      icon: '🦋',
      points: 50,
      condition: async (userId: string) => {
        const connectionCount = await prisma.userConnection.count({
          where: {
            OR: [{ user1Id: userId }, { user2Id: userId }]
          }
        })
        return connectionCount === 1
      }
    },
    {
      type: 'connection_streak',
      title: 'Network Builder',
      description: 'Connected with 10+ learners',
      icon: '🌐',
      points: 200,
      condition: async (userId: string) => {
        const connectionCount = await prisma.userConnection.count({
          where: {
            OR: [{ user1Id: userId }, { user2Id: userId }]
          }
        })
        return connectionCount >= 10
      }
    },
    {
      type: 'study_partner',
      title: 'Study Buddy',
      description: 'Completed 5 study sessions with connections',
      icon: '👥',
      points: 150,
      condition: async (userId: string) => {
        const sessionCount = await prisma.connectionPoints.count({
          where: {
            userId,
            activityType: 'completeStudySession'
          }
        })
        return sessionCount >= 5
      }
    },
    {
      type: 'mentor',
      title: 'Language Mentor',
      description: 'Helped 3+ learners improve their skills',
      icon: '🎓',
      points: 300,
      condition: async (userId: string) => {
        const helpCount = await prisma.connectionPoints.count({
          where: {
            userId,
            activityType: 'helpOtherLearner'
          }
        })
        return helpCount >= 3
      }
    },
    {
      type: 'cultural_ambassador',
      title: 'Cultural Ambassador',
      description: 'Shared cultural insights with 5+ connections',
      icon: '🏛️',
      points: 250,
      condition: async (userId: string) => {
        const shareCount = await prisma.connectionPoints.count({
          where: {
            userId,
            activityType: 'shareAchievement'
          }
        })
        return shareCount >= 5
      }
    }
  ]

  // Reward tiers
  private static readonly REWARD_TIERS: RewardTier[] = [
    { points: 100, reward: 'Free 1-week premium trial', description: 'Try premium features for free', type: 'TRIAL' },
    { points: 250, reward: '50% off next month subscription', description: 'Save on your subscription', type: 'DISCOUNT' },
    { points: 500, reward: 'Free live conversation session', description: 'Practice with native speakers', type: 'SESSION' },
    { points: 1000, reward: 'Free certificate test', description: 'Test your language proficiency', type: 'CERTIFICATE' },
    { points: 2000, reward: 'Free 1-month premium subscription', description: 'Full premium access for a month', type: 'SUBSCRIPTION' }
  ]

  /**
   * Award points for a connection activity
   */
  static async awardPoints(userId: string, activityType: string, description?: string): Promise<number> {
    const activity = this.CONNECTION_POINTS[activityType]
    if (!activity) {
      throw new Error(`Unknown activity type: ${activityType}`)
    }

    const points = await prisma.connectionPoints.create({
      data: {
        userId,
        activityType,
        points: activity.points,
        description: description || activity.description
      }
    })

    // Check for new achievements
    await this.checkAchievements(userId)

    return points.points
  }

  /**
   * Get user's total points
   */
  static async getUserPoints(userId: string): Promise<number> {
    const result = await prisma.connectionPoints.aggregate({
      where: { userId },
      _sum: { points: true }
    })
    return result._sum.points || 0
  }

  /**
   * Get user's points history
   */
  static async getUserPointsHistory(userId: string, limit: number = 20): Promise<any[]> {
    return await prisma.connectionPoints.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * Check and award achievements
   */
  static async checkAchievements(userId: string): Promise<string[]> {
    const newAchievements: string[] = []

    for (const achievement of this.CONNECTION_ACHIEVEMENTS) {
      // Check if user already has this achievement
      const existing = await prisma.connectionAchievement.findFirst({
        where: {
          userId,
          achievementType: achievement.type
        }
      })

      if (!existing && await achievement.condition(userId)) {
        // Award achievement
        await prisma.connectionAchievement.create({
          data: {
            userId,
            achievementType: achievement.type,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            points: achievement.points
          }
        })

        // Award points for achievement
        await this.awardPoints(userId, 'achievement_unlocked', `Unlocked: ${achievement.title}`)

        // Send notification
        await notificationService.sendNotificationWithTemplate(
          userId,
          'achievement_unlocked',
          {
            achievementTitle: achievement.title,
            achievementDescription: achievement.description,
            points: achievement.points
          }
        )

        newAchievements.push(achievement.title)
      }
    }

    return newAchievements
  }

  /**
   * Get user's achievements
   */
  static async getUserAchievements(userId: string): Promise<any[]> {
    return await prisma.connectionAchievement.findMany({
      where: { userId },
      orderBy: { earnedAt: 'desc' }
    })
  }

  /**
   * Get leaderboard for achievements
   */
  static async getAchievementLeaderboard(limit: number = 10): Promise<any[]> {
    return await prisma.connectionAchievement.groupBy({
      by: ['userId'],
      _count: { id: true },
      _sum: { points: true },
      orderBy: { _sum: { points: 'desc' } },
      take: limit
    })
  }

  /**
   * Get available rewards for user
   */
  static async getAvailableRewards(userId: string): Promise<RewardTier[]> {
    const userPoints = await this.getUserPoints(userId)
    return this.REWARD_TIERS.filter(tier => tier.points <= userPoints)
  }

  /**
   * Redeem a reward
   */
  static async redeemReward(userId: string, rewardType: string): Promise<any> {
    const userPoints = await this.getUserPoints(userId)
    const reward = this.REWARD_TIERS.find(r => r.reward === rewardType)

    if (!reward) {
      throw new Error('Invalid reward')
    }

    if (userPoints < reward.points) {
      throw new Error('Insufficient points')
    }

    // Check if user already redeemed this reward recently
    const recentRedemption = await prisma.userReward.findFirst({
      where: {
        userId,
        rewardType: reward.type,
        redeemedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      }
    })

    if (recentRedemption) {
      throw new Error('Reward already redeemed recently')
    }

    // Create reward redemption
    const userReward = await prisma.userReward.create({
      data: {
        userId,
        rewardType: reward.type,
        description: reward.reward,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    })

    // Deduct points (create negative points entry)
    await prisma.connectionPoints.create({
      data: {
        userId,
        activityType: 'reward_redemption',
        points: -reward.points,
        description: `Redeemed: ${reward.reward}`
      }
    })

    // Send notification
    await notificationService.sendNotificationWithTemplate(
      userId,
      'reward_redeemed',
      {
        rewardTitle: reward.reward,
        rewardDescription: reward.description
      }
    )

    return userReward
  }

  /**
   * Get user's reward history
   */
  static async getUserRewardHistory(userId: string): Promise<any[]> {
    return await prisma.userReward.findMany({
      where: { userId },
      orderBy: { redeemedAt: 'desc' }
    })
  }

  /**
   * Get connection statistics for user
   */
  static async getUserConnectionStats(userId: string): Promise<any> {
    const [
      totalConnections,
      totalPoints,
      totalAchievements,
      totalRewards,
      recentActivity
    ] = await Promise.all([
      prisma.userConnection.count({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }]
        }
      }),
      this.getUserPoints(userId),
      prisma.connectionAchievement.count({ where: { userId } }),
      prisma.userReward.count({ where: { userId } }),
      prisma.connectionPoints.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ])

    return {
      totalConnections,
      totalPoints,
      totalAchievements,
      totalRewards,
      recentActivity
    }
  }
}

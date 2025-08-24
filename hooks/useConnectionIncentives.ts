import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface ConnectionStats {
  totalConnections: number
  totalPoints: number
  totalAchievements: number
  totalRewards: number
  recentActivity: any[]
}

interface Achievement {
  id: string
  achievementType: string
  title: string
  description: string
  icon: string
  points: number
  earnedAt: string
}

interface Reward {
  points: number
  reward: string
  description: string
  type: string
}

export function useConnectionIncentives() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<ConnectionStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([])
  const [pointsHistory, setPointsHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch connection statistics
  const fetchStats = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      setLoading(true)
      const response = await fetch('/api/connections/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching connection stats:', error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  // Fetch achievements
  const fetchAchievements = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/connections/achievements')
      const data = await response.json()
      
      if (data.success) {
        setAchievements(data.achievements)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }, [session?.user?.id])

  // Fetch available rewards
  const fetchAvailableRewards = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/connections/rewards/available')
      const data = await response.json()
      
      if (data.success) {
        setAvailableRewards(data.rewards)
      }
    } catch (error) {
      console.error('Error fetching available rewards:', error)
    }
  }, [session?.user?.id])

  // Fetch points history
  const fetchPointsHistory = useCallback(async (limit: number = 20) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch(`/api/connections/points/history?limit=${limit}`)
      const data = await response.json()
      
      if (data.success) {
        setPointsHistory(data.history)
      }
    } catch (error) {
      console.error('Error fetching points history:', error)
    }
  }, [session?.user?.id])

  // Award points for an activity
  const awardPoints = useCallback(async (activityType: string, description?: string) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/connections/points/earn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType,
          description
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(`+${data.points} points! ${description || ''}`)
        // Refresh stats and achievements
        await Promise.all([
          fetchStats(),
          fetchAchievements(),
          fetchAvailableRewards()
        ])
        return data.points
      } else {
        toast.error(data.error || 'Failed to award points')
      }
    } catch (error) {
      console.error('Error awarding points:', error)
      toast.error('Failed to award points')
    }
  }, [session?.user?.id, fetchStats, fetchAchievements, fetchAvailableRewards])

  // Redeem a reward
  const redeemReward = useCallback(async (rewardType: string) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/connections/rewards/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rewardType
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(`Reward redeemed: ${data.reward.description}`)
        // Refresh stats and rewards
        await Promise.all([
          fetchStats(),
          fetchAvailableRewards(),
          fetchPointsHistory()
        ])
        return data.reward
      } else {
        toast.error(data.error || 'Failed to redeem reward')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      toast.error('Failed to redeem reward')
    }
  }, [session?.user?.id, fetchStats, fetchAvailableRewards, fetchPointsHistory])

  // Get points balance
  const getPointsBalance = useCallback(async () => {
    if (!session?.user?.id) return 0

    try {
      const response = await fetch('/api/connections/points/balance')
      const data = await response.json()
      
      if (data.success) {
        return data.points
      }
    } catch (error) {
      console.error('Error getting points balance:', error)
    }
    return 0
  }, [session?.user?.id])

  // Load initial data
  useEffect(() => {
    if (session?.user?.id) {
      Promise.all([
        fetchStats(),
        fetchAchievements(),
        fetchAvailableRewards(),
        fetchPointsHistory()
      ])
    }
  }, [session?.user?.id, fetchStats, fetchAchievements, fetchAvailableRewards, fetchPointsHistory])

  return {
    stats,
    achievements,
    availableRewards,
    pointsHistory,
    loading,
    awardPoints,
    redeemReward,
    getPointsBalance,
    refreshData: () => {
      Promise.all([
        fetchStats(),
        fetchAchievements(),
        fetchAvailableRewards(),
        fetchPointsHistory()
      ])
    }
  }
}

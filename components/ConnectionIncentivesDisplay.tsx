'use client'

import { useState } from 'react'
import { useConnectionIncentives } from '@/hooks/useConnectionIncentives'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Trophy, 
  Star, 
  Users, 
  Award, 
  Gift, 
  TrendingUp,
  MessageCircle,
  Globe,
  BookOpen,
  Heart,
  Zap,
  Crown,
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'

export function ConnectionIncentivesDisplay() {
  const { 
    stats, 
    achievements, 
    availableRewards, 
    pointsHistory, 
    loading, 
    redeemReward 
  } = useConnectionIncentives()
  
  const [selectedReward, setSelectedReward] = useState<string | null>(null)

  const handleRedeemReward = async (rewardType: string) => {
    try {
      await redeemReward(rewardType)
      setSelectedReward(null)
    } catch (error) {
      console.error('Error redeeming reward:', error)
    }
  }

  const socialLearningBenefits = [
    {
      icon: Users,
      title: 'Community Circles',
      description: 'Join language-specific study groups',
      benefit: 'Practice with peers at your level',
      color: 'text-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Live Conversations',
      description: 'Practice with native speakers and peers',
      benefit: 'Real-time speaking practice',
      color: 'text-green-600'
    },
    {
      icon: Trophy,
      title: 'Achievement Sharing',
      description: 'Public profile visibility for accomplishments',
      benefit: 'Showcase your progress',
      color: 'text-yellow-600'
    },
    {
      icon: Heart,
      title: 'Peer Support',
      description: 'Connect with learners at similar levels',
      benefit: 'Motivation and accountability',
      color: 'text-pink-600'
    }
  ]

  const learningEnhancementBenefits = [
    {
      icon: Users,
      title: 'Study Partners',
      description: 'Find compatible learning partners',
      benefit: 'Collaborative learning experience',
      color: 'text-purple-600'
    },
    {
      icon: Globe,
      title: 'Cultural Exchange',
      description: 'Connect with native speakers for authentic practice',
      benefit: 'Learn cultural nuances',
      color: 'text-indigo-600'
    },
    {
      icon: Crown,
      title: 'Mentorship',
      description: 'Connect with advanced learners for guidance',
      benefit: 'Accelerate your learning',
      color: 'text-orange-600'
    },
    {
      icon: BookOpen,
      title: 'Group Activities',
      description: 'Participate in collaborative learning',
      benefit: 'Enhanced engagement',
      color: 'text-teal-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Points and Stats Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Connection Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats?.totalPoints || 0}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats?.totalConnections || 0}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{achievements.length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{availableRewards.length}</div>
              <div className="text-sm text-gray-600">Available Rewards</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="benefits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="benefits">Learning Benefits</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="benefits" className="space-y-6">
          {/* Social Learning Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Social Learning Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialLearningBenefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${benefit.color}`}>
                        <benefit.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {benefit.benefit}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Enhancement Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Learning Enhancement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningEnhancementBenefits.map((benefit, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gray-100 ${benefit.color}`}>
                        <benefit.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {benefit.benefit}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Ready to Connect?</h3>
              <p className="text-gray-600 mb-4">
                Start building your learning network and unlock these amazing benefits!
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Users className="h-4 w-4 mr-2" />
                Start Connecting
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <Badge variant="outline" className="text-xs">
                    +{achievement.points} points
                  </Badge>
                  <div className="text-xs text-gray-500 mt-2">
                    Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
            {achievements.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No achievements yet. Start connecting to earn your first badge!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Gift className="h-5 w-5 text-purple-600" />
                    <Badge variant="outline" className="text-xs">
                      {reward.points} points
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{reward.reward}</h4>
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedReward(reward.reward)}
                  >
                    Redeem Reward
                  </Button>
                </CardContent>
              </Card>
            ))}
            {availableRewards.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Gift className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No rewards available yet. Keep connecting to earn points!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reward Redemption Dialog */}
      <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to redeem this reward?</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold">{selectedReward}</h4>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setSelectedReward(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => selectedReward && handleRedeemReward(selectedReward)}
              >
                Confirm Redemption
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

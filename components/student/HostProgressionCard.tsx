'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star,
  MessageSquare,
  ArrowRight,
  Trophy
} from 'lucide-react';

interface HostStats {
  totalConversations: number;
  totalEarnings: number;
  averageRating: number;
  totalParticipants: number;
  currentTier: string;
  tierProgress: number;
  nextTierRequirements: string;
  tierBenefits: string[];
  recentConversations: Array<{
    id: string;
    title: string;
    date: string;
    participants: number;
    earnings: number;
  }>;
}

interface HostProgressionCardProps {
  userId: string;
}

export default function HostProgressionCard({ userId }: HostProgressionCardProps) {
  const [hostStats, setHostStats] = useState<HostStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostStats();
  }, [userId]);

  const fetchHostStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/host-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHostStats(data);
      }
    } catch (error) {
      console.error('Error fetching host stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Community': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Experienced': return 'bg-purple-100 text-purple-800';
      case 'Professional': return 'bg-yellow-100 text-yellow-800';
      case 'Master': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Community': return '🌱';
      case 'Active': return '🚀';
      case 'Experienced': return '⭐';
      case 'Professional': return '👑';
      case 'Master': return '🏆';
      default: return '👤';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span className="ml-2">Loading host stats...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hostStats) {
    return null; // Don't show if user is not a host
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">Host Progression</CardTitle>
          </div>
          <Badge className={getTierColor(hostStats.currentTier)}>
            {getTierIcon(hostStats.currentTier)} {hostStats.currentTier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tier Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progress to Next Tier</span>
            <span>{hostStats.tierProgress}%</span>
          </div>
          <Progress value={hostStats.tierProgress} className="h-2" />
          <p className="text-xs text-gray-600 mt-1">{hostStats.nextTierRequirements}</p>
        </div>

        {/* Host Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{hostStats.totalConversations}</div>
            <div className="text-xs text-gray-600">Conversations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${hostStats.totalEarnings}</div>
            <div className="text-xs text-gray-600">Total Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{hostStats.averageRating.toFixed(1)}</div>
            <div className="text-xs text-gray-600">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{hostStats.totalParticipants}</div>
            <div className="text-xs text-gray-600">Participants</div>
          </div>
        </div>

        {/* Tier Benefits */}
        <div>
          <h4 className="font-medium text-sm mb-2">Current Tier Benefits:</h4>
          <div className="space-y-1">
            {hostStats.tierBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600">
                <div className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></div>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversations */}
        {hostStats.recentConversations.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Recent Conversations:</h4>
            <div className="space-y-2">
              {hostStats.recentConversations.slice(0, 3).map((conversation) => (
                <div key={conversation.id} className="flex items-center justify-between p-2 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{conversation.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(conversation.date).toLocaleDateString()} • {conversation.participants} participants
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    ${conversation.earnings}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1" onClick={() => window.location.href = '/live-conversations/create'}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Host New Conversation
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.location.href = '/student/host-dashboard'}>
            <TrendingUp className="h-4 w-4 mr-1" />
            View Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Crown, 
  Zap, 
  Users, 
  Clock, 
  Video, 
  Headphones, 
  CheckCircle, 
  XCircle,
  Star,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  upgradePrompt: {
    message: string;
    cta: string;
    planType: 'PREMIUM' | 'PRO';
  };
  reason?: string;
}

export function UpgradePromptModal({ isOpen, onClose, upgradePrompt, reason }: UpgradePromptModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const planFeatures = {
    PREMIUM: [
      { icon: <Video className="h-4 w-4" />, text: 'Unlimited live class sessions', included: true },
      { icon: <Clock className="h-4 w-4" />, text: '60-minute session duration', included: true },
      { icon: <Users className="h-4 w-4" />, text: 'Smaller group sizes (max 10)', included: true },
      { icon: <Headphones className="h-4 w-4" />, text: 'HD video quality', included: true },
      { icon: <CheckCircle className="h-4 w-4" />, text: 'Screen sharing & materials', included: true },
      { icon: <XCircle className="h-4 w-4" />, text: 'Session recording', included: false }
    ],
    PRO: [
      { icon: <Video className="h-4 w-4" />, text: 'Unlimited live class sessions', included: true },
      { icon: <Clock className="h-4 w-4" />, text: '120-minute session duration', included: true },
      { icon: <Users className="h-4 w-4" />, text: 'Personal tutoring (1-on-1)', included: true },
      { icon: <Headphones className="h-4 w-4" />, text: 'HD video quality', included: true },
      { icon: <CheckCircle className="h-4 w-4" />, text: 'All features included', included: true },
      { icon: <Star className="h-4 w-4" />, text: 'Session recording', included: true }
    ]
  };

  const planPricing = {
    PREMIUM: { monthly: 24.99, annual: 239.99 },
    PRO: { monthly: 49.99, annual: 479.99 }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // Navigate to subscription page with the selected plan
      router.push(`/subscription-signup?type=student&plan=${upgradePrompt.planType}`);
    } catch (error) {
      console.error('Error navigating to upgrade:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = planFeatures[upgradePrompt.planType];
  const pricing = planPricing[upgradePrompt.planType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span>Upgrade to {upgradePrompt.planType}</span>
          </DialogTitle>
          <DialogDescription>
            {upgradePrompt.message}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reason for upgrade */}
          {reason && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Current Limitation</span>
              </div>
              <p className="text-sm text-amber-700 mt-1">{reason}</p>
            </div>
          )}

          {/* Plan comparison */}
          <div className="grid gap-4">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-blue-900">{upgradePrompt.planType} Plan</h3>
                    <p className="text-sm text-blue-700">Perfect for serious learners</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    RECOMMENDED
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${feature.included ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {feature.included ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                      <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-blue-900">${pricing.monthly}</span>
                    <span className="text-sm text-blue-600">/month</span>
                  </div>
                  <p className="text-xs text-blue-600">or ${pricing.annual}/year (save 20%)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current vs Upgraded comparison */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Current (Free)</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 1 session/month</li>
                <li>• 30 min max duration</li>
                <li>• Large groups (20+ people)</li>
                <li>• Basic video quality</li>
                <li>• No recording</li>
              </ul>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{upgradePrompt.planType}</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Unlimited sessions</li>
                <li>• {upgradePrompt.planType === 'PREMIUM' ? '60' : '120'} min duration</li>
                <li>• {upgradePrompt.planType === 'PREMIUM' ? 'Small groups (10 people)' : 'Personal tutoring'}</li>
                <li>• HD video quality</li>
                <li>• {upgradePrompt.planType === 'PRO' ? 'Session recording' : 'Advanced features'}</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button 
            onClick={handleUpgrade}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Upgrading...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>{upgradePrompt.cta}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

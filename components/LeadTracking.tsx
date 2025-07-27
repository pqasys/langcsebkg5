'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Eye, 
  Phone, 
  Mail, 
  ExternalLink, 
  Users, 
  Calendar,
  BarChart3,
  Target,
  DollarSign
} from 'lucide-react';

interface LeadEvent {
  id: string;
  institutionId: string;
  eventType: 'view' | 'contact' | 'website_click' | 'course_click';
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
  sessionId?: string;
}

interface LeadAnalytics {
  totalViews: number;
  totalContacts: number;
  totalWebsiteClicks: number;
  totalCourseClicks: number;
  conversionRate: number;
  dailyStats: {
    date: string;
    views: number;
    contacts: number;
  }[];
  topReferrers: {
    source: string;
    count: number;
  }[];
}

interface LeadTrackingProps {
  institutionId: string;
  showAnalytics?: boolean;
  onLeadGenerated?: (event: LeadEvent) => void;
}

export function LeadTracking({ 
  institutionId, 
  showAnalytics = false,
  onLeadGenerated 
}: LeadTrackingProps) {
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  // Track lead event
  const trackLeadEvent = async (eventType: LeadEvent['eventType']) => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof document === 'undefined' || typeof sessionStorage === 'undefined') return;
    try {
      const event: LeadEvent = {
        id: crypto.randomUUID(),
        institutionId,
        eventType,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID()
      };

      // Store session ID
      sessionStorage.setItem('sessionId', event.sessionId!);

      // Send to analytics endpoint
      await fetch('/api/analytics/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      // Callback for parent component
      onLeadGenerated?.(event);

      // Update local analytics if showing
      if (showAnalytics) {
        fetchAnalytics();
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to tracking lead event. Please try again or contact support if the problem persists.`);
    }
  };

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/leads?institutionId=${institutionId}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to load analytics. Please try again or contact support if the problem persists.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAnalytics) {
      fetchAnalytics();
    }
  }, [institutionId, showAnalytics]);

  // Track profile view on mount
  useEffect(() => {
    trackLeadEvent('view');
  }, [institutionId]);

  if (!showAnalytics) {
    return null;
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-3"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Lead Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Lead Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalViews}</div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.totalContacts}</div>
              <div className="text-sm text-gray-600">Contacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.totalWebsiteClicks}</div>
              <div className="text-sm text-gray-600">Website Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(analytics.conversionRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.dailyStats.slice(-7).map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{day.date}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{day.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{day.contacts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Traffic Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics.topReferrers.map((referrer, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{referrer.source}</span>
                <Badge variant="secondary">{referrer.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Enhanced contact button with lead tracking
export function TrackedContactButton({ 
  institutionId, 
  contactType, 
  contactValue, 
  children 
}: {
  institutionId: string;
  contactType: 'email' | 'phone' | 'website';
  contactValue: string;
  children: React.ReactNode;
}) {
  const handleContact = () => {
    // Track the contact event
    const eventType = contactType === 'website' ? 'website_click' : 'contact';
    
    // Send tracking event
    fetch('/api/analytics/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        institutionId,
        eventType,
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: sessionStorage.getItem('sessionId') || crypto.randomUUID(),
        contactType,
        contactValue
      }),
    });

    // Open contact method
    if (contactType === 'email') {
      window.open(`mailto:${contactValue}`, '_blank');
    } else if (contactType === 'phone') {
      window.open(`tel:${contactValue}`, '_blank');
    } else if (contactType === 'website') {
      window.open(contactValue, '_blank');
    }
  };

  return (
    <Button onClick={handleContact} className="flex items-center gap-2">
      {children}
    </Button>
  );
} 
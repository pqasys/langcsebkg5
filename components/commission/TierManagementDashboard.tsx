'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Users, 
  TrendingUp, 
  Settings,
  UserCheck,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  Zap
} from 'lucide-react';

interface TierData {
  id: string;
  tierName: string;
  displayName: string;
  commissionRate: number;
  minSessions?: number;
  maxSessions?: number;
  minConversations?: number;
  maxConversations?: number;
  requirements: string;
  benefits: string[];
  color: string;
  isActive: boolean;
  effectiveDate: string;
  metadata?: any;
}

interface TierAssignment {
  id: string;
  instructorId?: string;
  hostId?: string;
  tierId: string;
  startDate: string;
  endDate?: string;
  assignedBy: string;
  tier: TierData;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
  host?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function TierManagementDashboard() {
  const [activeTab, setActiveTab] = useState('instructors');
  const [instructorTiers, setInstructorTiers] = useState<TierData[]>([]);
  const [hostTiers, setHostTiers] = useState<TierData[]>([]);
  const [instructorAssignments, setInstructorAssignments] = useState<TierAssignment[]>([]);
  const [hostAssignments, setHostAssignments] = useState<TierAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoAssigning, setAutoAssigning] = useState(false);

  useEffect(() => {
    fetchTierData();
  }, []);

  const fetchTierData = async () => {
    try {
      setLoading(true);
      
      // Fetch instructor tiers
      const instructorResponse = await fetch('/api/commission/tiers/instructors');
      const instructorData = await instructorResponse.json();
      
      // Fetch host tiers
      const hostResponse = await fetch('/api/commission/tiers/hosts');
      const hostData = await hostResponse.json();

      // Fetch assignments
      const instructorAssignmentsResponse = await fetch('/api/commission/tiers/assignments/instructors');
      const instructorAssignmentsData = await instructorAssignmentsResponse.json();
      
      const hostAssignmentsResponse = await fetch('/api/commission/tiers/assignments/hosts');
      const hostAssignmentsData = await hostAssignmentsResponse.json();

      setInstructorTiers(instructorData.tiers || []);
      setHostTiers(hostData.tiers || []);
      setInstructorAssignments(instructorAssignmentsData.assignments || []);
      setHostAssignments(hostAssignmentsData.assignments || []);

    } catch (error) {
      console.error('Error fetching tier data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    try {
      setAutoAssigning(true);
      const response = await fetch('/api/commission/tiers/assign', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ autoAssign: true }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`Auto-assignment completed!\n\nInstructors: ${result.results.instructors.processed} processed, ${result.results.instructors.updated} updated\nHosts: ${result.results.hosts.processed} processed, ${result.results.hosts.updated} updated`);
        fetchTierData(); // Refresh data
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error auto-assigning tiers:', error);
      alert('Failed to auto-assign tiers');
    } finally {
      setAutoAssigning(false);
    }
  };

  const getTierColor = (color: string) => {
    return { backgroundColor: color, color: '#fff' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActiveAssignments = (assignments: TierAssignment[]) => {
    return assignments.filter(a => !a.endDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tier Management</h1>
        <div className="flex space-x-2">
          <Button onClick={fetchTierData} variant="outline">
            Refresh
          </Button>
          <Button 
            onClick={handleAutoAssign} 
            disabled={autoAssigning}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            {autoAssigning ? 'Auto-Assigning...' : 'Auto-Assign Tiers'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instructors">Instructor Tiers</TabsTrigger>
          <TabsTrigger value="hosts">Host Tiers</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="instructors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorTiers.map((tier) => (
              <Card key={tier.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Crown className="h-5 w-5" style={{ color: tier.color }} />
                      <span>{tier.displayName}</span>
                    </CardTitle>
                    <Badge 
                      className="text-xs font-bold"
                      style={getTierColor(tier.color)}
                    >
                      {tier.commissionRate}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Requirements:</strong> {tier.requirements}</p>
                    <p><strong>Range:</strong> {tier.minSessions}-{tier.maxSessions || '∞'} sessions</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Benefits:</p>
                    <ul className="text-xs space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Active since {formatDate(tier.effectiveDate)}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hosts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostTiers.map((tier) => (
              <Card key={tier.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <MessageCircle className="h-5 w-5" style={{ color: tier.color }} />
                      <span>{tier.displayName}</span>
                    </CardTitle>
                    <Badge 
                      className="text-xs font-bold"
                      style={getTierColor(tier.color)}
                    >
                      {tier.commissionRate}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Requirements:</strong> {tier.requirements}</p>
                    <p><strong>Range:</strong> {tier.minConversations}-{tier.maxConversations || '∞'} conversations</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Benefits:</p>
                    <ul className="text-xs space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Active since {formatDate(tier.effectiveDate)}
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instructor Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Instructor Assignments</span>
                  <Badge variant="secondary">
                    {getActiveAssignments(instructorAssignments).length} active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getActiveAssignments(instructorAssignments).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: assignment.tier.color }}
                        ></div>
                        <div>
                          <p className="font-medium">{assignment.instructor?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.tier.displayName} ({assignment.tier.commissionRate}%)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Since {formatDate(assignment.startDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Host Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Host Assignments</span>
                  <Badge variant="secondary">
                    {getActiveAssignments(hostAssignments).length} active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getActiveAssignments(hostAssignments).map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: assignment.tier.color }}
                        ></div>
                        <div>
                          <p className="font-medium">{assignment.host?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.tier.displayName} ({assignment.tier.commissionRate}%)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Since {formatDate(assignment.startDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tiers</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {instructorTiers.length + hostTiers.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {instructorTiers.length} instructors, {hostTiers.length} hosts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getActiveAssignments(instructorAssignments).length + getActiveAssignments(hostAssignments).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current tier assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    [...instructorTiers, ...hostTiers].reduce((sum, tier) => sum + tier.commissionRate, 0) / 
                    (instructorTiers.length + hostTiers.length)
                  )}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all tiers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tier Distribution</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {instructorTiers.slice(0, 3).map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between">
                      <span className="text-xs">{tier.displayName}</span>
                      <Badge variant="outline" className="text-xs">
                        {getActiveAssignments(instructorAssignments).filter(a => a.tier.tierName === tier.tierName).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { 
  TrendingUp, 
  Star, 
  Crown, 
  DollarSign, 
  Users, 
  Eye, 
  Phone, 
  Mail,
  BarChart3,
  Target,
  Calendar,
  Settings,
  Edit,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { LeadTracking } from '@/components/LeadTracking';

interface Institution {
  id: string;
  name: string;
  subscriptionPlan: string;
  isFeatured: boolean;
  commissionRate: number;
  courseCount: number;
  studentCount: number;
  priorityScore: number;
  revenueGenerated: number;
  leadStats: {
    totalViews: number;
    totalContacts: number;
    conversionRate: number;
  };
}

interface MonetizationStats {
  totalRevenue: number;
  premiumListings: number;
  sponsoredListings: number;
  featuredInstitutions: number;
  totalLeads: number;
  averageConversionRate: number;
  monthlyGrowth: number;
}

export default function InstitutionMonetizationPage() {
  const { data: session, status } = useSession();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [stats, setStats] = useState<MonetizationStats | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'ADMIN') {
      navigate.to('/auth/signin');
      return;
    }
  }, [session, status]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/institution-monetization');
      if (!response.ok) {
        throw new Error('Failed to fetch institutions');
      }
      const data = await response.json();
      setInstitutions(data.institutions);
      setFilteredInstitutions(data.institutions);
      setStats(data.stats);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load institutions. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load institutions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchInstitutions();
    }
  }, [session]);

  useEffect(() => {
    let filtered = institutions;

    if (searchTerm) {
      filtered = filtered.filter(institution =>
        institution.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (planFilter !== 'all') {
      filtered = filtered.filter(institution => institution.subscriptionPlan === planFilter);
    }

    setFilteredInstitutions(filtered);
  }, [searchTerm, planFilter, institutions]);

  const handleUpdateInstitution = async (institutionId: string, updates: unknown) => {
    try {
      const response = await fetch(`/api/admin/institution-monetization/${institutionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success('Institution updated successfully');
        fetchInstitutions();
      } else {
        throw new Error('Failed to update institution');
      }
      toast.error(`Failed to updating institution. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update institution');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to update institution. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update institution');
    }
  };

  const getPriorityBadge = (institution: Institution) => {
    if (institution.subscriptionPlan === 'ENTERPRISE') {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </Badge>
      );
    }
    if (institution.isFeatured) {
      return (
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <Star className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      );
    }
    if (institution.subscriptionPlan === 'PROFESSIONAL') {
      return (
        <Badge variant="secondary">
          <TrendingUp className="w-3 h-3 mr-1" />
          Sponsored
        </Badge>
      );
    }
    return (
      <Badge variant="outline">
        Basic
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Institution Monetization
          </h1>
          <p className="text-gray-600">
            Manage institution promotions, sponsorships, and revenue tracking
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  +{stats.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Premium Listings</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {stats.premiumListings}
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enterprise subscriptions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Leads</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.totalLeads.toLocaleString()}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {(stats.averageConversionRate * 100).toFixed(1)}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Featured</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {stats.featuredInstitutions}
                    </p>
                  </div>
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  High-priority institutions
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative search-container-long">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search institutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="BASIC">Basic</SelectItem>
              <SelectItem value="PROFESSIONAL">Professional</SelectItem>
              <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Institutions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Institution Monetization Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Institution</th>
                    <th className="text-left py-3 px-4">Plan</th>
                    <th className="text-left py-3 px-4">Revenue</th>
                    <th className="text-left py-3 px-4">Leads</th>
                    <th className="text-left py-3 px-4">Conversion</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstitutions.map((institution) => (
                    <tr key={institution.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{institution.name}</div>
                          <div className="text-sm text-gray-500">
                            {institution.courseCount} courses • {institution.studentCount} students
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getPriorityBadge(institution)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-green-600">
                          {formatCurrency(institution.revenueGenerated)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {institution.commissionRate}% commission
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span>{institution.leadStats.totalViews}</span>
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{institution.leadStats.totalContacts}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">
                          {(institution.leadStats.conversionRate * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedInstitution(institution)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Institution Monetization</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Subscription Plan</label>
                                  <Select
                                    value={institution.subscriptionPlan}
                                    onValueChange={(value) => 
                                      handleUpdateInstitution(institution.id, { subscriptionPlan: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="BASIC">Basic</SelectItem>
                                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Commission Rate (%)</label>
                                  <Input
                                    type="number"
                                    value={institution.commissionRate}
                                    onChange={(e) => 
                                      handleUpdateInstitution(institution.id, { commissionRate: parseFloat(e.target.value) })
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="featured"
                                    checked={institution.isFeatured}
                                    onChange={(e) => 
                                      handleUpdateInstitution(institution.id, { isFeatured: e.target.checked })
                                    }
                                  />
                                  <label htmlFor="featured" className="text-sm font-medium">
                                    Featured Institution
                                  </label>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAnalytics(showAnalytics === institution.id ? null : institution.id)}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Analytics Panel */}
        {showAnalytics && selectedInstitution && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Analytics for {selectedInstitution.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadTracking 
                  institutionId={selectedInstitution.id}
                  showAnalytics={true}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 
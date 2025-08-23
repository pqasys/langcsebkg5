'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Globe, 
  Calendar,
  MessageCircle,
  Star,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface Circle {
  id: string;
  name: string;
  slug: string;
  language: string;
  level: string;
  description: string;
  membersCount: number;
  isPublic: boolean;
  createdAt: string;
  owner?: {
    id: string;
    name: string;
    image?: string;
  };
}

export default function CommunityCirclesPage() {
  const { data: session } = useSession();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    language: 'all',
    level: 'all'
  });
  const [newCircle, setNewCircle] = useState({
    name: '',
    language: 'en',
    level: 'Beginner',
    description: ''
  });

  useEffect(() => {
    fetchCircles();
  }, [searchTerm, filters]);

  const fetchCircles = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.language && filters.language !== 'all') params.append('language', filters.language);
      if (filters.level && filters.level !== 'all') params.append('level', filters.level);
      
      const response = await fetch(`/api/community/circles?${params.toString()}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCircles(data);
      }
    } catch (error) {
      console.error('Error fetching circles:', error);
      toast.error('Failed to load study circles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCircle = async () => {
    if (!newCircle.name || !newCircle.language || !newCircle.level) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/community/circles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCircle)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Study circle created successfully!');
        setShowCreateDialog(false);
        setNewCircle({ name: '', language: 'en', level: 'Beginner', description: '' });
        fetchCircles(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to create study circle');
      }
    } catch (error) {
      console.error('Error creating circle:', error);
      toast.error('Failed to create study circle');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinCircle = async (circleId: string) => {
    try {
      const response = await fetch(`/api/community/circles/${circleId}/join`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Joined study circle successfully!');
        fetchCircles(); // Refresh to update member count
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to join study circle');
      }
    } catch (error) {
      console.error('Error joining circle:', error);
      toast.error('Failed to join study circle');
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸',
      'fr': '🇫🇷',
      'es': '🇪🇸',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'zh': '🇨🇳',
      'ja': '🇯🇵',
      'ko': '🇰🇷'
    };
    return flags[language] || '🌍';
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-purple-100 text-purple-800',
      'All Levels': 'bg-gray-100 text-gray-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Study Circles</h1>
            <p className="text-xl text-blue-100 mb-6">
              Join study groups and connect with fellow language learners
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/community">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Back to Community
                </Button>
              </Link>
              <Link href="/community/clubs">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Clubs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search study circles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filters.language} onValueChange={(value) => setFilters(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="it">Italian</SelectItem>
                  <SelectItem value="pt">Portuguese</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="All Levels">All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {session?.user && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Circle
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Study Circle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Circle Name *</label>
                    <Input
                      placeholder="e.g., Spanish Beginners Study Group"
                      value={newCircle.name}
                      onChange={(e) => setNewCircle(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Language *</label>
                      <Select value={newCircle.language} onValueChange={(value) => setNewCircle(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="it">Italian</SelectItem>
                          <SelectItem value="pt">Portuguese</SelectItem>
                          <SelectItem value="ru">Russian</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                          <SelectItem value="ko">Korean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Level *</label>
                      <Select value={newCircle.level} onValueChange={(value) => setNewCircle(prev => ({ ...prev, level: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="All Levels">All Levels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      placeholder="Describe your study circle..."
                      value={newCircle.description}
                      onChange={(e) => setNewCircle(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCircle} disabled={creating}>
                      {creating ? 'Creating...' : 'Create Circle'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Circles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {circles.map((circle) => (
            <Card key={circle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{circle.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getLanguageFlag(circle.language)}</span>
                      <Badge className={getLevelColor(circle.level)}>
                        {circle.level}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {circle.membersCount}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {circle.description || 'No description available.'}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Created {new Date(circle.createdAt).toLocaleDateString()}</span>
                  {circle.owner && (
                    <div className="flex items-center gap-1">
                      <Crown className="h-3 w-3 text-yellow-500" />
                      <span>{circle.owner.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleJoinCircle(circle.id)}
                  >
                    Join Circle
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/community/circles/${circle.slug}`}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {circles.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No study circles found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filters.language || filters.level 
                  ? 'Try adjusting your search or filters.'
                  : 'Be the first to create a study circle!'
                }
              </p>
              {session?.user && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Circle
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}



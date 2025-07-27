'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag, ChevronRight, ChevronDown, Code, Flag, Book, GraduationCap, Users, Calendar, Clock, Star, Award, Trophy, Medal, Crown, Target, Zap, Heart, Sparkles, Rocket, Lightbulb, Globe, Map, Compass, Camera, Music, Film, Palette, Brush, Pen, Scissors, Wrench, Settings, Cog, Bell, Mail, Phone, MessageSquare, ThumbsUp, ThumbsDown, Smile, Frown, Meh, Bookmark, Link, ExternalLink, Download, Upload, Share, Lock, Unlock, Eye, EyeOff, Search, Filter, List, Grid, Menu, X, Check, AlertCircle, Info, HelpCircle, AlertTriangle, XCircle, CheckCircle, MinusCircle, PlusCircle, Circle, Square, Triangle, Hexagon, Octagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Switch } from '@/components/ui/switch';
// import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Label } from '@/components/ui/label';

type Tag = {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  featured: boolean;
  priority: number;
  parentId: string | null;
  children?: Tag[];
  _count?: {
    children: number;
    courses: number;
  };
};

interface TagAnalytics {
  totalTags: number;
  featuredTags: number;
  unusedTags: number;
  mostUsedTags: { name: string; count: number }[];
  recentlyAddedTags: { name: string; createdAt: string }[];
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [analytics, setAnalytics] = useState<TagAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    color: '#000000',
    icon: '',
    featured: false,
    priority: 0
  });

  useEffect(() => {
    fetchTags();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      setEditingTag(null);
      setFormData({
        name: '',
        description: '',
        parentId: '',
        color: '#000000',
        icon: '',
        featured: false,
        priority: 0
      });
    }
  }, [isDialogOpen]);

  useEffect(() => {
    if (editingTag) {
      setFormData({
        name: editingTag.name,
        description: editingTag.description || '',
        parentId: editingTag.parentId || '',
        color: editingTag.color || '#000000',
        icon: editingTag.icon || '',
        featured: editingTag.featured,
        priority: editingTag.priority
      });
    }
  }, [editingTag]);

  // Add session check on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        const sessionData = await response.json();
        
        if (sessionData?.user?.role === 'ADMIN') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          console.error('You do not have permission to access this page');
          setTimeout(() => {
            navigate.to('/auth/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
        console.error('Error checking authentication');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const fetchTags = async () => {
    try {
      // Get institutionId from URL if available
      const institutionId = new URLSearchParams(window.location.search).get('institutionId');
      const url = institutionId 
        ? `/api/tags?include=hierarchy&institutionId=${institutionId}`
        : '/api/tags?include=hierarchy';

      // // // // // // // // // // // // // // // // // // console.log('Fetching tags from:', url);
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:');
        throw new Error(`Failed to fetch tags: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received tags data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Received non-array data:');
        throw new Error('Invalid response format: expected an array of tags');
      }

      // Log the first tag's counts for debugging
      if (data.length > 0) {
        console.log('First tag counts:', {
          tag: data[0].name,
          courseCount: data[0]._count?.courseTags,
          childCount: data[0]._count?.children
        });
      }
      
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      console.error('Failed to fetch tags');
    }
  };

  const fetchAnalytics = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch('/api/tags/analytics', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      console.error('Failed to fetch analytics');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdating = !!editingTag;
    
    try {
      // First check if we have a valid session
      const sessionCheck = await fetch('/api/auth/session', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      const sessionData = await sessionCheck.json();
      
      if (!sessionData?.user?.role || sessionData.user.role !== 'ADMIN') {
        console.error('You do not have permission to perform this action.');
        setTimeout(() => {
          navigate.to('/auth/login');
        }, 2000);
        return;
      }

      const tagData = {
        name: formData.name,
        description: formData.description,
        parentId: formData.parentId || null,
        color: formData.color,
        icon: formData.icon,
        featured: formData.featured,
        priority: formData.priority
      };

      const response = await fetch(
        isUpdating ? `/api/tags/${editingTag.id}` : '/api/tags',
        {
          method: isUpdating ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          credentials: 'include',
          body: JSON.stringify(tagData),
        }
      );

      if (response.status === 401) {
        console.error('Your session has expired. Please log in again.');
        setTimeout(() => {
          navigate.to('/auth/login');
        }, 2000);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isUpdating ? 'update' : 'create'} tag`);
      }

      const updatedTag = await response.json();
      
      // Update the tags state
      if (isUpdating) {
        setTags(prevTags => prevTags.map(tag => 
          tag.id === editingTag.id ? updatedTag : tag
        ));
      } else {
        setTags(prevTags => [...prevTags, updatedTag]);
      }

      // Show success message
      console.log(`Tag ${isUpdating ? 'updated' : 'created'} successfully`);

      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        parentId: '',
        color: '#000000',
        icon: '',
        featured: false,
        priority: 0
      });
      
      // Close dialog and reset editing state
      setIsDialogOpen(false);
      setEditingTag(null);

    } catch (error) {
      console.error('Error saving tag:', error);
      console.error(error instanceof Error ? error.message : 'Failed to save tag');
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Only reset state when explicitly closing the dialog
      setEditingTag(null);
      setFormData({
        name: '',
        description: '',
        parentId: '',
        color: '#000000',
        icon: '',
        featured: false,
        priority: 0
      });
    }
    setIsDialogOpen(open);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;
    
    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete tag');
      }
      
      await fetchTags();
      await fetchAnalytics();
      console.log('Tag deleted successfully');
    } catch (error) {
      console.error('Error deleting tag:', error);
      console.error(error instanceof Error ? error.message : 'Failed to delete tag');
    }
  };

  const toggleExpand = (tagId: string) => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedTags(newExpanded);
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: unknown } = {
      Code,
      Flag,
      Book,
      GraduationCap,
      Users,
      Calendar,
      Clock,
      Star,
      Award,
      Trophy,
      Medal,
      Crown,
      Target,
      Zap,
      Heart,
      Sparkles,
      Rocket,
      Lightbulb,
      Globe,
      Map,
      Compass,
      Camera,
      Music,
      Film,
      Palette,
      Brush,
      Pen,
      Scissors,
      Wrench,
      Settings,
      Cog,
      Bell,
      Mail,
      Phone,
      MessageSquare,
      ThumbsUp,
      ThumbsDown,
      Smile,
      Frown,
      Meh,
      Bookmark,
      Link,
      ExternalLink,
      Download,
      Upload,
      Share,
      Lock,
      Unlock,
      Eye,
      EyeOff,
      Search,
      Filter,
      List,
      Grid,
      Menu,
      X,
      Check,
      AlertCircle,
      Info,
      HelpCircle,
      AlertTriangle,
      XCircle,
      CheckCircle,
      MinusCircle,
      PlusCircle,
      Circle,
      Square,
      Triangle,
      Hexagon,
      Octagon,
      Pencil
    };

    return iconMap[iconName] || Tag;
  };

  const renderTagRow = (tag: Tag, level: number = 0) => {
    const hasChildren = tag._count?.children > 0;
    const isExpanded = expandedTags.has(tag.id);
    const IconComponent = getIconComponent(tag.icon);

    console.log('Rendering tag:', {
      name: tag.name,
      courseCount: tag._count?.courseTags,
      childCount: tag._count?.children,
      hasChildren
    });

    return (
      <React.Fragment key={tag.id}>
        <TableRow className={level > 0 ? 'bg-gray-50' : ''}>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(tag.id)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4" style={{ color: tag.color || 'currentColor' }} />
                <span className="font-medium">{tag.name}</span>
                {tag.featured && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </TableCell>
          <TableCell className="text-gray-600">{tag.description || '-'}</TableCell>
          <TableCell>
            <span className="font-medium">{tag._count?.courseTags || 0}</span>
          </TableCell>
          <TableCell>
            <span className="font-medium">{tag._count?.children || 0}</span>
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(tag)}
                className="hover:bg-gray-100"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(tag.id)}
                className="hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        {isExpanded && tag.children?.map(child => renderTagRow(child, level + 1))}
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You need to be logged in as an admin to access this page.</p>
        <Button onClick={() => navigate.to('/auth/login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Tag Management</h1>
          <p className="text-gray-500 mt-1">Create and manage tags for organizing courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTag(null);
              setFormData({
                name: '',
                description: '',
                parentId: '',
                color: '#000000',
                icon: '',
                featured: false,
                priority: 0
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="sm:max-w-[500px] bg-white" 
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>{editingTag ? 'Edit Tag' : 'Add New Tag'}</DialogTitle>
              <DialogDescription>
                {editingTag ? 'Update the tag details below.' : 'Fill in the details to create a new tag.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="parentId" className="block text-sm font-medium mb-1">
                  Parent Tag
                </label>
                <Select
                  value={formData.parentId || 'none'}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === 'none' ? '' : value }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select parent tag" />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-[200px] overflow-y-auto">
                    <SelectItem value="none">None</SelectItem>
                    {tags.map(tag => (
                      <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Color
                  </label>
                  <ColorPicker
                    value={formData.color}
                    onChange={(color) => setFormData(prev => ({ ...prev, color }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Icon
                  </label>
                  <IconPicker
                    value={formData.icon}
                    onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
                    className="bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Label htmlFor="featured" className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">Featured Tag</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>
              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                  className="w-24"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTag ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalTags}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Featured Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.featuredTags}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unused Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.unusedTags}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Used Tag</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.mostUsedTags[0] && (
                <>
                  <div className="text-2xl font-bold">{analytics.mostUsedTags[0].name}</div>
                  <div className="text-sm text-gray-500">{analytics.mostUsedTags[0].count} courses</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead className="w-[30%]">Description</TableHead>
              <TableHead className="w-[15%]">Courses</TableHead>
              <TableHead className="w-[15%]">Subtags</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Tag className="w-8 h-8 mb-2" />
                    <p>No tags found</p>
                    <p className="text-sm">Create your first tag to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => renderTagRow(tag))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 
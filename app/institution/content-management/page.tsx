'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  FileText, 
  Image, 
  Video, 
  Code, 
  Link, 
  Search,
  Filter,
  SortAsc,
  Edit,
  Eye,
  Trash2,
  Save,
  Upload,
  FolderOpen,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner';
import ContentCreator from '@/app/components/content/ContentCreator';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'module' | 'lesson' | 'resource';
  status: 'draft' | 'published' | 'archived';
  courseId: string;
  courseTitle: string;
  createdAt: string;
  updatedAt: string;
  blocks: unknown[];
  tags: string[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'inactive';
}

export default function ContentManagementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');

  useEffect(() => {
    if (session?.user?.role !== 'INSTITUTION') {
      router.push('/');
      return;
    }
    fetchContentData();
  }, [session]);

  const fetchContentData = async () => {
    try {
      setLoading(true);
      
      // Fetch content items and courses
      const [contentRes, coursesRes] = await Promise.all([
        fetch('/api/institution/content'),
        fetch('/api/institution/courses')
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContentItems(contentData);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load content data. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load content data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = () => {
    setIsCreating(true);
    setSelectedContent(null);
  };

  const handleEditContent = (content: ContentItem) => {
    setSelectedContent(content);
    setIsCreating(false);
  };

  const handleSaveContent = async (contentData: unknown) => {
    try {
      const url = selectedContent ? `/api/institution/content/${selectedContent.id}` : '/api/institution/content';
      const method = selectedContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contentData,
          courseId: selectedContent?.courseId || courses[0]?.id,
        }),
      });

      if (response.ok) {
        toast.success(selectedContent ? 'Content updated successfully' : 'Content created successfully');
        setSelectedContent(null);
        setIsCreating(false);
        fetchContentData();
      } else {
        throw new Error(`Failed to save content - Context: throw new Error('Failed to save content');...`);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to saving content. Please try again or contact support if the problem persists.`);
      toast.error('Failed to save content');
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/institution/content/${contentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Content deleted successfully');
        fetchContentData();
      } else {
        throw new Error(`Failed to delete content - Context: toast.success('Content deleted successfully');...`);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting content. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete content');
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'module':
        return <BookOpen className="w-4 h-4" />;
      case 'lesson':
        return <FileText className="w-4 h-4" />;
      case 'resource':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter and sort content items
  const filteredContent = contentItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">
            Create and manage your learning content
          </p>
        </div>
        <Button onClick={handleCreateContent}>
          <Plus className="w-4 h-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Content Creator */}
      {(isCreating || selectedContent) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {isCreating ? 'Create New Content' : `Edit: ${selectedContent?.title}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContentCreator
              moduleId={selectedContent?.id}
              onSave={handleSaveContent}
              initialContent={selectedContent?.blocks || []}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative search-container-long">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="module">Modules</option>
                <option value="lesson">Lessons</option>
                <option value="resource">Resources</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="updatedAt">Last Updated</option>
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No content found.</p>
                <p className="text-sm">
                  {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                    ? 'Try adjusting your filters.' 
                    : 'Create your first piece of content to get started.'}
                </p>
              </div>
            ) : (
              filteredContent.map((content) => (
                <Card key={content.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getContentIcon(content.type)}
                        <Badge variant="outline" className="capitalize">
                          {content.type}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(content.status)}>
                        {content.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold mb-2 line-clamp-2">{content.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {content.description}
                    </p>
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      <p>Course: {content.courseTitle}</p>
                      <p>Updated: {formatDate(content.updatedAt)}</p>
                    </div>

                    {content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {content.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {content.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{content.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditContent(content)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/institution/content/${content.id}`)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteContent(content.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
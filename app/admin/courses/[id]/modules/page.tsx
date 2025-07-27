'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, GripVertical, Trash2, Edit, Eye, BookOpen, FileText, Target } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Module {
  id: string;
  title: string;
  description?: string;
  level: string;
  order_index: number;
  estimated_duration: number;
  is_published: boolean;
  contentItems: Array<{
    id: string;
    title: string;
    type: string;
  }>;
  exercises: Array<{
    id: string;
    question: string;
    type: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    passing_score: number;
  }>;
  skills: string[];
}

interface Course {
  id: string;
  title: string;
  institution: {
    name: string;
  };
}

export default function AdminModulesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    level: 'BEGINNER',
    estimated_duration: 0
  });

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch course details
      const courseResponse = await fetch(`/api/admin/courses/${params.id}`);
      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course');
      }
      const courseData = await courseResponse.json();
      setCourse(courseData);
      
      // Fetch modules
      const modulesResponse = await fetch(`/api/admin/courses/${params.id}/modules`);
      if (!modulesResponse.ok) {
        throw new Error('Failed to fetch modules');
      }
      const modulesData = await modulesResponse.json();
      setModules(modulesData);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to load data. Please try again or contact support if the problem persists.`);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createFormData.title.trim()) {
      toast.error('Module title is required');
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${params.id}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to create module');
      }

      toast.success('Module created successfully');
      setIsCreateModalOpen(false);
      setCreateFormData({
        title: '',
        description: '',
        level: 'BEGINNER',
        estimated_duration: 0
      });
      fetchData();
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to creating module:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create module');
    }
  };

  const handleEditModule = (moduleId: string) => {
    router.push(`/admin/courses/${params.id}/modules/${moduleId}/edit`);
  };

  const handleViewModule = (moduleId: string) => {
    router.push(`/admin/courses/${params.id}/modules/${moduleId}`);
  };

  const handleManageContent = (moduleId: string) => {
    router.push(`/admin/courses/${params.id}/modules/${moduleId}/content`);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${params.id}/modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete module');
      }

      toast.success('Module deleted successfully');
      fetchData();
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to deleting module:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete module');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Course Modules</h1>
            <p className="text-muted-foreground">
              Manage modules for {course?.title} • {course?.institution.name}
            </p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
              <DialogDescription>
                Add a new module to this course. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateModule} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                  placeholder="Enter module title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  placeholder="Enter module description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={createFormData.level}
                    onValueChange={(value) => setCreateFormData({ ...createFormData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={createFormData.estimated_duration}
                    onChange={(e) => setCreateFormData({ ...createFormData, estimated_duration: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Module</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modules List */}
      <Card>
        <CardContent className="p-6">
          <TooltipProvider>
            {modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-gray-500">
                          {module.description || 'No description'}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span>Level: {module.level}</span>
                          <span>•</span>
                          <span>Duration: {module.estimated_duration} mins</span>
                          <span>•</span>
                          <span>Order: {module.order_index}</span>
                          <span>•</span>
                          <Badge variant={module.is_published ? 'default' : 'secondary'} className="text-xs">
                            {module.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {module.contentItems.length} content items
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {module.exercises.length} exercises
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {module.quizzes.length} quizzes
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewModule(module.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Module</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleManageContent(module.id)}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Manage Content</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditModule(module.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Module</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteModule(module.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Module</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                <p className="text-gray-500 mb-4">
                  Get started by creating your first module for this course.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Module
                </Button>
              </div>
            )}
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
} 
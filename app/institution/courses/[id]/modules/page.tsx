'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, GripVertical, Trash2, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface Module {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  contentItems: {
    id: string;
    title: string;
    type: string;
  }[];
  exercises: {
    id: string;
    question: string;
    type: string;
  }[];
  quizzes: {
    id: string;
    title: string;
    passing_score: number;
  }[];
}

export default function ModulesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, [params.id]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/institution/courses/${params.id}/modules`);
      if (!response.ok) {
        throw new Error(`Failed to fetch modules - Context: throw new Error('Failed to fetch modules');...`);
      }
      const data = await response.json();
      setModules(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load modules. Please try again or contact support if the problem persists.`);
      setError('Failed to load modules. Please try again.');
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = () => {
    router.push(`/institution/courses/${params.id}/modules/new`);
  };

  const handleEditModule = (moduleId: string) => {
    router.push(`/institution/courses/${params.id}/modules/${moduleId}/edit`);
  };

  const handleViewContent = (moduleId: string) => {
    router.push(`/institution/courses/${params.id}/modules/${moduleId}/content`);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module?')) {
      return;
    }

    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${moduleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete module - Context: method: 'DELETE',...`);
      }

      toast.success('Module deleted successfully');
      fetchModules();
      // Dispatch event to notify sidebar of module change
      window.dispatchEvent(new Event('moduleChange'));
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting module. Please try again or contact support if the problem persists.`);
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
        <Button onClick={fetchModules}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              Manage your course modules and content
            </p>
          </div>
        </div>
        <Button onClick={handleCreateModule}>
          <Plus className="w-4 h-4 mr-2" />
          Create Module
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No modules found. Create your first module to get started.
              </div>
            ) : (
              modules.map((module) => (
                <div
                  key={module.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                    <div>
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {module.description || 'No description'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {module.framework} {module.level.replace(`${module.framework}_`, '')}
                        </span>
                        <div className="text-sm text-muted-foreground">
                          {module.contentItems.length} content items
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewContent(module.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Content</TooltipContent>
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
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete Module</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))
            )}
          </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
} 
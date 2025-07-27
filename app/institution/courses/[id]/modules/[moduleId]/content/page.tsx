'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, GripVertical, Trash2, Edit, Eye, Target, FileVideo, FileAudio, Image, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import React from 'react';

interface ContentItem {
  id: string;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
  title: string;
  description?: string | null;
  content: string;
  order_index: number;
  module_id: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passing_score: number;
  time_limit?: number;
  mediaUrl?: string | null;
  quiz_type: string;
  difficulty: string;
  instructions?: string;
  allow_retry: boolean;
  max_attempts: number;
  show_results: boolean;
  show_explanations: boolean;
  quizQuestions: Array<{
    id: string;
    question: string;
    type: string;
    points: number;
  }>;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  order_index: number;
  contentItems: ContentItem[];
  exercises: Exercise[];
  quizzes: Quiz[];
  student_progress: {
    content_completed: boolean;
    exercises_completed: boolean;
    quiz_completed: boolean;
  }[];
}

export default function ModuleContentPage({ params }: { params: { id: string; moduleId: string } }) {
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);

  useEffect(() => {
    fetchModule();
  }, [params.id, params.moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch module - Context: throw new Error('Failed to fetch module');...`);
      }
      const data = await response.json();
      setModule(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load module. Please try again or contact support if the problem persists.`);
      setError('Failed to load module content. Please try again.');
      toast.error('Failed to load module content');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/content/new`);
  };

  const handleManageQuizzes = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes`);
  };

  const handleViewQuizDetails = (quizId: string) => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${quizId}`);
  };

  const handleViewContent = (item: ContentItem) => {
    if (!item.content || item.content.trim() === '') {
      toast.error('No content available for this item');
      return;
    }
    
    // Check if it's a valid URL
    try {
      // Try to create a URL object - this will throw if invalid
      const url = new URL(item.content);
      
      // If it's a relative URL (starts with /), make it absolute
      if (item.content.startsWith('/')) {
        window.open(`${window.location.origin}${item.content}`, '_blank');
      } else {
        window.open(item.content, '_blank');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      // If it's not a valid URL, show content details in modal
      setSelectedContent(item);
      setShowContentModal(true);
    }
  };

  const handleEditContent = (contentId: string) => {
    // // // console.log('Editing content with ID:', contentId); // Debug log
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/content/${contentId}/edit`);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/content/${contentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete content item - Context: method: 'DELETE',...`);
      }

      toast.success('Content item deleted successfully');
      fetchModule();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting content item. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete content item');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return FileVideo;
      case 'AUDIO': return FileAudio;
      case 'IMAGE': return Image;
      case 'DOCUMENT': return FileText;
      default: return FileText;
    }
  };

  const renderContentPreview = (content: string, type: string) => {
    if (!content) return <p className="text-gray-500">No content available</p>;
    
    // Check if it's a local file path (starts with /uploads/)
    const isLocalFile = content.startsWith('/uploads/');
    
    if (isLocalFile) {
      // Handle local file paths
      const fileName = content.split('/').pop() || 'Unknown file';
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">File:</span>
            <span className="text-sm text-gray-600">{fileName}</span>
          </div>
          
          {type === 'VIDEO' && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Video Preview:</p>
              <video 
                controls 
                className="w-full max-w-md rounded border"
                src={content}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {type === 'AUDIO' && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Audio Preview:</p>
              <audio 
                controls 
                className="w-full max-w-md"
                src={content}
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
          
          {type === 'IMAGE' && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Image Preview:</p>
              <img 
                src={content} 
                alt="Content preview" 
                className="max-w-md rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <p className="text-sm text-gray-500 hidden">Image failed to load</p>
            </div>
          )}
          
          {type === 'DOCUMENT' && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Document:</p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="text-sm">{fileName}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(content, '_blank')}
                  className="ml-auto"
                >
                  Open Document
                </Button>
              </div>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">File path: {content}</p>
          </div>
        </div>
      );
    }
    
    // Handle external URLs
    try {
      const url = new URL(content);
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium">External URL:</p>
          <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            {content}
          </a>
        </div>
      );
    } catch (error) {
    console.error('Error occurred:', error);
      // Handle plain text content
      return (
        <div className="space-y-2">
          <p className="text-sm font-medium">Content:</p>
          <div className="bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{content}</pre>
          </div>
        </div>
      );
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
        <Button onClick={fetchModule}>Retry</Button>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">Module not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Module Content</h1>
            <p className="text-muted-foreground">
              Manage content and quizzes for {module?.title}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleManageQuizzes}>
              <Target className="w-4 h-4 mr-2" />
              Manage Quizzes
            </Button>
            <Button onClick={handleCreateContent}>
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>
        </div>

        {/* Content Items */}
        <Card>
          <CardHeader>
            <CardTitle>Content Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!module.contentItems || module.contentItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content items found. Add your first content item to get started.
                </div>
              ) : (
                module.contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewContent(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditContent(item.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteContent(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quizzes Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quizzes</CardTitle>
              <Button variant="outline" size="sm" onClick={handleManageQuizzes}>
                <Target className="w-4 h-4 mr-2" />
                Manage Quizzes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {module.quizzes && module.quizzes.length > 0 ? (
                module.quizzes.slice(0, 3).map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Target className="w-5 h-5 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-sm text-muted-foreground">
                            {quiz.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {quiz.quiz_type}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {quiz.quizQuestions?.length || 0} questions
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {quiz.passing_score}% passing
                          </span>
                          {quiz.time_limit && (
                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                              {quiz.time_limit}m
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewQuizDetails(quiz.id)}
                    >
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
                  <p className="text-sm mb-4">
                    Create quizzes to assess student learning in this module.
                  </p>
                  <Button variant="outline" onClick={handleManageQuizzes}>
                    <Target className="w-4 h-4 mr-2" />
                    Create Quiz
                  </Button>
                </div>
              )}
              {module.quizzes && module.quizzes.length > 3 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={handleManageQuizzes}>
                    View All {module.quizzes.length} Quizzes
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Details Modal */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedContent && React.createElement(getContentIcon(selectedContent.type), { className: "w-5 h-5" })}
              {selectedContent?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedContent && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">Type:</Label>
                  <div className="col-span-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedContent.type}
                    </span>
                  </div>
                </div>
                {selectedContent.description && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">Description:</Label>
                    <div className="col-span-3 text-sm text-gray-600">
                      {selectedContent.description}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-medium pt-2">Content:</Label>
                  <div className="col-span-3">
                    {renderContentPreview(selectedContent.content, selectedContent.type)}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowContentModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 
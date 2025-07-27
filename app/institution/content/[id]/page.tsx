'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Edit, Eye, FileVideo, FileAudio, Image, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'lesson';
  status: 'published';
  courseId: string;
  courseTitle: string;
  createdAt: string;
  updatedAt: string;
  blocks: any[];
  tags: any[];
  content: string;
  moduleId: string;
  moduleTitle: string;
  orderIndex: number;
  contentType: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
}

export default function ContentDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (!session?.user?.role || session.user.role !== 'INSTITUTION') {
      router.push('/dashboard');
      return;
    }

    fetchContent();
  }, [session, status, params.id]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/institution/content/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Content not found');
        } else {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content details');
      toast.error('Failed to load content details');
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <FileVideo className="w-5 h-5" />;
      case 'AUDIO':
        return <FileAudio className="w-5 h-5" />;
      case 'IMAGE':
        return <Image className="w-5 h-5" />;
      case 'DOCUMENT':
        return <FileText className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-red-100 text-red-800';
      case 'AUDIO':
        return 'bg-blue-100 text-blue-800';
      case 'IMAGE':
        return 'bg-green-100 text-green-800';
      case 'DOCUMENT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditContent = () => {
    if (content) {
      router.push(`/institution/courses/${content.courseId}/modules/${content.moduleId}/content/${content.id}/edit`);
    }
  };

  const handleViewContent = () => {
    if (!content?.content) {
      toast.error('No content available');
      return;
    }

    // Handle different content types appropriately
    if (content.contentType === 'VIDEO') {
      // For video files, create a proper video player page
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${content.title} - Video Player</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  background: #f5f5f5; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh; 
                }
                .video-container { 
                  max-width: 90vw; 
                  max-height: 90vh; 
                  background: white; 
                  border-radius: 8px; 
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                  overflow: hidden; 
                }
                .video-header { 
                  padding: 20px; 
                  border-bottom: 1px solid #eee; 
                  background: #f8f9fa; 
                }
                .video-header h1 { 
                  margin: 0 0 10px 0; 
                  color: #333; 
                  font-size: 1.5rem; 
                }
                .video-header p { 
                  margin: 5px 0; 
                  color: #666; 
                  font-size: 0.9rem; 
                }
                .video-player { 
                  width: 100%; 
                  max-height: 70vh; 
                  display: block; 
                }
                .video-info { 
                  padding: 15px 20px; 
                  background: #f8f9fa; 
                  border-top: 1px solid #eee; 
                }
                .video-url { 
                  word-break: break-all; 
                  color: #007bff; 
                  text-decoration: none; 
                }
                .video-url:hover { 
                  text-decoration: underline; 
                }
              </style>
            </head>
            <body>
              <div class="video-container">
                <div class="video-header">
                  <h1>${content.title}</h1>
                  <p><strong>Course:</strong> ${content.courseTitle}</p>
                  <p><strong>Module:</strong> ${content.moduleTitle}</p>
                </div>
                <video class="video-player" controls autoplay preload="metadata">
                  <source src="${content.content}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
                <div class="video-info">
                  <p><strong>Video URL:</strong></p>
                  <a href="${content.content}" target="_blank" class="video-url">${content.content}</a>
                </div>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else if (content.contentType === 'AUDIO') {
      // For audio files, create a proper audio player page
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${content.title} - Audio Player</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  background: #f5f5f5; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh; 
                }
                .audio-container { 
                  max-width: 500px; 
                  width: 90vw; 
                  background: white; 
                  border-radius: 8px; 
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
                  overflow: hidden; 
                }
                .audio-header { 
                  padding: 20px; 
                  border-bottom: 1px solid #eee; 
                  background: #f8f9fa; 
                }
                .audio-header h1 { 
                  margin: 0 0 10px 0; 
                  color: #333; 
                  font-size: 1.5rem; 
                }
                .audio-header p { 
                  margin: 5px 0; 
                  color: #666; 
                  font-size: 0.9rem; 
                }
                .audio-player { 
                  width: 100%; 
                  padding: 20px; 
                }
                .audio-info { 
                  padding: 15px 20px; 
                  background: #f8f9fa; 
                  border-top: 1px solid #eee; 
                }
                .audio-url { 
                  word-break: break-all; 
                  color: #007bff; 
                  text-decoration: none; 
                }
                .audio-url:hover { 
                  text-decoration: underline; 
                }
              </style>
            </head>
            <body>
              <div class="audio-container">
                <div class="audio-header">
                  <h1>${content.title}</h1>
                  <p><strong>Course:</strong> ${content.courseTitle}</p>
                  <p><strong>Module:</strong> ${content.moduleTitle}</p>
                </div>
                <div class="audio-player">
                  <audio controls autoplay preload="metadata" style="width: 100%;">
                    <source src="${content.content}" type="audio/mpeg">
                    Your browser does not support the audio tag.
                  </audio>
                </div>
                <div class="audio-info">
                  <p><strong>Audio URL:</strong></p>
                  <a href="${content.content}" target="_blank" class="audio-url">${content.content}</a>
                </div>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } else if (content.contentType === 'IMAGE') {
      // For images, open in new tab
      window.open(content.content, '_blank');
    } else if (content.contentType === 'DOCUMENT') {
      // For documents, try to open the URL directly
      try {
        const url = new URL(content.content);
        window.open(content.content, '_blank');
      } catch (error) {
        // If it's not a valid URL, show content in modal
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${content.title}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                  .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                  .content { max-width: 800px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="content">
                  <div class="header">
                    <h1>${content.title}</h1>
                    <p><strong>Course:</strong> ${content.courseTitle}</p>
                    <p><strong>Module:</strong> ${content.moduleTitle}</p>
                  </div>
                  <div>${content.content}</div>
                </div>
              </body>
            </html>
          `);
          newWindow.document.close();
        }
      }
    } else {
      // Fallback for unknown content types
      try {
        const url = new URL(content.content);
        window.open(content.content, '_blank');
      } catch (error) {
        // If it's not a valid URL, show content in modal
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${content.title}</title>
                <style>
                  body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                  .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                  .content { max-width: 800px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="content">
                  <div class="header">
                    <h1>${content.title}</h1>
                    <p><strong>Course:</strong> ${content.courseTitle}</p>
                    <p><strong>Module:</strong> ${content.moduleTitle}</p>
                  </div>
                  <div>${content.content}</div>
                </div>
              </body>
            </html>
          `);
          newWindow.document.close();
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The content you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/institution/content-management')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Content Management
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push('/institution/content-management')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Content Management
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
            <p className="text-gray-600 mt-2">{content.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleViewContent}>
              <Eye className="w-4 h-4 mr-2" />
              {content.contentType === 'VIDEO' ? 'Play Video' : 
               content.contentType === 'AUDIO' ? 'Play Audio' : 
               content.contentType === 'IMAGE' ? 'View Image' : 
               'View Content'}
            </Button>
            <Button variant="outline" onClick={handleEditContent}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getContentTypeIcon(content.contentType)}
                Content Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getContentTypeColor(content.contentType)}>
                    {content.contentType}
                  </Badge>
                  <Badge variant="secondary">
                    Order: {content.orderIndex}
                  </Badge>
                </div>
                
                <Separator />
                
                <div className="prose max-w-none">
                  {content.contentType === 'IMAGE' ? (
                    <img 
                      src={content.content} 
                      alt={content.title}
                      className="max-w-full h-auto rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : content.contentType === 'VIDEO' ? (
                    <div className="space-y-4">
                      <video 
                        controls 
                        className="w-full rounded-lg max-h-96"
                        src={content.content}
                        preload="metadata"
                      >
                        Your browser does not support the video tag.
                      </video>
                      <div className="text-sm text-gray-600">
                        <p><strong>Video URL:</strong></p>
                        <a 
                          href={content.content} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all flex items-center gap-1"
                        >
                          {content.content}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : content.contentType === 'AUDIO' ? (
                    <div className="space-y-4">
                      <audio 
                        controls 
                        className="w-full"
                        src={content.content}
                        preload="metadata"
                      >
                        Your browser does not support the audio tag.
                      </audio>
                      <div className="text-sm text-gray-600">
                        <p><strong>Audio URL:</strong></p>
                        <a 
                          href={content.content} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 break-all flex items-center gap-1"
                        >
                          {content.content}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Content URL:</p>
                      <a 
                        href={content.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all flex items-center gap-1"
                      >
                        {content.content}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course & Module Info */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Course</label>
                <p className="text-sm text-gray-900">{content.courseTitle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Module</label>
                <p className="text-sm text-gray-900">{content.moduleTitle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Content Type</label>
                <div className="flex items-center gap-2 mt-1">
                  {getContentTypeIcon(content.contentType)}
                  <span className="text-sm text-gray-900">{content.contentType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-sm text-gray-900">
                  {new Date(content.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-sm text-gray-900">
                  {new Date(content.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <Badge variant="outline" className="mt-1">
                  {content.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
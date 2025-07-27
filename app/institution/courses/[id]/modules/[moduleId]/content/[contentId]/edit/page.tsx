'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileAudio, FileVideo, Image, FileText, Save } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { cn } from "@/lib/utils";

interface ContentFormData {
  title: string;
  description: string;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
  file?: File;
  url?: string;
  order_index: number;
}

interface ContentItem {
  id: string;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
  title: string;
  description?: string | null;
  content: string;
  order_index: number;
  module_id: string;
}

export default function EditContentPage({ params }: { params: { id: string; moduleId: string; contentId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    type: 'VIDEO',
    order_index: 0
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(10);

  useEffect(() => {
    fetchContent();
    fetch('/api/admin/settings/general')
      .then(res => res.json())
      .then(data => {
        if (data.fileUploadMaxSizeMB) setMaxFileSizeMB(data.fileUploadMaxSizeMB);
      });
  }, []);

  const fetchContent = async () => {
    try {
      // // // // // // // // // console.log('Fetching content with params:', params); // Debug log
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/content/${params.contentId}`);
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Failed to response. Please try again or contact support if the problem persists.`); // Debug log
        throw new Error(`Failed to fetch content: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched content data:', data); // Debug log
      
      setContent(data);
      setFormData({
        title: data.title,
        description: data.description || '',
        type: data.type,
        url: data.content,
        order_index: data.order_index
      });
      setFilePreview(data.content);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load content. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type based on selected content type
    const validTypes = {
      'VIDEO': ['video/mp4', 'video/webm', 'video/ogg'],
      'AUDIO': ['audio/mpeg', 'audio/wav', 'audio/ogg'],
      'IMAGE': ['image/jpeg', 'image/png', 'image/gif'],
      'DOCUMENT': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    if (!validTypes[formData.type].includes(file.type)) {
      toast.error(`Invalid file type. Please upload a valid ${formData.type.toLowerCase()} file.`);
      return;
    }

    // Validate file size (maxFileSizeMB limit)
    const maxSize = maxFileSizeMB * 1024 * 1024; // maxFileSizeMB in bytes
    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setSelectedFileName(file.name);
    
    // Create preview URL for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else if (file.type === 'application/pdf') {
      // For PDFs, we'll show a document icon with the filename
      setFilePreview(null);
    } else {
      setFilePreview(null);
    }
  };

  const handleContentTypeChange = (type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT') => {
    setFormData(prev => ({ ...prev, type }));
    setFilePreview(null);
    setSelectedFileName(null);
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the input
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/content/${params.contentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update content - Context: body: JSON.stringify(formData),...`);
      }

      toast.success('Content updated successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/content`);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating content. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Content not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Content</h1>
          <p className="text-muted-foreground">
            Update content details and media
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content Type Selection */}
            <div className="space-y-2">
              <Label>Content Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: 'VIDEO' as const, icon: FileVideo, label: 'Video' },
                  { type: 'AUDIO' as const, icon: FileAudio, label: 'Audio' },
                  { type: 'IMAGE' as const, icon: Image, label: 'Image' },
                  { type: 'DOCUMENT' as const, icon: FileText, label: 'Document' },
                ].map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleContentTypeChange(type)}
                    className={cn(
                      "flex flex-col items-center p-4 border-2 rounded-lg transition-colors",
                      formData.type === type
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <Icon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {/* File Upload or URL */}
            <div className="space-y-4">
              <Label>Media</Label>
              
              {/* File Upload */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileUploadClick}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedFileName || 'Choose File'}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept={
                    formData.type === 'VIDEO' ? 'video/*' :
                    formData.type === 'AUDIO' ? 'audio/*' :
                    formData.type === 'IMAGE' ? 'image/*' :
                    'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                  }
                />
                {selectedFileName && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFileName}
                  </p>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/media"
                />
              </div>

              {/* Preview */}
              {filePreview && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-4">
                    {formData.type === 'VIDEO' && (
                      <video
                        src={filePreview}
                        controls
                        className="w-full max-w-md mx-auto"
                      />
                    )}
                    {formData.type === 'AUDIO' && (
                      <audio
                        src={filePreview}
                        controls
                        className="w-full"
                      />
                    )}
                    {formData.type === 'IMAGE' && (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-full max-w-md mx-auto rounded"
                      />
                    )}
                    {formData.type === 'DOCUMENT' && (
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded">
                        <FileText className="w-8 h-8 text-gray-500" />
                        <span className="text-sm text-gray-600">Document Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Index */}
            <div>
              <Label htmlFor="order_index">Display Order</Label>
              <Input
                id="order_index"
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
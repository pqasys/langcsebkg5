'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Image, 
  Video, 
  FileText, 
  Link, 
  Code, 
  Save, 
  Eye,
  Edit,
  Trash2,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video' | 'link' | 'code' | 'quiz';
  content: string;
  metadata?: {
    alt?: string;
    url?: string;
    duration?: number;
    size?: number;
    language?: string;
  };
  order: number;
}

interface ContentCreatorProps {
  moduleId?: string;
  onSave?: (content: ContentBlock[]) => void;
  initialContent?: ContentBlock[];
}

export default function ContentCreator({ moduleId, onSave, initialContent = [] }: ContentCreatorProps) {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(initialContent);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addContentBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      order: contentBlocks.length,
      metadata: {}
    };

    setContentBlocks([...contentBlocks, newBlock]);
    setActiveBlock(newBlock.id);
    setIsEditing(true);
  };

  const updateContentBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const removeContentBlock = (id: string) => {
    setContentBlocks(blocks => blocks.filter(block => block.id !== id));
    if (activeBlock === id) {
      setActiveBlock(null);
      setIsEditing(false);
    }
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    setContentBlocks(blocks => {
      const index = blocks.findIndex(block => block.id === id);
      if (index === -1) return blocks;

      const newBlocks = [...blocks];
      if (direction === 'up' && index > 0) {
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      }

      return newBlocks.map((block, idx) => ({ ...block, order: idx }));
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const fileType = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : null;

    if (!fileType) {
      toast.error('Unsupported file type. Please upload an image or video.');
      return;
    }

    try {
      // In a real implementation, you would upload to a cloud service
      // For now, we'll create a local URL
      const url = URL.createObjectURL(file);
      
      const newBlock: ContentBlock = {
        id: `block-${Date.now()}`,
        type: fileType,
        content: url,
        order: contentBlocks.length,
        metadata: {
          alt: file.name,
          size: file.size,
          url: url
        }
      };

      setContentBlocks([...contentBlocks, newBlock]);
      setActiveBlock(newBlock.id);
      setIsEditing(true);
      toast.success(`${fileType} uploaded successfully`);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to upload file');
    }
  };

  const handleSave = async () => {
    if (!moduleId) {
      toast.error('Module ID is required');
      return;
    }

    setSaving(true);
    try {
      // In a real implementation, you would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSave?.(contentBlocks);
      setIsEditing(false);
      toast.success('Content saved successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const renderContentBlock = (block: ContentBlock) => {
    const isActive = activeBlock === block.id;

    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Textarea
              value={block.content}
              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
              placeholder="Enter your text content here..."
              className="min-h-[100px]"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={block.content}
                alt={block.metadata?.alt || 'Content image'}
                className="w-full max-w-md h-auto rounded-lg border"
              />
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeContentBlock(block.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`alt-${block.id}`}>Alt Text</Label>
              <Input
                id={`alt-${block.id}`}
                value={block.metadata?.alt || ''}
                onChange={(e) => updateContentBlock(block.id, {
                  metadata: { ...block.metadata, alt: e.target.value }
                })}
                placeholder="Describe the image for accessibility..."
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="relative">
              <video
                src={block.content}
                controls
                className="w-full max-w-md h-auto rounded-lg border"
              />
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeContentBlock(block.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`video-url-${block.id}`}>Video URL</Label>
              <Input
                id={`video-url-${block.id}`}
                value={block.metadata?.url || ''}
                onChange={(e) => updateContentBlock(block.id, {
                  metadata: { ...block.metadata, url: e.target.value }
                })}
                placeholder="Enter video URL..."
              />
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="space-y-2">
            <Label htmlFor={`link-url-${block.id}`}>Link URL</Label>
            <Input
              id={`link-url-${block.id}`}
              value={block.content}
              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
              placeholder="https://example.com"
            />
            <Label htmlFor={`link-text-${block.id}`}>Link Text</Label>
            <Input
              id={`link-text-${block.id}`}
              value={block.metadata?.alt || ''}
              onChange={(e) => updateContentBlock(block.id, {
                metadata: { ...block.metadata, alt: e.target.value }
              })}
              placeholder="Click here to learn more"
            />
          </div>
        );

      case 'code':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`code-language-${block.id}`}>Language</Label>
              <select
                id={`code-language-${block.id}`}
                value={block.metadata?.language || 'javascript'}
                onChange={(e) => updateContentBlock(block.id, {
                  metadata: { ...block.metadata, language: e.target.value }
                })}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => updateContentBlock(block.id, { content: e.target.value })}
              placeholder="Enter your code here..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Quiz Block</h4>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive quiz functionality will be available in the next update.
            </p>
          </div>
        );

      default:
        return <div>Unknown content type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Content Creator</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Eye className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
                {isEditing ? 'Preview' : 'Edit'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing && (
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addContentBlock('text')}
              >
                <FileText className="w-4 h-4 mr-1" />
                Text
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="w-4 h-4 mr-1" />
                Image
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addContentBlock('video')}
              >
                <Video className="w-4 h-4 mr-1" />
                Video
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addContentBlock('link')}
              >
                <Link className="w-4 h-4 mr-1" />
                Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addContentBlock('code')}
              >
                <Code className="w-4 h-4 mr-1" />
                Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addContentBlock('quiz')}
              >
                <Plus className="w-4 h-4 mr-1" />
                Quiz
              </Button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Content Blocks */}
          <div className="space-y-4">
            {contentBlocks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No content blocks yet.</p>
                <p className="text-sm">Start by adding content using the tools above.</p>
              </div>
            ) : (
              contentBlocks.map((block, index) => (
                <Card key={block.id} className="relative">
                  <CardContent className="pt-6">
                    {isEditing && (
                      <div className="absolute top-2 right-2 flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveBlock(block.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveBlock(block.id, 'down')}
                          disabled={index === contentBlocks.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeContentBlock(block.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className="mb-2">
                      <Badge variant="outline" className="capitalize">
                        {block.type}
                      </Badge>
                    </div>
                    
                    {renderContentBlock(block)}
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
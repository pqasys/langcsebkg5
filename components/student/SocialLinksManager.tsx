'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Link, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface SocialLink {
  platform: string;
  url: string;
  username?: string;
}

interface SocialLinksManagerProps {
  value: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  disabled?: boolean;
}

const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'github', label: 'GitHub', icon: '🐙', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦', color: 'bg-black text-white border-black' },
  { value: 'instagram', label: 'Instagram', icon: '📷', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { value: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'youtube', label: 'YouTube', icon: '📺', color: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵', color: 'bg-black text-white border-black' },
  { value: 'discord', label: 'Discord', icon: '🎮', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { value: 'telegram', label: 'Telegram', icon: '✈️', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'whatsapp', label: 'WhatsApp', icon: '💬', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'snapchat', label: 'Snapchat', icon: '👻', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { value: 'reddit', label: 'Reddit', icon: '🤖', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'medium', label: 'Medium', icon: '📝', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'dev', label: 'Dev.to', icon: '💻', color: 'bg-black text-white border-black' },
  { value: 'stackoverflow', label: 'Stack Overflow', icon: '🔧', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'behance', label: 'Behance', icon: '🎨', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'dribbble', label: 'Dribbble', icon: '🏀', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { value: 'portfolio', label: 'Portfolio', icon: '📁', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { value: 'blog', label: 'Blog', icon: '📖', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'other', label: 'Other', icon: '🔗', color: 'bg-gray-100 text-gray-800 border-gray-200' },
];

export default function SocialLinksManager({ 
  value, 
  onChange, 
  disabled = false 
}: SocialLinksManagerProps) {
  const [links, setLinks] = useState<SocialLink[]>(value || []);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');

  useEffect(() => {
    setLinks(value || []);
  }, [value]);

  const handleAddLink = () => {
    if (!selectedPlatform || !newUrl) {
      toast.error('Please select a platform and enter a URL');
      return;
    }

    const platformExists = links.some(link => link.platform === selectedPlatform);
    if (platformExists) {
      toast.error('This platform is already added');
      return;
    }

    // Basic URL validation
    let url = newUrl;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    const newLink: SocialLink = {
      platform: selectedPlatform,
      url: url,
      username: newUsername || undefined
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    onChange(updatedLinks);
    
    setSelectedPlatform('');
    setNewUrl('');
    setNewUsername('');
    toast.success('Social link added successfully');
  };

  const handleRemoveLink = (platformToRemove: string) => {
    const updatedLinks = links.filter(link => link.platform !== platformToRemove);
    setLinks(updatedLinks);
    onChange(updatedLinks);
    toast.success('Social link removed successfully');
  };

  const handleUpdateLink = (platform: string, field: 'url' | 'username', value: string) => {
    const updatedLinks = links.map(link => 
      link.platform === platform 
        ? { ...link, [field]: value }
        : link
    );
    setLinks(updatedLinks);
    onChange(updatedLinks);
  };

  const getPlatformInfo = (platform: string) => {
    return SOCIAL_PLATFORMS.find(p => p.value === platform);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Link className="w-5 h-5" />
          Social Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Links */}
        {links.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Your Social Links</Label>
            <div className="grid gap-3">
              {links.map((link) => {
                const platformInfo = getPlatformInfo(link.platform);
                return (
                  <div key={link.platform} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{platformInfo?.icon}</span>
                        <span className="font-medium">{platformInfo?.label}</span>
                        {link.username && (
                          <span className="text-sm text-gray-500">@{link.username}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openLink(link.url)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      {!disabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLink(link.platform)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add New Link */}
        {!disabled && (
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-medium">Add New Social Link</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        <span>{platform.icon}</span>
                        <span>{platform.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="URL (e.g., https://linkedin.com/in/username)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Username (optional)"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              
              <Button 
                onClick={handleAddLink}
                disabled={!selectedPlatform || !newUrl}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Add your social media profiles to connect with other learners</p>
          <p>• Include your portfolio or blog to showcase your work</p>
          <p>• These links will be visible to other users based on your privacy settings</p>
        </div>
      </CardContent>
    </Card>
  );
} 
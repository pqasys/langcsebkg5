'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Reply, 
  Heart, 
  MoreHorizontal, 
  Send,
  ChevronDown,
  ChevronUp,
  Clock,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface DiscussionPost {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: DiscussionPost[];
  level: number; // Depth level for threading
  parentId?: string;
  replyCount: number;
}

interface ThreadedDiscussionProps {
  posts: DiscussionPost[];
  onSendPost: (content: string, parentId?: string) => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  currentUserId?: string;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  onRequireAuth?: () => void;
}

export default function ThreadedDiscussion({
  posts,
  onSendPost,
  onLikePost,
  currentUserId,
  isLoading = false,
  isAuthenticated = false,
  onRequireAuth
}: ThreadedDiscussionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const postsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new posts arrive
  useEffect(() => {
    postsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);

  // Debug: Log posts when they change
  useEffect(() => {
    console.log('ThreadedDiscussion received posts:', posts);
    console.log('Posts count:', posts.length);
    posts.forEach(post => {
      console.log(`- Post: ${post.content.substring(0, 50)}...`);
      console.log(`  Replies: ${post.replies?.length || 0}`);
    });
  }, [posts]);

  // Use posts as they come from API (already organized)
  // const organizePosts = (posts: DiscussionPost[]) => {
  //   const postMap = new Map<string, DiscussionPost>();
  //   const rootPosts: DiscussionPost[] = [];

  //   // First pass: create a map of all posts
  //   posts.forEach(post => {
  //     postMap.set(post.id, { ...post, replies: [] });
  //   });

  //   // Second pass: organize into hierarchy
  //   posts.forEach(post => {
  //     if (post.parentId) {
  //       const parent = postMap.get(post.parentId);
  //       if (parent) {
  //         parent.replies = parent.replies || [];
  //         parent.replies.push(postMap.get(post.id)!);
  //       }
  //     } else {
  //       rootPosts.push(postMap.get(post.id)!);
  //     }
  //   });

  //   return rootPosts;
  // };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;

    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    setSending(true);
    try {
      await onSendPost(replyContent, replyingTo || undefined);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      toast.error('Failed to post reply');
    } finally {
      setSending(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    try {
      await onLikePost(postId);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const toggleThread = (postId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedThreads(newExpanded);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getRandomAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderPost = (post: DiscussionPost, level: number = 0) => {
    const hasReplies = post.replies && post.replies.length > 0;
    const isExpanded = expandedThreads.has(post.id);
    const isThreaded = level > 0;

    return (
      <div key={post.id} className="relative">
        {/* Connection line for threaded posts */}
        {isThreaded && (
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
        )}
        
        <div className={`flex space-x-3 ${isThreaded ? 'ml-12' : ''}`}>
          {/* Avatar with connection line */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.image} />
              <AvatarFallback className={getRandomAvatarColor(post.author.name)}>
                {post.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Connection dot for threaded posts */}
            {isThreaded && (
              <div className="absolute -left-1 top-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white transform -translate-y-1/2" />
            )}
          </div>

          {/* Post content */}
          <div className="flex-1 min-w-0">
            <Card className={`mb-3 ${isThreaded ? 'border-l-4 border-l-blue-500' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{post.author.name}</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(post.createdAt)}
                    </span>
                    {post.author.id === currentUserId && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`h-8 px-3 text-xs ${
                        post.isLiked ? 'text-red-500' : 'text-gray-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(post.id)}
                      className="h-8 px-3 text-xs text-gray-500"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                  
                  {/* Thread controls */}
                  {hasReplies && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleThread(post.id)}
                      className="h-8 px-3 text-xs text-blue-600"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Hide {post.replies!.length} replies
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Show {post.replies!.length} replies
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reply input */}
            {replyingTo === post.id && (
              <div className="mb-4 ml-4">
                <div className="flex space-x-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="flex-1 min-h-[80px] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleSendReply}
                      disabled={sending || !replyContent.trim()}
                      size="sm"
                      className="h-8"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      size="sm"
                      className="h-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Threaded replies */}
            {hasReplies && isExpanded && (
              <div className="space-y-2">
                {post.replies!.map((reply) => renderPost(reply, level + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // const organizedPosts = organizePosts(posts);

  return (
    <div className="space-y-4">
      {/* Posts */}
      <div className="space-y-2">
        {posts.map((post) => renderPost(post))}
        
        {isLoading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        <div ref={postsEndRef} />
      </div>
    </div>
  );
}

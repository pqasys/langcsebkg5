'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Calendar,
  Settings,
  Edit,
  Crown,
  Plus,
  Search,
  Filter,
  Globe,
  Star,
  BookOpen,
  Video,
  FileText,
  Share2,
  MoreHorizontal,
  ArrowLeft,
  Bell,
  BellOff,
  Trash2,
  UserPlus,
  UserMinus,
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  Sparkles,
  Trophy,
  Heart,
  Zap,
  Target,
  TrendingUp,
  Award,
  Coffee,
  Music,
  Camera,
  Gamepad2,
  Palette,
  Lightbulb,
  Rocket,
  PartyPopper
} from 'lucide-react';

import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import ThreadedDiscussion from '@/components/ThreadedDiscussion';
import { CommunityQuizCard } from '@/components/community/CommunityQuizCard';
import { CommunityQuizInterface } from '@/components/community/CommunityQuizInterface';

interface Circle {
  id: string;
  name: string;
  slug: string;
  language: string;
  level: string;
  description: string;
  membersCount: number;
  maxMembers?: number;
  isPublic: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    image?: string;
  };
  isMember?: boolean;
  isOwner?: boolean;
  isModerator?: boolean;
}

interface Member {
  id: string;
  name: string;
  image?: string;
  joinedAt: string;
  role: 'owner' | 'moderator' | 'member';
  isOnline: boolean;
  lastActive: string;
}

interface Post {
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
  replies?: Post[];
  level: number;
  parentId?: string;
  replyCount: number;
}



interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'study-session' | 'conversation' | 'workshop' | 'social' | 'live-class';
  attendees: number;
  maxAttendees?: number;
  creator?: {
    id: string;
    name: string;
    image?: string;
  };
  // Live Class specific fields
  videoPlatform?: 'zoom' | 'google-meet' | 'teams' | 'other';
  meetingLink?: string;
  recordingEnabled?: boolean;
  materials?: string;
  instructorNotes?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  // Access control info
  accessInfo?: {
    canJoin: boolean;
    reason?: string;
    upgradePrompt?: {
      message: string;
      cta: string;
      planType: 'PREMIUM' | 'PRO';
    };
  };
}

export default function CircleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const slug = params.slug as string;

  const [circle, setCircle] = useState<Circle | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form states
  const [newPost, setNewPost] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    type: 'study-session' as const,
    maxAttendees: 10,
    // Live Class specific fields
    videoPlatform: 'zoom' as const,
    meetingLink: '',
    recordingEnabled: false,
    materials: '',
    instructorNotes: '',
    difficulty: 'beginner' as const,
    language: 'en'
  });
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showSubscriptionReminder, setShowSubscriptionReminder] = useState(false);
  const [joinedCircleName, setJoinedCircleName] = useState('');
  
  // Quiz states
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizUsage, setQuizUsage] = useState({ monthlyUsage: 0, totalAttempts: 0, averageScore: 0 });
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizAttempt, setQuizAttempt] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizRestrictions, setQuizRestrictions] = useState<any>(null);

  useEffect(() => {
    if (slug) {
      fetchCircleDetails();
    }
  }, [slug]);

  // Fetch quizzes when quizzes tab is active
  useEffect(() => {
    if (activeTab === 'quizzes' && session?.user) {
      fetchQuizzes();
      fetchQuizUsage();
    }
  }, [activeTab, session?.user]);



  // Handle automatic joining after authentication
  useEffect(() => {
    if (session?.user && circle && !circle.isMember) {
      const pendingCircleJoin = localStorage.getItem('pendingCircleJoin');
      if (pendingCircleJoin === slug) {
        // Clear the pending join
        localStorage.removeItem('pendingCircleJoin');
        // Automatically join the circle (skip auth check since we know user is authenticated)
        handleJoinCircle(true);
      }
    }
  }, [session, circle, slug]);

  // Handle return from authentication for discussion actions
  useEffect(() => {
    if (session?.user && circle) {
      const pendingDiscussionAction = localStorage.getItem('pendingDiscussionAction');
      if (pendingDiscussionAction) {
        try {
          const action = JSON.parse(pendingDiscussionAction);
          if (action.action === 'discussion' && action.circleSlug === slug) {
            // Clear the pending action
            localStorage.removeItem('pendingDiscussionAction');
            
            // If there was pending content, try to post it
            if (action.pendingContent && circle.isMember) {
              // Set the content and trigger the post
              setNewPost(action.pendingContent);
              // Use setTimeout to ensure state is updated before posting
              setTimeout(() => {
                handleCreatePost(action.pendingContent, action.parentId);
              }, 100);
            } else {
              // Show a welcome message
              toast.success('Welcome back! You can now contribute to the discussion.');
            }
          }
        } catch (error) {
          console.error('Error parsing pending discussion action:', error);
          localStorage.removeItem('pendingDiscussionAction');
        }
      }
    }
  }, [session, circle, slug]);

  const fetchCircleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/circles/${slug}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Fetched circle details:', data);
        console.log('Posts count:', data.posts?.length || 0);
        console.log('Posts structure:', JSON.stringify(data.posts, null, 2));
        setCircle(data.circle);
        setMembers(data.members || []);
        setPosts(data.posts || []);
        setEvents(data.events || []);
      } else {
        toast.error(data.error || 'Failed to load circle details');
        router.push('/community/circles');
      }
    } catch (error) {
      console.error('Error fetching circle details:', error);
      toast.error('Failed to load circle details');
      router.push('/community/circles');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCircle = async (skipAuthCheck = false) => {
    if (!circle) return;
    
    // Check if user is authenticated (unless skipping for auto-join)
    if (!skipAuthCheck && !session?.user) {
      // Store the circle context in localStorage for after login
      localStorage.setItem('pendingCircleJoin', slug);
      // Redirect to sign in page with return URL
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/community/circles/${slug}`)}`);
      return;
    }
    
    try {
      const response = await fetch(`/api/community/circles/${slug}/join`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Joined circle successfully!');
        
        // Show subscription reminder if needed
        if (data.showSubscriptionReminder) {
          setJoinedCircleName(data.circleName);
          setShowSubscriptionReminder(true);
        }
        
        fetchCircleDetails(); // Refresh data
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to join circle');
      }
    } catch (error) {
      console.error('Error joining circle:', error);
      toast.error('Failed to join circle');
    }
  };

  const handleLeaveCircle = async () => {
    if (!circle) return;
    
    try {
      const response = await fetch(`/api/community/circles/${slug}/leave`, {
        method: 'POST'
      });
      
      if (response.ok) {
        toast.success('Left circle successfully');
        router.push('/community/circles');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to leave circle');
      }
    } catch (error) {
      console.error('Error leaving circle:', error);
      toast.error('Failed to leave circle');
    }
  };

  const handleCreatePost = async (content: string, parentId?: string) => {
    if (!content.trim() || !circle) return;
    
    // Check authentication
    if (!session?.user) {
      // Store the current context for after login
      localStorage.setItem('pendingDiscussionAction', JSON.stringify({
        action: 'discussion',
        circleSlug: slug,
        returnUrl: `/community/circles/${slug}`,
        pendingContent: content,
        parentId: parentId
      }));
      // Redirect to sign in page
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/community/circles/${slug}`)}`);
      return;
    }
    
    // Check membership
    if (!circle.isMember) {
      toast.error('You need to be a member of this circle to post.');
      return;
    }
    
    try {
      console.log('Creating post/reply:', { content, parentId });
      const response = await fetch(`/api/community/circles/${slug}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, parentId })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (!parentId) {
          // This is a new post, not a reply
          toast.success('Post created successfully!');
          setNewPost('');
        } else {
          // This is a reply
          toast.success('Reply posted successfully!');
        }
        fetchCircleDetails(); // Refresh posts
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const handleLikePost = async (postId: string) => {
    // Check authentication
    if (!session?.user) {
      // Store the current context for after login
      localStorage.setItem('pendingDiscussionAction', JSON.stringify({
        action: 'discussion',
        circleSlug: slug,
        returnUrl: `/community/circles/${slug}`
      }));
      // Redirect to sign in page
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/community/circles/${slug}`)}`);
      return;
    }
    
    // Check membership
    if (!circle.isMember) {
      toast.error('You need to be a member of this circle to like posts.');
      return;
    }
    
    try {
      const response = await fetch(`/api/community/circles/${slug}/posts/${postId}/like`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Update the post in the list
        setPosts(prev => 
          prev.map(post => 
            post.id === postId 
              ? { ...post, likes: data.likeCount, isLiked: data.liked }
              : post
          )
        );
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  };



  const handleCreateEvent = async () => {
    if (!circle) return;
    
    try {
      const response = await fetch(`/api/community/circles/${slug}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      
      if (response.ok) {
        toast.success('Event created successfully!');
        setShowCreateEvent(false);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          time: '',
          duration: 60,
          type: 'study-session',
          maxAttendees: 10,
          // Live Class specific fields
          videoPlatform: 'zoom',
          meetingLink: '',
          recordingEnabled: false,
          materials: '',
          instructorNotes: '',
          difficulty: 'beginner',
          language: 'en'
        });
        fetchCircleDetails(); // Refresh events
      } else {
        const data = await response.json();
        if (data.requiresUpgrade) {
          toast.error(data.error);
          // You could show an upgrade modal here
        } else {
          toast.error(data.error || 'Failed to create event');
        }
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!session?.user) {
      toast.error('Please sign in to join events');
      return;
    }
    
    if (!circle.isMember) {
      toast.error('You need to be a member of this circle to join events');
      return;
    }

    try {
      const response = await fetch(`/api/community/circles/${slug}/events/${eventId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Successfully joined the event!');
        fetchCircleDetails(); // Refresh events
      } else {
        if (data.requiresUpgrade) {
          // Show upgrade prompt
          toast.error(data.error);
          if (data.upgradePrompt) {
            // You could show a modal here with the upgrade prompt
            console.log('Upgrade prompt:', data.upgradePrompt);
          }
        } else {
          toast.error(data.error || 'Failed to join event');
        }
      }
    } catch (error) {
      console.error('Error joining event:', error);
      toast.error('Failed to join event');
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !circle) return;
    
    try {
      const response = await fetch(`/api/community/circles/${slug}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail })
      });
      
      if (response.ok) {
        toast.success('Invitation sent successfully!');
        setInviteEmail('');
        setShowInvite(false);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Failed to send invitation');
    }
  };

  // Quiz functions
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('/api/community/quizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        console.error('Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchQuizUsage = async () => {
    try {
      const response = await fetch('/api/community/quizzes/usage');
      if (response.ok) {
        const data = await response.json();
        setQuizUsage(data);
      } else {
        console.error('Failed to fetch quiz usage');
      }
    } catch (error) {
      console.error('Error fetching quiz usage:', error);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/community/quizzes/${quizId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentQuiz(quizzes.find(q => q.id === quizId));
        setQuizAttempt(data.attempt);
        setQuizQuestions(data.questions);
        setQuizRestrictions(data.restrictions);
        setShowQuiz(true);
      } else {
        const error = await response.json();
        if (error.requiresUpgrade) {
          toast.error(error.error);
          // You could show an upgrade modal here
        } else {
          toast.error(error.error || 'Failed to start quiz');
        }
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    }
  };

  const handleQuizComplete = (results: any) => {
    toast.success(`Quiz completed! Score: ${results.summary.percentage}%`);
    setShowQuiz(false);
    fetchQuizUsage(); // Refresh usage stats
  };

  const handleQuizExit = () => {
    setShowQuiz(false);
    setCurrentQuiz(null);
    setQuizAttempt(null);
    setQuizQuestions([]);
    setQuizRestrictions(null);
  };

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'en': '🇺🇸', 'fr': '🇫🇷', 'es': '🇪🇸', 'de': '🇩🇪', 'it': '🇮🇹',
      'pt': '🇵🇹', 'ru': '🇷🇺', 'zh': '🇨🇳', 'ja': '🇯🇵', 'ko': '🇰🇷'
    };
    return flags[language] || '🌍';
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Beginner': 'bg-green-100 text-green-800',
      'Intermediate': 'bg-blue-100 text-blue-800',
      'Advanced': 'bg-purple-100 text-purple-800',
      'All Levels': 'bg-gray-100 text-gray-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Generate random color for avatar backgrounds
  const getRandomAvatarColor = (name: string) => {
    const colors = [
      'bg-red-100 text-red-700',
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
      'bg-teal-100 text-teal-700',
      'bg-orange-100 text-orange-700',
      'bg-cyan-100 text-cyan-700',
      'bg-emerald-100 text-emerald-700',
      'bg-violet-100 text-violet-700'
    ];
    
    // Use the name to generate a consistent color for the same user
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Circle not found</h2>
          <Button onClick={() => router.push('/community/circles')}>
            Back to Circles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-spin"></div>
      </div>

      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        {/* Animated Sparkles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 animate-ping">
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>
          <div className="absolute top-20 right-1/3 animate-ping delay-300">
            <Sparkles className="h-4 w-4 text-pink-300" />
          </div>
          <div className="absolute bottom-10 left-1/2 animate-ping delay-700">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
        </div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/community/circles">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Circles
                </Button>
              </Link>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {circle.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl animate-bounce">{getLanguageFlag(circle.language)}</span>
                    <Badge className={`${getLevelColor(circle.level)} animate-pulse`}>
                      {circle.level}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Users className="h-4 w-4 text-blue-200" />
                    <span className="font-medium">{circle.membersCount} members</span>
                    {circle.maxMembers && (
                      <span className="text-blue-200">/ {circle.maxMembers}</span>
                    )}
                  </div>
                  {!circle.isPublic && (
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-200 border-yellow-300 animate-pulse">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1 text-yellow-300">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">Active Community</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {circle.isOwner && (
                <Button variant="outline" size="sm" className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-300 text-yellow-200 hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300 hover:scale-105">
                  <Crown className="h-4 w-4 mr-2" />
                  Owner
                </Button>
              )}
              {circle.isMember ? (
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-red-500/20 border-red-300 text-red-200 hover:bg-red-500/30 transition-all duration-300 hover:scale-105"
                    onClick={handleLeaveCircle}
                  >
                    Leave Circle
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={handleJoinCircle}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Circle
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Fun Stats Banner */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{circle.membersCount}</span>
              </div>
              <p className="text-sm opacity-90">Active Members</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageCircle className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{posts.length}</span>
              </div>
              <p className="text-sm opacity-90">Discussions</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{events.length}</span>
              </div>
              <p className="text-sm opacity-90">Upcoming Events</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 mr-2" />
                <span className="text-2xl font-bold">{Math.floor(Math.random() * 50) + 10}</span>
              </div>
              <p className="text-sm opacity-90">Achievements</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-xl shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
              <Globe className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="discussions" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
              <MessageCircle className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
              <Target className="h-4 w-4 mr-2" />
              Practice Quizzes
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            {circle.isOwner && (
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circle Info */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-white to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5" />
                        <span>About this Circle</span>
                      </div>
                      {circle.isOwner && (
                        <Button variant="outline" size="sm" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 text-lg leading-relaxed">
                          {circle.description || 'No description available.'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-800">Created</span>
                        </div>
                        <p className="text-green-700">{new Date(circle.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Crown className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold text-purple-800">Owner</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={circle.owner.image} />
                            <AvatarFallback className={getRandomAvatarColor(circle.owner.name)}>
                              {circle.owner.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-purple-700 font-medium">{circle.owner.name}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="mt-6 bg-gradient-to-br from-white to-orange-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {posts.slice(0, 3).map((post, index) => (
                        <div key={post.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200 hover:shadow-md transition-all duration-300 hover:scale-105">
                          <div className="relative">
                            <Avatar className="h-10 w-10 ring-2 ring-orange-200">
                              <AvatarImage src={post.author.image} />
                              <AvatarFallback className={getRandomAvatarColor(post.author.name)}>
                                {post.author.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-orange-800">{post.author.name}</span>
                              <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-orange-700 line-clamp-2 leading-relaxed">{post.content}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 transition-colors">
                                <Heart className="h-3 w-3" />
                                <span className="text-xs">{post.likes}</span>
                              </button>
                              <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-800 transition-colors">
                                <MessageCircle className="h-3 w-3" />
                                <span className="text-xs">{post.comments}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {posts.length === 0 && (
                        <div className="text-center py-8">
                          <div className="p-4 bg-orange-100 rounded-full w-fit mx-auto mb-4">
                            <MessageCircle className="h-8 w-8 text-orange-600" />
                          </div>
                          <p className="text-orange-700 font-medium mb-2">No recent activity</p>
                          <p className="text-orange-600 text-sm">Start the conversation!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-white to-green-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {circle.isMember && (
                      <>
                        <Button 
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg" 
                          onClick={() => setActiveTab('discussions')}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Start Discussion
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 transition-all duration-300 hover:scale-105" 
                          onClick={() => setActiveTab('events')}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Event
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 transition-all duration-300 hover:scale-105" 
                          onClick={() => setShowInvite(true)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Friends
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 transition-all duration-300 hover:scale-105"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Circle
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="bg-gradient-to-br from-white to-purple-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center space-x-2">
                      <PartyPopper className="h-5 w-5" />
                      <span>Upcoming Events</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {events.slice(0, 3).map((event, index) => (
                        <div key={event.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300 hover:scale-105">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-purple-800">{event.title}</h4>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-purple-600" />
                              <span className="text-xs text-purple-600 font-medium">{event.date}</span>
                            </div>
                          </div>
                          <p className="text-xs text-purple-700 mb-2">{event.time}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-purple-600" />
                              <span className="text-xs text-purple-600">{event.attendees} attending</span>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {events.length === 0 && (
                        <div className="text-center py-6">
                          <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                            <Calendar className="h-6 w-6 text-purple-600" />
                          </div>
                          <p className="text-purple-600 font-medium">No upcoming events</p>
                          <p className="text-purple-500 text-sm">Be the first to schedule one!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                {circle.isMember ? (
                  <div className="mb-6">
                    <Textarea
                      placeholder="Share your thoughts, ask questions, or start a discussion..."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="mb-3"
                      rows={3}
                    />
                    <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Post Discussion
                    </Button>
                  </div>
                ) : !session?.user ? (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-blue-800 font-medium">Join the discussion!</p>
                        <p className="text-blue-600 text-sm">Sign in to contribute to this community discussion.</p>
                      </div>
                      <Button 
                        onClick={() => {
                          localStorage.setItem('pendingDiscussionAction', JSON.stringify({
                            action: 'discussion',
                            circleSlug: slug,
                            returnUrl: `/community/circles/${slug}`
                          }));
                          router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/community/circles/${slug}`)}`);
                        }}
                        size="sm"
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-amber-600" />
                      <div className="flex-1">
                        <p className="text-amber-800 font-medium">Join this circle to participate</p>
                        <p className="text-amber-600 text-sm">You need to be a member to contribute to discussions.</p>
                      </div>
                      <Button 
                        onClick={handleJoinCircle}
                        size="sm"
                        variant="outline"
                      >
                        Join Circle
                      </Button>
                    </div>
                  </div>
                )}

                <div className="h-[600px] overflow-y-auto">
                  <ThreadedDiscussion
                    posts={posts}
                    onSendPost={handleCreatePost}
                    onLikePost={handleLikePost}
                    currentUserId={session?.user?.id}
                    isLoading={false}
                    isAuthenticated={!!session?.user}
                    onRequireAuth={() => {
                      // Store the current context for after login
                      localStorage.setItem('pendingDiscussionAction', JSON.stringify({
                        action: 'discussion',
                        circleSlug: slug,
                        returnUrl: `/community/circles/${slug}`
                      }));
                      // Redirect to sign in page
                      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/community/circles/${slug}`)}`);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Events</CardTitle>
                  {circle.isMember && (
                    <Button onClick={() => setShowCreateEvent(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className={
                            event.type === 'live-class' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''
                          }>
                            {event.type === 'live-class' ? '🎥 Live Class' : event.type}
                          </Badge>
                          <span className="text-sm text-gray-500">{event.date}</span>
                        </div>
                        <h4 className="font-medium mb-2">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        
                        {/* Live Class specific information */}
                        {event.type === 'live-class' && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm font-medium text-blue-800">Video Platform:</span>
                              <span className="text-sm text-blue-600 capitalize">{event.videoPlatform || 'Not specified'}</span>
                            </div>
                            {event.meetingLink && (
                              <div className="mb-2">
                                <a 
                                  href={event.meetingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                                >
                                  🔗 Join Meeting
                                </a>
                              </div>
                            )}
                            {event.difficulty && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-blue-800">Level:</span>
                                <Badge variant="outline" className="text-xs">
                                  {event.difficulty}
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{event.time} ({event.duration}min)</span>
                          <span className="text-blue-600">{event.attendees} attending</span>
                        </div>
                        <Button 
                          className="w-full mt-3" 
                          size="sm"
                          onClick={() => handleJoinEvent(event.id)}
                        >
                          {event.type === 'live-class' ? 'Join Live Class' : 'Join Event'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  {events.length === 0 && (
                    <p className="text-gray-500 text-center py-8 col-span-full">
                      No events scheduled. Create the first one!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            {showQuiz ? (
              <CommunityQuizInterface
                quizId={currentQuiz.id}
                attempt={quizAttempt}
                questions={quizQuestions}
                restrictions={quizRestrictions}
                onComplete={handleQuizComplete}
                onExit={handleQuizExit}
              />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Practice Quizzes</CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">
                        {quizUsage.monthlyUsage}/1 free this month
                      </Badge>
                      <div className="text-sm text-gray-600">
                        Total attempts: {quizUsage.totalAttempts}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                      <CommunityQuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onStartQuiz={handleStartQuiz}
                        monthlyUsage={quizUsage.monthlyUsage}
                      />
                    ))}
                  </div>
                  {quizzes.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No quizzes available at the moment.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Members ({members.length})</CardTitle>
                  {circle.isMember && (
                    <Button onClick={() => setShowInvite(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite Members
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.image} />
                        <AvatarFallback className={getRandomAvatarColor(member.name)}>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{member.name}</span>
                          {member.role === 'owner' && <Crown className="h-4 w-4 text-yellow-500" />}
                          {member.role === 'moderator' && <Shield className="h-4 w-4 text-blue-500" />}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                          {member.isOnline && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Online</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab (Owner Only) */}
          {circle.isOwner && (
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Circle Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Circle Name</label>
                      <Input defaultValue={circle.name} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <Input defaultValue={circle.language} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Level</label>
                      <Input defaultValue={circle.level} className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Max Members</label>
                      <Input defaultValue={circle.maxMembers || ''} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea defaultValue={circle.description} className="mt-1" rows={3} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      defaultChecked={circle.isPublic}
                      className="rounded"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium">
                      Public Circle (visible to everyone)
                    </label>
                  </div>
                  <div className="flex space-x-3">
                    <Button>Save Changes</Button>
                    <Button variant="outline">Cancel</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <h4 className="font-medium text-red-800">Delete Circle</h4>
                      <p className="text-sm text-red-600 mt-1">
                        This action cannot be undone. All members will be removed and all content will be permanently deleted.
                      </p>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Circle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Event Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="study-session">Study Session</option>
                <option value="conversation">Conversation Practice</option>
                <option value="workshop">Workshop</option>
                <option value="social">Social Event</option>
                <option value="live-class">🎥 Live Class</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Event Title</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder={newEvent.type === 'live-class' ? "e.g., Spanish Conversation Live Class" : "e.g., Spanish Conversation Practice"}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the event..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  max={newEvent.type === 'live-class' ? 30 : 120}
                  min={15}
                />
                {newEvent.type === 'live-class' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Free users: max 30 minutes. Premium: 60 minutes. Pro: 120 minutes
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Max Attendees</label>
                <Input
                  type="number"
                  value={newEvent.maxAttendees}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
                  max={newEvent.type === 'live-class' ? 20 : 50}
                  min={1}
                />
                {newEvent.type === 'live-class' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Free users: max 20 attendees. Premium: 10 attendees. Pro: 5 attendees
                  </p>
                )}
              </div>
            </div>

            {/* Live Class specific fields */}
            {newEvent.type === 'live-class' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900">Live Class Settings</h4>
                
                <div>
                  <label className="text-sm font-medium text-blue-800">Video Platform</label>
                  <select
                    value={newEvent.videoPlatform}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, videoPlatform: e.target.value as any }))}
                    className="w-full p-2 border border-blue-300 rounded-md bg-white"
                  >
                    <option value="zoom">Zoom</option>
                    <option value="google-meet">Google Meet</option>
                    <option value="teams">Microsoft Teams</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-blue-800">Meeting Link</label>
                  <Input
                    value={newEvent.meetingLink}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, meetingLink: e.target.value }))}
                    placeholder="https://zoom.us/j/..."
                    className="border-blue-300"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-blue-800">Difficulty Level</label>
                    <select
                      value={newEvent.difficulty}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, difficulty: e.target.value as any }))}
                      className="w-full p-2 border border-blue-300 rounded-md bg-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-800">Language</label>
                    <Input
                      value={newEvent.language}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, language: e.target.value }))}
                      placeholder="e.g., Spanish"
                      className="border-blue-300"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recordingEnabled"
                    checked={newEvent.recordingEnabled}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, recordingEnabled: e.target.checked }))}
                    className="rounded border-blue-300"
                  />
                  <label htmlFor="recordingEnabled" className="text-sm text-blue-800">
                    Enable recording (Premium/Pro only)
                  </label>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-blue-800">Materials/Notes</label>
                  <Textarea
                    value={newEvent.materials}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, materials: e.target.value }))}
                    placeholder="Share any materials or notes for participants..."
                    rows={2}
                    className="border-blue-300"
                  />
                </div>
              </div>
            )}

            {/* Freemium restrictions notice */}
            {newEvent.type === 'live-class' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="p-1 bg-amber-100 rounded">
                    <span className="text-amber-600 text-sm">ℹ️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">Live Class Access</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Free users: 1 session/month, 30min max, large groups. 
                                              <button 
                          onClick={(e) => {
                            e.preventDefault();
                            router.push('/subscription-signup?type=student&plan=PREMIUM');
                          }}
                          className="text-amber-600 underline ml-1 hover:text-amber-800"
                        >
                          Upgrade to Premium
                        </button> for unlimited sessions and better features!
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent}>
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invite Members Dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowInvite(false)}>
                Cancel
              </Button>
              <Button onClick={handleInviteMember}>
                Send Invitation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subscription Reminder Dialog */}
      <Dialog open={showSubscriptionReminder} onOpenChange={setShowSubscriptionReminder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              Welcome to {joinedCircleName}!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                You've successfully joined the circle! 🎉
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Unlock Premium Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Create unlimited study circles</li>
                  <li>• Access advanced analytics and insights</li>
                  <li>• Priority support and early access to features</li>
                  <li>• Ad-free experience across all features</li>
                  <li>• Exclusive premium study materials</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSubscriptionReminder(false)}>
                Maybe Later
              </Button>
              <Button 
                onClick={() => {
                  setShowSubscriptionReminder(false);
                  router.push('/pricing');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                View Plans
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

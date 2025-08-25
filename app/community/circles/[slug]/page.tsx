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
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

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
  comments: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  type: 'study-session' | 'conversation' | 'workshop' | 'social';
  attendees: number;
  maxAttendees?: number;
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
    maxAttendees: 10
  });
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showSubscriptionReminder, setShowSubscriptionReminder] = useState(false);
  const [joinedCircleName, setJoinedCircleName] = useState('');

  useEffect(() => {
    if (slug) {
      fetchCircleDetails();
    }
  }, [slug]);

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

  const fetchCircleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/community/circles/${slug}`);
      const data = await response.json();
      
      if (response.ok) {
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

  const handleCreatePost = async () => {
    if (!newPost.trim() || !circle) return;
    
    try {
      const response = await fetch(`/api/community/circles/${slug}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost })
      });
      
      if (response.ok) {
        toast.success('Post created successfully!');
        setNewPost('');
        fetchCircleDetails(); // Refresh posts
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
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
          maxAttendees: 10
        });
        fetchCircleDetails(); // Refresh events
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/community/circles">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Circles
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{circle.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getLanguageFlag(circle.language)}</span>
                    <Badge className={getLevelColor(circle.level)}>
                      {circle.level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{circle.membersCount} members</span>
                    {circle.maxMembers && (
                      <span className="text-blue-200">/ {circle.maxMembers}</span>
                    )}
                  </div>
                  {!circle.isPublic && (
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-200 border-yellow-300">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {circle.isOwner && (
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Crown className="h-4 w-4 mr-2" />
                  Owner
                </Button>
              )}
              {circle.isMember ? (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-red-500/20 border-red-300 text-red-200 hover:bg-red-500/30"
                    onClick={handleLeaveCircle}
                  >
                    Leave Circle
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
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

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {circle.isOwner && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Circle Info */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>About this Circle</span>
                      {circle.isOwner && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {circle.description || 'No description available.'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Created:</span>
                        <p className="text-gray-600">{new Date(circle.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Owner:</span>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={circle.owner.image} />
                            <AvatarFallback>{circle.owner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-gray-600">{circle.owner.name}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {posts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author.image} />
                            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{post.author.name}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                          </div>
                        </div>
                      ))}
                      {posts.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {circle.isMember && (
                      <>
                        <Button className="w-full" onClick={() => setActiveTab('discussions')}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Start Discussion
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setActiveTab('events')}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Event
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setShowInvite(true)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Invite Friends
                        </Button>
                      </>
                    )}
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Circle
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {events.slice(0, 3).map((event) => (
                        <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <p className="text-xs text-gray-600">{event.date} at {event.time}</p>
                          <p className="text-xs text-gray-600">{event.attendees} attending</p>
                        </div>
                      ))}
                      {events.length === 0 && (
                        <p className="text-gray-500 text-center py-2">No upcoming events</p>
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
                {circle.isMember && (
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
                )}

                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.image} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{post.author.name}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-blue-600">
                              <Star className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-blue-600">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No discussions yet. Be the first to start one!</p>
                  )}
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
                          <Badge variant="outline">{event.type}</Badge>
                          <span className="text-sm text-gray-500">{event.date}</span>
                        </div>
                        <h4 className="font-medium mb-2">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{event.time} ({event.duration}min)</span>
                          <span className="text-blue-600">{event.attendees} attending</span>
                        </div>
                        <Button className="w-full mt-3" size="sm">
                          Join Event
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
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Event Title</label>
              <Input
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Spanish Conversation Practice"
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
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Attendees</label>
                <Input
                  type="number"
                  value={newEvent.maxAttendees}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, maxAttendees: parseInt(e.target.value) }))}
                />
              </div>
            </div>
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

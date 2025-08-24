'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ConnectionRequest {
  id: string;
  sender: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'BLOCKED';
  createdAt: string;
  respondedAt?: string;
}

export default function ConnectionRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchConnectionRequests();
    }
  }, [session?.user]);

  const fetchConnectionRequests = async () => {
    try {
      const response = await fetch('/api/connections/requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      } else {
        toast.error('Failed to load connection requests');
      }
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      toast.error('Failed to load connection requests');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const response = await fetch('/api/connections/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(action === 'accept' ? 'Connection request accepted!' : 'Connection request declined');
        
        // Update the local state
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: action === 'accept' ? 'ACCEPTED' : 'DECLINED', respondedAt: new Date().toISOString() }
            : req
        ));
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${action} connection request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing connection request:`, error);
      toast.error(`Failed to ${action} connection request`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'DECLINED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'DECLINED':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Declined</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-gray-600">You need to be signed in to view connection requests.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(req => req.status === 'PENDING');
  const otherRequests = requests.filter(req => req.status !== 'PENDING');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connection Requests</h1>
          <p className="text-gray-600">Manage your incoming and outgoing connection requests</p>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.sender.image} />
                        <AvatarFallback>
                          {request.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{request.sender.name}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        {request.message && (
                          <p className="text-gray-600 mb-4 italic">"{request.message}"</p>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          Sent {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleResponse(request.id, 'accept')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResponse(request.id, 'decline')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other Requests */}
        {otherRequests.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-600" />
              Other Requests ({otherRequests.length})
            </h2>
            <div className="grid gap-4">
              {otherRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.sender.image} />
                        <AvatarFallback>
                          {request.sender.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{request.sender.name}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        {request.message && (
                          <p className="text-gray-600 mb-4 italic">"{request.message}"</p>
                        )}
                        
                        <div className="flex items-center text-sm text-gray-500">
                          {getStatusIcon(request.status)}
                          <span className="ml-1">
                            {request.status === 'ACCEPTED' ? 'Accepted' : 'Declined'} on{' '}
                            {request.respondedAt 
                              ? new Date(request.respondedAt).toLocaleDateString()
                              : new Date(request.createdAt).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {requests.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No connection requests</h3>
              <p className="text-gray-600 mb-4">
                You don't have any connection requests yet. Start connecting with other learners!
              </p>
              <Button onClick={() => window.location.href = '/features/community-learning'}>
                Explore Community
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

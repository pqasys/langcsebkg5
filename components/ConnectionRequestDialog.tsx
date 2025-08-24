'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useConnectionAuth } from '@/hooks/useConnectionAuth';

interface ConnectionRequestDialogProps {
  targetUser: {
    id: string;
    name: string;
    image?: string;
    level?: string;
    location?: string;
  };
  trigger?: React.ReactNode;
}

export function ConnectionRequestDialog({ targetUser, trigger }: ConnectionRequestDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authenticateForConnection } = useConnectionAuth();

  const handleSendRequest = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authenticateForConnection(targetUser.id, message.trim());
      
      if (result.success) {
        // User is authenticated, send connection request
        const response = await fetch('/api/connections/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receiverId: targetUser.id,
            message: message.trim()
          }),
        });

        if (response.ok) {
          toast.success('Connection request sent!');
          setIsOpen(false);
          setMessage('');
        } else {
          const error = await response.json();
          toast.error(error.error || 'Failed to send connection request');
        }
      } else if (result.requiresAuth) {
        // User will be redirected to login
        toast.info('Please sign in to send connection requests');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast.error('Failed to send connection request');
    } finally {
      setIsLoading(false);
    }
  };

  const defaultMessage = `Hi ${targetUser.name}! I'd like to connect with you on FluentShip to practice languages together.`;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline" className="text-xs">
            <UserPlus className="h-3 w-3 mr-1" />
            Connect
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={targetUser.image} />
              <AvatarFallback>
                {targetUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">Send Connection Request</div>
              <div className="text-sm text-gray-500">to {targetUser.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-900">{targetUser.name}</div>
            {targetUser.level && (
              <div className="text-xs text-gray-600">Level: {targetUser.level}</div>
            )}
            {targetUser.location && (
              <div className="text-xs text-gray-600">{targetUser.location}</div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">
              Message (optional)
            </label>
            <Textarea
              placeholder={defaultMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Introduce yourself and explain why you'd like to connect
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

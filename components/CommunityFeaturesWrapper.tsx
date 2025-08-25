'use client'

import { useConnectionAuth } from '@/hooks/useConnectionAuth'
import { ConnectionRequestDialog } from '@/components/ConnectionRequestDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Users, MapPin, Languages, UserPlus, Search } from 'lucide-react'

interface VisibleProfile {
  id: string;
  name: string;
  avatar: string;
  location: string;
  languages: string[];
  level: string;
  interests: string[];
  isOnline: boolean;
  lastActive: string;
  mutualConnections: number;
  achievements: number;
}

interface CommunityFeaturesWrapperProps {
  visibleProfiles: VisibleProfile[];
}

export function CommunityFeaturesWrapper({ visibleProfiles }: CommunityFeaturesWrapperProps) {
  const { authenticateForConnection, executePendingConnection, pendingConnectionRequest } = useConnectionAuth()

  return (
    <div className="lg:col-span-1">
      <div>
        <div className="mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 rounded-lg p-6">
          <div className="pb-4">
            <div className="flex items-center text-lg font-bold text-gray-800">
              <Users className="h-6 w-6 mr-3 text-blue-600" />
              Community Members
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-6 font-medium">
              Connect with language learners who have opted to make their profiles public
            </p>
            
            <div className="space-y-3">
              {visibleProfiles.map((profile) => (
                <div key={profile.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 bg-gray-50/50">
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {profile.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-sm"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {profile.name}
                      </h4>
                      <Badge variant="secondary" className="text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {profile.level}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-600 mb-1">
                      <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                      {profile.location}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-600 mb-3">
                      <Languages className="h-3 w-3 mr-1 text-green-500" />
                      <span className="font-medium">{profile.languages.slice(0, 2).join(', ')}</span>
                      {profile.languages.length > 2 && <span className="text-gray-500"> +{profile.languages.length - 2}</span>}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-600">
                        <Users className="h-3 w-3 mr-1 text-purple-500" />
                        <span className="font-medium">{profile.mutualConnections} mutual</span>
                      </div>
                      <ConnectionRequestDialog
                        targetUser={{
                          id: profile.id,
                          name: profile.name,
                          level: profile.level,
                          location: profile.location
                        }}
                        trigger={
                          <Button 
                            size="sm" 
                            variant="default"
                            className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Connect
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-medium"
                onClick={() => window.location.href = '/features/community-learning'}
              >
                <Search className="h-4 w-4 mr-2" />
                Browse All Members
              </Button>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

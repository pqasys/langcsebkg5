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
  isRealUser?: boolean;
  isPlaceholder?: boolean;
}

interface CommunityFeaturesWrapperProps {
  visibleProfiles: VisibleProfile[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function CommunityFeaturesWrapper({ visibleProfiles, onRefresh, isLoading }: CommunityFeaturesWrapperProps) {
  const { authenticateForConnection, executePendingConnection, pendingConnectionRequest } = useConnectionAuth()

  return (
    <div className="lg:col-span-1">
      <div>
        <div className="mb-6 shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 rounded-lg p-6">
          <div className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-lg font-bold text-gray-800">
                <Users className="h-6 w-6 mr-3 text-blue-600" />
                Community Members
              </div>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isLoading}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh community members"
                >
                  <svg 
                    className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-700 mb-6 font-medium">
              Connect with language learners who have opted to make their profiles public
            </p>
            
            <div className="space-y-3">
              {visibleProfiles.map((profile) => (
                <div key={profile.id} className={`flex items-start space-x-3 p-4 border rounded-xl transition-all duration-200 ${
                  profile.isPlaceholder 
                    ? 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50' 
                    : 'border-blue-200 bg-blue-50/50 hover:bg-white hover:shadow-md'
                }`}>
                  <div className="relative">
                    <Avatar className={`h-12 w-12 ring-2 ${
                      profile.isPlaceholder ? 'ring-gray-200' : 'ring-blue-100'
                    }`}>
                      <AvatarImage src={profile.avatar} />
                      <AvatarFallback className={`font-semibold ${
                        profile.isPlaceholder 
                          ? 'bg-gray-200 text-gray-600' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {profile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {profile.isOnline && !profile.isPlaceholder && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-sm"></div>
                    )}
                    {profile.isPlaceholder && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 border-3 border-white rounded-full shadow-sm"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">
                        {profile.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className={`text-xs font-medium ${
                          profile.isPlaceholder 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}>
                          {profile.level}
                        </Badge>
                        {profile.isPlaceholder && (
                          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            Demo
                          </Badge>
                        )}
                        {profile.isRealUser && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                            Live
                          </Badge>
                        )}
                      </div>
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
                      {profile.isRealUser ? (
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
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-7 px-3 text-xs border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100"
                          disabled
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Demo
                        </Button>
                      )}
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

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Loader2, UserCircle2, Settings as SettingsIcon, Bell, CreditCard, Lock, Camera, User, Mail, Trash2, Globe, Users, Eye, EyeOff, UserCheck, FileImage, Upload } from 'lucide-react';
import NotificationPreferences from '@/app/components/student/NotificationPreferences';
import { StudentSubscriptionCard } from '@/components/StudentSubscriptionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PasswordInput } from "@/components/ui/password-input";
import LanguageProficiencyManager from '@/components/student/LanguageProficiencyManager';
import SocialLinksManager from '@/components/student/SocialLinksManager';
import { LANGUAGES } from '@/lib/data/languages';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  profilePicture?: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  native_language?: string;
  spoken_languages?: any;
  learning_goals?: string;
  interests?: any;
  social_visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
  timezone?: string;
  date_of_birth?: string;
  gender?: string;
  location?: string;
  website?: string;
  social_links?: any;
}

function getInitials(name: string) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[parts.length - 1][0];
}

export default function StudentSettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [removingPicture, setRemovingPicture] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/student/profile');
      if (!response.ok) {
        throw new Error(`Failed to fetch profile - Context: throw new Error('Failed to fetch profile');...`);
      }
      const data = await response.json();
      setProfile(data);
      if (data.profilePicture) {
        setPreviewUrl(data.profilePicture);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load profile. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          bio: profile.bio,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      
      // Update session data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: updatedProfile.name,
          email: updatedProfile.email,
        },
      });

      toast.success('Profile updated successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to updating profile. Please try again or contact support if the problem persists.');
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/student/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update password`);
      }

      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Failed to update password. Please try again or contact support if the problem persists.');
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPicture = async () => {
    if (!selectedFile) return;

    try {
      setUploadingPicture(true);
      const formData = new FormData();
      formData.append('profilePicture', selectedFile);

      const response = await fetch('/api/student/profile/picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const data = await response.json();
      setPreviewUrl(data.imageUrl);
      setSelectedFile(null);
      
      // Update session with new image
      await update({
        ...session,
        user: {
          ...session?.user,
          image: data.imageUrl,
        },
      });

      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleRemovePicture = async () => {
    try {
      setRemovingPicture(true);
      const response = await fetch('/api/student/profile/picture', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove profile picture');
      }

      setPreviewUrl('');
      setSelectedFile(null);
      
      // Update session to remove image
      await update({
        ...session,
        user: {
          ...session?.user,
          image: null,
        },
      });

      toast.success('Profile picture removed successfully');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setRemovingPicture(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-primary/10 rounded-full p-2 sm:p-3">
          <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Manage your profile and notification preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
          <TabsTrigger value="profile" className="text-xs sm:text-sm h-8 sm:h-10">
            <UserCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs sm:text-sm h-8 sm:h-10">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Social</span>
            <span className="sm:hidden">Social</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm h-8 sm:h-10">
            <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Notif</span>
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-xs sm:text-sm h-8 sm:h-10">
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Subscription</span>
            <span className="sm:hidden">Sub</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Profile Picture */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Profile Picture</Label>
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                      <div className="relative group">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-2">
                              <User className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500 hidden sm:block">No photo</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Upload overlay */}
                        <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label
                            htmlFor="profilePicture"
                            className="cursor-pointer text-white hover:text-primary-foreground transition-colors"
                          >
                            <div className="text-center">
                              <Camera className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1" />
                              <span className="text-xs font-medium">Change Photo</span>
                            </div>
                            <input
                              type="file"
                              id="profilePicture"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                        
                        {/* Camera icon for mobile */}
                        <label
                          htmlFor="profilePicture"
                          className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg sm:hidden"
                        >
                          <Camera className="w-4 h-4" />
                          <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            Upload a profile picture to personalize your account. 
                            <br className="hidden sm:block" />
                            <span className="text-xs text-gray-500">
                              Supported formats: JPG, PNG, GIF (max 5MB)
                            </span>
                          </p>
                          
                          {/* Upload button for selected file */}
                          {selectedFile && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                                <FileImage className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-800 flex-1 truncate">
                                  {selectedFile.name}
                                </span>
                                <span className="text-xs text-blue-600">
                                  {(selectedFile.size / 1024 / 1024).toFixed(1)}MB
                                </span>
                              </div>
                              <Button
                                onClick={handleUploadPicture}
                                disabled={uploadingPicture}
                                className="w-full sm:w-auto"
                              >
                                {uploadingPicture ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Picture
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                          
                          {/* Remove button for existing picture */}
                          {previewUrl && !selectedFile && (
                            <Button
                              onClick={handleRemovePicture}
                              disabled={removingPicture}
                              variant="outline"
                              className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              {removingPicture ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Removing...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Picture
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <Input
                          id="name"
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="h-10 sm:h-11"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className="h-10 sm:h-11 bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="mt-1 h-10 sm:h-11"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                      <Input
                        id="address"
                        type="text"
                        value={profile.address || ''}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        className="mt-1 h-10 sm:h-11"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="mt-1 min-h-[80px] sm:min-h-[100px]"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="w-full sm:w-auto h-10 sm:h-11"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Password Update */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Update Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 sm:space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <PasswordInput
                        id="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <PasswordInput
                        id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <PasswordInput
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="h-10 sm:h-11"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="w-full sm:w-auto h-10 sm:h-11"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="animate-spin mr-2" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social">
          <div className="space-y-4 sm:space-y-6">
            {/* Language Proficiency */}
            <LanguageProficiencyManager
              value={profile.spoken_languages || []}
              onChange={(languages) => setProfile({ ...profile, spoken_languages: languages })}
              disabled={saving}
            />

            {/* Social Links */}
            <SocialLinksManager
              value={profile.social_links || []}
              onChange={(links) => setProfile({ ...profile, social_links: links })}
              disabled={saving}
            />

            {/* Additional Social Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <Label htmlFor="native_language" className="text-sm font-medium">Native Language</Label>
                    <Select 
                      value={profile.native_language || ''} 
                      onValueChange={(value) => setProfile({ ...profile, native_language: value })}
                    >
                      <SelectTrigger className="mt-1 h-10 sm:h-11">
                        <SelectValue placeholder="Select your native language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((language) => (
                          <SelectItem key={language.code} value={language.code}>
                            <div className="flex items-center gap-2">
                              <span>{language.flag}</span>
                              <span>{language.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      className="mt-1 h-10 sm:h-11"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-sm font-medium">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.website || ''}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="mt-1 h-10 sm:h-11"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                    <Select 
                      value={profile.gender || ''} 
                      onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    >
                      <SelectTrigger className="mt-1 h-10 sm:h-11">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date_of_birth" className="text-sm font-medium">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={profile.date_of_birth || ''}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      className="mt-1 h-10 sm:h-11"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone" className="text-sm font-medium">Timezone</Label>
                    <Select 
                      value={profile.timezone || ''} 
                      onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                    >
                      <SelectTrigger className="mt-1 h-10 sm:h-11">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                        <SelectItem value="UTC-7">UTC-7 (MST)</SelectItem>
                        <SelectItem value="UTC-6">UTC-6 (CST)</SelectItem>
                        <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                        <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                        <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                        <SelectItem value="UTC+2">UTC+2 (EET)</SelectItem>
                        <SelectItem value="UTC+3">UTC+3 (MSK)</SelectItem>
                        <SelectItem value="UTC+5:30">UTC+5:30 (IST)</SelectItem>
                        <SelectItem value="UTC+8">UTC+8 (CST)</SelectItem>
                        <SelectItem value="UTC+9">UTC+9 (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6">
                  <Label htmlFor="learning_goals" className="text-sm font-medium">Learning Goals</Label>
                  <Textarea
                    id="learning_goals"
                    value={profile.learning_goals || ''}
                    onChange={(e) => setProfile({ ...profile, learning_goals: e.target.value })}
                    className="mt-1 min-h-[80px] sm:min-h-[100px]"
                    placeholder="What are your language learning goals? (e.g., 'I want to become fluent in Spanish for work' or 'I'm learning French to travel')"
                  />
                </div>

                <div className="mt-4 sm:mt-6">
                  <Label htmlFor="interests" className="text-sm font-medium">Interests & Hobbies</Label>
                  <Textarea
                    id="interests"
                    value={profile.interests || ''}
                    onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                    className="mt-1 min-h-[80px] sm:min-h-[100px]"
                    placeholder="Share your interests and hobbies (e.g., 'Reading, hiking, cooking, photography')"
                  />
                </div>

                <div className="mt-4 sm:mt-6">
                  <Label htmlFor="social_visibility" className="text-sm font-medium">Profile Visibility</Label>
                  <Select 
                    value={profile.social_visibility || 'PRIVATE'} 
                    onValueChange={(value: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY') => setProfile({ ...profile, social_visibility: value })}
                  >
                    <SelectTrigger className="mt-1 h-10 sm:h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          <span>Public - Anyone can see your profile</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="FRIENDS_ONLY">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4" />
                          <span>Friends Only - Only connected users can see</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PRIVATE">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4" />
                          <span>Private - Only you can see your profile</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Control who can see your profile information and connect with you
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationPreferences />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <StudentSubscriptionCard />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
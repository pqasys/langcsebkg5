'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Validation schema
const notificationPreferencesSchema = z.object({
  // General notification channels
  email_notifications: z.boolean(),
  push_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  
  // Course-related notifications
  course_updates: z.boolean(),
  course_reminders: z.boolean(),
  course_announcements: z.boolean(),
  course_schedule: z.boolean(),
  
  // Assignment-related notifications
  assignment_reminders: z.boolean(),
  assignment_deadlines: z.boolean(),
  assignment_feedback: z.boolean(),
  assignment_grades: z.boolean(),
  
  // Payment-related notifications
  payment_reminders: z.boolean(),
  payment_confirmation: z.boolean(),
  payment_receipts: z.boolean(),
  payment_failed: z.boolean(),
  
  // Progress-related notifications
  progress_updates: z.boolean(),
  achievement_alerts: z.boolean(),
  milestone_reached: z.boolean(),
  
  // Communication preferences
  instructor_messages: z.boolean(),
  group_messages: z.boolean(),
  system_announcements: z.boolean(),
  
  // Frequency preferences
  notification_frequency: z.enum(['DAILY', 'WEEKLY', 'INSTANT']),
});

type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;

export default function NotificationPreferences() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<NotificationPreferences>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      course_updates: true,
      course_reminders: true,
      course_announcements: true,
      course_schedule: true,
      assignment_reminders: true,
      assignment_deadlines: true,
      assignment_feedback: true,
      assignment_grades: true,
      payment_reminders: true,
      payment_confirmation: true,
      payment_receipts: true,
      payment_failed: true,
      progress_updates: true,
      achievement_alerts: true,
      milestone_reached: true,
      instructor_messages: true,
      group_messages: true,
      system_announcements: true,
      notification_frequency: 'DAILY',
    },
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/student/notifications');
      if (!response.ok) {
        if (response.status === 404) {
          // Preferences don't exist yet, that's okay
          return;
        }
        throw new Error(`Failed to fetch preferences - Context: throw new Error('Failed to fetch preferences');...`);
      }
      const data = await response.json();
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof NotificationPreferences, value);
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load notification preferences');
      toast.error(`Failed to load preferences:. Please try again or contact support if the problem persists.`));
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: NotificationPreferences) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/student/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to save preferences - Context: body: JSON.stringify(data),...`);
      }

      toast.success('Notification preferences saved successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to save notification preferences');
      toast.error(`Failed to saving preferences:. Please try again or contact support if the problem persists.`));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* General Notification Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">General Notification Channels</h3>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Label htmlFor="email_notifications" className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">Email Notifications</Label>
                <Switch
                  id="email_notifications"
                  checked={watch('email_notifications')}
                  onCheckedChange={(checked) => setValue('email_notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Label htmlFor="push_notifications" className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">Push Notifications</Label>
                <Switch
                  id="push_notifications"
                  checked={watch('push_notifications')}
                  onCheckedChange={(checked) => setValue('push_notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <Label htmlFor="sms_notifications" className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">SMS Notifications</Label>
                <Switch
                  id="sms_notifications"
                  checked={watch('sms_notifications')}
                  onCheckedChange={(checked) => setValue('sms_notifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Course-related Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Course Notifications</h3>
            <div className="grid gap-4">
              {['course_updates', 'course_reminders', 'course_announcements', 'course_schedule'].map((pref) => (
                <div key={pref} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Label htmlFor={pref} className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">{pref.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
                  <Switch
                    id={pref}
                    checked={watch(pref as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => setValue(pref as keyof NotificationPreferences, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Assignment-related Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Assignment Notifications</h3>
            <div className="grid gap-4">
              {['assignment_reminders', 'assignment_deadlines', 'assignment_feedback', 'assignment_grades'].map((pref) => (
                <div key={pref} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Label htmlFor={pref} className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">{pref.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
                  <Switch
                    id={pref}
                    checked={watch(pref as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => setValue(pref as keyof NotificationPreferences, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment-related Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Notifications</h3>
            <div className="grid gap-4">
              {['payment_reminders', 'payment_confirmation', 'payment_receipts', 'payment_failed'].map((pref) => (
                <div key={pref} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Label htmlFor={pref} className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">{pref.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
                  <Switch
                    id={pref}
                    checked={watch(pref as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => setValue(pref as keyof NotificationPreferences, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Progress-related Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Progress Notifications</h3>
            <div className="grid gap-4">
              {['progress_updates', 'achievement_alerts', 'milestone_reached'].map((pref) => (
                <div key={pref} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Label htmlFor={pref} className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">{pref.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
                  <Switch
                    id={pref}
                    checked={watch(pref as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => setValue(pref as keyof NotificationPreferences, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Communication Preferences</h3>
            <div className="grid gap-4">
              {['instructor_messages', 'group_messages', 'system_announcements'].map((pref) => (
                <div key={pref} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Label htmlFor={pref} className="text-gray-900 dark:text-gray-100 font-medium cursor-pointer">{pref.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Label>
                  <Switch
                    id={pref}
                    checked={watch(pref as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => setValue(pref as keyof NotificationPreferences, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Frequency Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Frequency</h3>
            <Select
              value={watch('notification_frequency')}
              onValueChange={(value) => setValue('notification_frequency', value as 'DAILY' | 'WEEKLY' | 'INSTANT')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily Digest</SelectItem>
                <SelectItem value="WEEKLY">Weekly Summary</SelectItem>
                <SelectItem value="INSTANT">Instant Notifications</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isDirty || isSaving}
          className="min-w-[100px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
} 
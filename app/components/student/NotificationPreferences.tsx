'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EnhancedSwitch } from '@/components/ui/enhanced-switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [originalValues, setOriginalValues] = useState<NotificationPreferences | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty, dirtyFields },
    reset,
    getValues,
    trigger
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
      setOriginalValues(data);
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof NotificationPreferences, value, { shouldDirty: false });
      });
      reset(data, { keepDirty: false });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load preferences. Please try again or contact support if the problem persists.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: NotificationPreferences) => {
    setShowConfirmDialog(true);
  };

  const confirmSave = async () => {
    setIsSaving(true);
    try {
      const data = getValues();
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
      setOriginalValues(data);
      reset(data, { keepDirty: false });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to saving preferences. Please try again or contact support if the problem persists.');
    } finally {
      setIsSaving(false);
      setShowConfirmDialog(false);
    }
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    if (originalValues) {
      reset(originalValues, { keepDirty: false });
      toast.success('Changes have been reset');
    }
    setShowResetDialog(false);
  };

  const handleSwitchChange = async (key: keyof NotificationPreferences, checked: boolean) => {
    setValue(key, checked, { shouldDirty: true });
    await trigger(key);
  };

  if (isLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-[400px]"
        role="status"
        aria-label="Loading notification preferences"
      >
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="sr-only">Loading notification preferences...</span>
      </div>
    );
  }

  return (
    <>
      <form 
        onSubmit={handleSubmit(handleSave)} 
        className="max-w-4xl mx-auto space-y-8"
        aria-label="Notification preferences form"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notification Preferences</CardTitle>
                <CardDescription className="text-gray-700 dark:text-gray-300 mt-2">
                  Manage how and when you receive notifications
                </CardDescription>
              </div>
              {isDirty && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset Changes
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset all changes to last saved state</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* General Notification Channels */}
            <section 
              className="space-y-4"
              aria-labelledby="general-notifications-heading"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  id="general-notifications-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  General Notification Channels
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                {[
                  { id: 'email_notifications', label: 'Email Notifications' },
                  { id: 'push_notifications', label: 'Push Notifications' },
                  { id: 'sms_notifications', label: 'SMS Notifications' }
                ].map(({ id, label }) => (
                  <EnhancedSwitch
                    key={id}
                    id={id}
                    checked={watch(id as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => handleSwitchChange(id as keyof NotificationPreferences, checked)}
                    label={label}
                    description={watch(id as keyof NotificationPreferences) 
                      ? `You will receive ${label.toLowerCase()} for important updates`
                      : `You will not receive ${label.toLowerCase()}`
                    }
                    activeColor="green"
                    inactiveColor="gray"
                    activeText="ON"
                    inactiveText="OFF"
                    className={dirtyFields[id as keyof NotificationPreferences] ? 'ring-2 ring-blue-500' : ''}
                  />
                ))}
              </div>
            </section>

            {/* Course-related Notifications */}
            <section 
              className="space-y-4"
              aria-labelledby="course-notifications-heading"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  id="course-notifications-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Course Notifications
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                {[
                  { id: 'course_updates', label: 'Course Updates' },
                  { id: 'course_reminders', label: 'Course Reminders' },
                  { id: 'course_announcements', label: 'Course Announcements' },
                  { id: 'course_schedule', label: 'Course Schedule' }
                ].map(({ id, label }) => (
                  <EnhancedSwitch
                    key={id}
                    id={id}
                    checked={watch(id as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => handleSwitchChange(id as keyof NotificationPreferences, checked)}
                    label={label}
                    description={watch(id as keyof NotificationPreferences) 
                      ? `You will be notified about ${label.toLowerCase()}`
                      : `You will not receive ${label.toLowerCase()} notifications`
                    }
                    activeColor="blue"
                    inactiveColor="gray"
                    activeText="ON"
                    inactiveText="OFF"
                    className={dirtyFields[id as keyof NotificationPreferences] ? 'ring-2 ring-blue-500' : ''}
                  />
                ))}
              </div>
            </section>

            {/* Assignment-related Notifications */}
            <section 
              className="space-y-4"
              aria-labelledby="assignment-notifications-heading"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  id="assignment-notifications-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Assignment Notifications
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                {[
                  { id: 'assignment_reminders', label: 'Assignment Reminders' },
                  { id: 'assignment_deadlines', label: 'Assignment Deadlines' },
                  { id: 'assignment_feedback', label: 'Assignment Feedback' },
                  { id: 'assignment_grades', label: 'Assignment Grades' }
                ].map(({ id, label }) => (
                  <EnhancedSwitch
                    key={id}
                    id={id}
                    checked={watch(id as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => handleSwitchChange(id as keyof NotificationPreferences, checked)}
                    label={label}
                    description={watch(id as keyof NotificationPreferences) 
                      ? `You will be notified about ${label.toLowerCase()}`
                      : `You will not receive ${label.toLowerCase()} notifications`
                    }
                    activeColor="purple"
                    inactiveColor="gray"
                    activeText="ON"
                    inactiveText="OFF"
                    className={dirtyFields[id as keyof NotificationPreferences] ? 'ring-2 ring-blue-500' : ''}
                  />
                ))}
              </div>
            </section>

            {/* Payment-related Notifications */}
            <section 
              className="space-y-4"
              aria-labelledby="payment-notifications-heading"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  id="payment-notifications-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Payment Notifications
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                {[
                  { id: 'payment_reminders', label: 'Payment Reminders' },
                  { id: 'payment_confirmation', label: 'Payment Confirmation' },
                  { id: 'payment_receipts', label: 'Payment Receipts' },
                  { id: 'payment_failed', label: 'Payment Failed' }
                ].map(({ id, label }) => (
                  <EnhancedSwitch
                    key={id}
                    id={id}
                    checked={watch(id as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => handleSwitchChange(id as keyof NotificationPreferences, checked)}
                    label={label}
                    description={watch(id as keyof NotificationPreferences) 
                      ? `You will be notified about ${label.toLowerCase()}`
                      : `You will not receive ${label.toLowerCase()} notifications`
                    }
                    activeColor="orange"
                    inactiveColor="gray"
                    activeText="ON"
                    inactiveText="OFF"
                    className={dirtyFields[id as keyof NotificationPreferences] ? 'ring-2 ring-blue-500' : ''}
                  />
                ))}
              </div>
            </section>

            {/* Progress-related Notifications */}
            <section 
              className="space-y-4"
              aria-labelledby="progress-notifications-heading"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  id="progress-notifications-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Progress Notifications
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                {[
                  { id: 'progress_updates', label: 'Progress Updates' },
                  { id: 'achievement_alerts', label: 'Achievement Alerts' },
                  { id: 'milestone_reached', label: 'Milestone Reached' }
                ].map(({ id, label }) => (
                  <EnhancedSwitch
                    key={id}
                    id={id}
                    checked={watch(id as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => handleSwitchChange(id as keyof NotificationPreferences, checked)}
                    label={label}
                    description={watch(id as keyof NotificationPreferences) 
                      ? `You will be notified about ${label.toLowerCase()}`
                      : `You will not receive ${label.toLowerCase()} notifications`
                    }
                    activeColor="emerald"
                    inactiveColor="gray"
                    activeText="ON"
                    inactiveText="OFF"
                    className={dirtyFields[id as keyof NotificationPreferences] ? 'ring-2 ring-blue-500' : ''}
                  />
                ))}
              </div>
            </section>

            {/* Communication Preferences */}
            <section 
              className="space-y-4"
              aria-labelledby="communication-preferences-heading"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  id="communication-preferences-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Communication Preferences
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                {[
                  { id: 'instructor_messages', label: 'Instructor Messages' },
                  { id: 'group_messages', label: 'Group Messages' },
                  { id: 'system_announcements', label: 'System Announcements' }
                ].map(({ id, label }) => (
                  <EnhancedSwitch
                    key={id}
                    id={id}
                    checked={watch(id as keyof NotificationPreferences)}
                    onCheckedChange={(checked) => handleSwitchChange(id as keyof NotificationPreferences, checked)}
                    label={label}
                    description={watch(id as keyof NotificationPreferences) 
                      ? `You will receive ${label.toLowerCase()}`
                      : `You will not receive ${label.toLowerCase()}`
                    }
                    activeColor="indigo"
                    inactiveColor="gray"
                    activeText="ON"
                    inactiveText="OFF"
                    className={dirtyFields[id as keyof NotificationPreferences] ? 'ring-2 ring-blue-500' : ''}
                  />
                ))}
              </div>
            </section>

            {/* Notification Frequency */}
            <section 
              className="space-y-4"
              aria-labelledby="notification-frequency-heading"
            >
              <div className="flex items-center space-x-2">
                <h3 
                  id="notification-frequency-heading"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  Notification Frequency
                </h3>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800 ml-4" />
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="notification_frequency"
                    className="text-gray-900 dark:text-gray-100 font-medium"
                  >
                    How often would you like to receive notifications?
                  </Label>
                  <Select
                    value={watch('notification_frequency')}
                    onValueChange={(value) => {
                      setValue('notification_frequency', value as 'DAILY' | 'WEEKLY' | 'INSTANT', { shouldDirty: true });
                      trigger('notification_frequency');
                    }}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INSTANT">Instant</SelectItem>
                      <SelectItem value="DAILY">Daily Digest</SelectItem>
                      <SelectItem value="WEEKLY">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="min-w-[100px]"
            >
              Reset Changes
            </Button>
          )}
          <Button
            type="submit"
            disabled={!isDirty || isSaving}
            className="min-w-[100px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={isSaving ? "Saving changes..." : "Save changes"}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                <span>Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </form>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save your notification preference changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all changes? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReset}>Reset Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 
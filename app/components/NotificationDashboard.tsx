'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Settings, Trash2, Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: string;
  status: 'UNREAD' | 'READ' | 'SENT' | 'FAILED' | 'DELETED';
  title: string;
  message: string;
  metadata: unknown;
  createdAt: string;
  readAt?: string;
  template?: {
    name: string;
    subject: string;
    title: string;
    category: string;
  };
}

interface NotificationStats {
  total: number;
  read: number;
  unread: number;
  sent: number;
  failed: number;
}

interface NotificationPreference {
  id: string;
  templateId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  frequency: string;
  template: {
    name: string;
    category: string;
    title: string;
  };
}

export default function NotificationDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    read: 0,
    unread: 0,
    sent: 0,
    failed: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, [pagination.page]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/notifications?page=${pagination.page}&limit=${pagination.limit}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setStats(data.stats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleNotificationAction = async (action: string, notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds, action })
      });

      if (response.ok) {
        toast.success('Notifications updated successfully');
        fetchNotifications();
        setSelectedNotifications([]);
      } else {
        toast.error('Failed to update notifications');
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notifications');
    }
  };

  const handlePreferenceUpdate = async (preferences: NotificationPreference[]) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences })
      });

      if (response.ok) {
        toast.success('Preferences updated successfully');
        fetchPreferences();
      } else {
        toast.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedNotifications.length === 0) {
      toast.error('Please select notifications first');
      return;
    }
    await handleNotificationAction(action, selectedNotifications);
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const toggleAllNotifications = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'UNREAD':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'READ':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'course':
        return <BookOpen className="w-4 h-4" />;
      case 'payment':
        return <CreditCard className="w-4 h-4" />;
      case 'achievement':
        return <Trophy className="w-4 h-4" />;
      case 'subscription':
        return <Package className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Manage your notifications and preferences</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-xl font-semibold">{stats.read}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <EyeOff className="w-5 h-5 text-blue-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-xl font-semibold">{stats.unread}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-xl font-semibold">{stats.sent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-xl font-semibold">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'notifications'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'preferences'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Preferences
        </button>
      </div>

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow">
          {/* Bulk Actions */}
          {selectedNotifications.length > 0 && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedNotifications.length} notification(s) selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction('mark_read')}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Mark as Read
                  </button>
                  <button
                    onClick={() => handleBulkAction('mark_unread')}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Mark as Unread
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="divide-y divide-gray-200">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications found</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 ${
                    notification.status === 'UNREAD' ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => toggleNotificationSelection(notification.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(notification.status)}
                          <h3 className="font-medium text-gray-900">
                            {notification.template?.title || notification.title}
                          </h3>
                          {notification.template?.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {notification.template.category}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex space-x-2">
                        {notification.status === 'UNREAD' && (
                          <button
                            onClick={() => handleNotificationAction('mark_read', [notification.id])}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Mark as Read
                          </button>
                        )}
                        {notification.status === 'READ' && (
                          <button
                            onClick={() => handleNotificationAction('mark_unread', [notification.id])}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Mark as Unread
                          </button>
                        )}
                        <button
                          onClick={() => handleNotificationAction('delete', [notification.id])}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {preferences.map((preference) => (
                <div key={preference.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {preference.template.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Category: {preference.template.category}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preference.emailEnabled}
                        onChange={(e) => {
                          const updatedPreferences = preferences.map(p =>
                            p.id === preference.id
                              ? { ...p, emailEnabled: e.target.checked }
                              : p
                          );
                          setPreferences(updatedPreferences);
                          handlePreferenceUpdate(updatedPreferences);
                        }}
                        className="rounded"
                      />
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preference.pushEnabled}
                        onChange={(e) => {
                          const updatedPreferences = preferences.map(p =>
                            p.id === preference.id
                              ? { ...p, pushEnabled: e.target.checked }
                              : p
                          );
                          setPreferences(updatedPreferences);
                          handlePreferenceUpdate(updatedPreferences);
                        }}
                        className="rounded"
                      />
                      <Bell className="w-4 h-4" />
                      <span className="text-sm">Push</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preference.smsEnabled}
                        onChange={(e) => {
                          const updatedPreferences = preferences.map(p =>
                            p.id === preference.id
                              ? { ...p, smsEnabled: e.target.checked }
                              : p
                          );
                          setPreferences(updatedPreferences);
                          handlePreferenceUpdate(updatedPreferences);
                        }}
                        className="rounded"
                      />
                      <Smartphone className="w-4 h-4" />
                      <span className="text-sm">SMS</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Import missing icons
import { BookOpen, CreditCard, Trophy, Package } from 'lucide-react'; 
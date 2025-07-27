import { Metadata } from 'next';
import AdminNotificationAnalytics from '@/components/admin/AdminNotificationAnalytics';

export const metadata: Metadata = {
  title: 'Notification Analytics | Admin Dashboard',
  description: 'Monitor notification performance and delivery rates',
};

export default function AdminNotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNotificationAnalytics />
    </div>
  );
} 
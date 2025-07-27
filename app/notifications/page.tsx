import { Metadata } from 'next';
import NotificationDashboard from '../components/NotificationDashboard';

export const metadata: Metadata = {
  title: 'Notifications | Learning Platform',
  description: 'Manage your notifications and preferences',
};

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationDashboard />
    </div>
  );
} 
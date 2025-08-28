'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Video,
  DollarSign,
  Users,
  BarChart3,
  Calendar,
  Settings,
  Crown,
  MessageSquare,
  BookOpen,
  Award,
  TrendingUp
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/instructor/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of your teaching business'
  },
  {
    title: 'Live Classes',
    href: '/instructor/classes',
    icon: Video,
    description: 'Manage your live classes'
  },
  {
    title: 'Schedule',
    href: '/instructor/schedule',
    icon: Calendar,
    description: 'View and manage your schedule'
  },
  {
    title: 'Commissions',
    href: '/instructor/commissions',
    icon: DollarSign,
    description: 'Track your earnings and commissions'
  },
  {
    title: 'Students',
    href: '/instructor/students',
    icon: Users,
    description: 'Manage your students'
  },
  {
    title: 'Analytics',
    href: '/instructor/analytics',
    icon: BarChart3,
    description: 'View performance analytics'
  },
  {
    title: 'Tier Status',
    href: '/instructor/tier',
    icon: Crown,
    description: 'Track your tier progression'
  },
  {
    title: 'Messages',
    href: '/instructor/messages',
    icon: MessageSquare,
    description: 'Communicate with students'
  },
  {
    title: 'Resources',
    href: '/instructor/resources',
    icon: BookOpen,
    description: 'Teaching resources and materials'
  },
  {
    title: 'Achievements',
    href: '/instructor/achievements',
    icon: Award,
    description: 'View your achievements and badges'
  },
  {
    title: 'Performance',
    href: '/instructor/performance',
    icon: TrendingUp,
    description: 'Track your teaching performance'
  },
  {
    title: 'Settings',
    href: '/instructor/settings',
    icon: Settings,
    description: 'Manage your instructor profile'
  }
];

export default function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Instructor Portal</h2>
            <p className="text-sm text-gray-400">Teaching Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
              title={item.description}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Instructor Portal v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

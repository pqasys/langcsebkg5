'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useNavigation } from '@/lib/navigation';
import {
  LayoutDashboard,
  BookOpen,
  BarChart2,
  User,
  Settings,
  LogOut,
  Home,
  CreditCard,
  History,
  Target,
  Award,
  Calendar,
  Play,
  Video,
  MessageCircle
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: Home,
    description: 'Overview of your learning progress'
  },
  {
    title: 'My Courses',
    href: '/student/courses',
    icon: BookOpen,
    description: 'Browse and access your enrolled courses'
  },
  {
    title: 'Live Conversations',
    href: '/live-conversations',
    icon: MessageCircle,
    description: 'Practice in real-time with peers and instructors'
  },
  {
    title: 'Live Classes',
    href: '/student/live-classes',
    icon: Video,
    description: 'Join live language learning sessions'
  },
  {
    title: 'Learning Activities',
    href: '/student/progress',
    icon: Target,
    description: 'Track your progress and achievements'
  },
  {
    title: 'Recent Modules',
    href: '/student/progress?view=modules',
    icon: Play,
    description: 'Continue where you left off'
  },
  {
    title: 'Achievements',
    href: '/student/progress?view=achievements',
    icon: Award,
    description: 'View your earned badges and certificates'
  },
  {
    title: 'Study Calendar',
    href: '/student/calendar',
    icon: Calendar,
    description: 'Plan your study sessions'
  },
  {
    title: 'Payments',
    href: '/student/payments',
    icon: CreditCard,
    description: 'Manage your course payments'
  },
  {
    title: 'Payment History',
    href: '/student/payments/history',
    icon: History,
    description: 'View your payment records'
  },
  {
    title: 'Language Test',
    href: '/language-proficiency-test',
    icon: Award,
    description: 'Take the free language proficiency test'
  },
  {
    title: 'Settings',
    href: '/student/settings',
    icon: Settings,
    description: 'Manage your account settings'
  }
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const navigate = useNavigation();

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Student Portal</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || 
                          (item.href.includes('?') && pathname.startsWith(item.href.split('?')[0]));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors no-hover-underline ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              title={item.description}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
              />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 p-4">
        <button
          onClick={async () => {
            try {
              // Immediately disable button and show loading
              const button = event?.target as HTMLButtonElement;
              if (button) {
                button.disabled = true;
                button.textContent = 'Signing out...';
              }
              
              // Call signOut with redirect: false
              await signOut({ 
                redirect: false 
              });
              
              // // // console.log('Session cleared, forcing complete page refresh...');
              navigate.replace('/');
            } catch (error) {
              console.error('Sign out error:', error);
              navigate.replace('/');
            }
          }}
          className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
          Sign Out
        </button>
      </div>
    </div>
  );
} 
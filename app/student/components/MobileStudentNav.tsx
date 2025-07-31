'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  CreditCard,
  History,
  BarChart,
  Settings,
  Home,
  Target,
  Award,
  Calendar,
  Play,
  User,
  Video
} from 'lucide-react';

const mobileNavItems = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: Home
  },
  {
    title: 'Courses',
    href: '/student/courses',
    icon: BookOpen
  },
  {
    title: 'Live Classes',
    href: '/student/live-classes',
    icon: Video
  },
  {
    title: 'Progress',
    href: '/student/progress',
    icon: Target
  },
  {
    title: 'Payments',
    href: '/student/payments',
    icon: CreditCard
  },
  {
    title: 'Profile',
    href: '/student/profile',
    icon: User
  }
];

export default function MobileStudentNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
                          (item.href.includes('?') && pathname.startsWith(item.href.split('?')[0]));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full py-2 px-1 text-xs font-medium transition-colors no-hover-underline',
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 mb-1',
                isActive ? 'text-white' : 'text-gray-400'
              )} />
              <span className="text-xs">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 
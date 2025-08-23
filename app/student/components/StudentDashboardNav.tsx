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
  FileText,
  Play,
  Crown
} from 'lucide-react';

const navItems = [
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
    title: 'Subscription',
    href: '/student/subscription',
    icon: Crown,
    description: 'Manage your learning subscription'
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

export default function StudentDashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || 
                        (item.href.includes('?') && pathname.startsWith(item.href.split('?')[0]));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
              isActive ? 'bg-accent text-accent-foreground' : 'transparent'
            )}
            title={item.description}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
} 
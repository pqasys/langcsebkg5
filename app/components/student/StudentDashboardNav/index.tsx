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
  Home
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/student',
    icon: Home
  },
  {
    title: 'My Courses',
    href: '/student/courses',
    icon: BookOpen
  },
  {
    title: 'Payments',
    href: '/student/payments',
    icon: CreditCard
  },
  {
    title: 'Payment History',
    href: '/student/payments/history',
    icon: History
  },
  {
    title: 'Progress',
    href: '/student/progress',
    icon: BarChart
  },
  {
    title: 'Settings',
    href: '/student/settings',
    icon: Settings
  }
];

export default function StudentDashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === item.href ? 'bg-accent' : 'transparent'
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
} 
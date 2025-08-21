'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  List,
  Settings,
  Mail,
  CreditCard,
  Activity,
  Megaphone,
  MessageCircle
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'Live Conversations',
    href: '/admin/live-conversations',
    icon: MessageCircle
  },
  {
    title: 'Institutions',
    href: '/admin/institutions',
    icon: Building2
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: List
  },
  {
    title: 'Email Settings',
    href: '/admin/settings/email',
    icon: Mail
  },
  {
    title: 'Payment Approval Settings',
    href: '/admin/settings/payment-approval',
    icon: CreditCard
  },
  {
    title: 'Performance Dashboard',
    href: '/admin/performance',
    icon: Activity
  },
  {
    title: 'Advertising',
    href: '/admin/advertising',
    icon: Megaphone
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col gap-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 no-hover-underline',
              pathname === item.href ? 'bg-gray-100 font-medium' : 'text-gray-500'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </div>
  );
} 
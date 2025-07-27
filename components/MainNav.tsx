'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BookOpen, Building2, Tag, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';

const menuItems = [
  {
    title: 'Courses',
    href: '/courses',
    icon: BookOpen
  },
  {
    title: 'Institutions',
    href: '/institutions',
    icon: Building2
  },
  {
    title: 'Tags',
    href: '/tags',
    icon: Tag
  }
];

export default function MainNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Debug logging
  // console.log('MainNav Session:', {
  //   status,
  //   hasSession: !!session,
  //   user: session?.user,
  //   role: session?.user?.role
  // });

  const getDashboardLink = () => {
    if (!session?.user) {
      console.log('No user session found');
      return null;
    }
    const role = session.user.role?.toUpperCase();
    console.log('User role:', role);
    
    switch (role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'INSTITUTION':
        return '/institution/dashboard';
      case 'STUDENT':
        return '/student';
      default:
        console.log('Unknown role:', role);
        return null;
    }
  };

  const dashboardLink = getDashboardLink();
  console.log('Dashboard link:', dashboardLink);

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {dashboardLink && (
        <Link
          href={dashboardLink}
          className={cn(
            'flex items-center text-sm font-medium transition-colors hover:text-primary no-hover-underline',
            pathname === dashboardLink ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Link>
      )}
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary no-hover-underline',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
} 
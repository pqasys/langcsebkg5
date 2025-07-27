import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  CreditCard,
  Settings,
  User,
} from 'lucide-react';

const navigation = [
  {
    name: 'Courses',
    href: '/student/courses',
    icon: BookOpen,
  },
  {
    name: 'Payments',
    href: '/student/payments',
    icon: CreditCard,
  },
  {
    name: 'Profile',
    href: '/student/profile',
    icon: User,
  },
  {
    name: 'Settings',
    href: '/student/settings',
    icon: Settings,
  },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navigation.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex items-center text-sm font-medium transition-colors hover:text-primary',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
} 
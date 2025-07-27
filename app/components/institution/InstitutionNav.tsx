import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Users,
  Settings,
  CreditCard,
  BarChart,
} from 'lucide-react';

const navigation = [
  {
    name: 'Courses',
    href: '/institution/courses',
    icon: BookOpen,
  },
  {
    name: 'Students',
    href: '/institution/students',
    icon: Users,
  },
  {
    name: 'Payments',
    href: '/institution/payments',
    icon: CreditCard,
  },
  {
    name: 'Analytics',
    href: '/institution/analytics',
    icon: BarChart,
  },
  {
    name: 'Settings',
    href: '/institution/settings',
    icon: Settings,
  },
];

export function InstitutionNav() {
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
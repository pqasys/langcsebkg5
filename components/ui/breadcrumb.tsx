'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbProps {
  items?: {
    label: string;
    href: string;
  }[];
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // If no items are provided, generate them from the pathname
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs(pathname);

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      <Link
        href="/institution"
        className="flex items-center hover:text-gray-900"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            href={item.href}
            className={`hover:text-gray-900 ${
              index === breadcrumbItems.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}

function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  let currentPath = '';

  for (const path of paths) {
    currentPath += `/${path}`;
    const label = path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push({
      label,
      href: currentPath
    });
  }

  return breadcrumbs;
} 
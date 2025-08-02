import { LayoutDashboard, BookOpen, Users, Settings, CreditCard } from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/institution/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Courses',
    href: '/institution/courses',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: 'Students',
    href: '/institution/students',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Instructors',
    href: '/institution/instructors',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Payments',
    href: '/institution/payments',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    title: 'Settings',
    href: '/institution/settings',
    icon: <Settings className="h-5 w-5" />,
  },
]; 
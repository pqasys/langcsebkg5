'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Building2,
  BookOpen,
  Users,
  Settings,
  LogOut,
  School,
  FileText,
  Video,
  Mic,
  Image,
  FileQuestion,
  ChevronDown,
  ChevronRight,
  List,
  GraduationCap,
  LayoutDashboard,
  Plus,
  CreditCard,
  Play,
  Headphones,
  FileImage,
  CheckCircle,
  Clock,
  Database,
  Share2,
  BarChart3,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useNavigation } from '@/lib/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  modules: { id: string; title: string }[];
  status?: string;
}

interface InstitutionSidebarProps {
  onNavigate?: () => void;
}

export default function InstitutionSidebar({ onNavigate }: InstitutionSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const navigate = useNavigation();
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/institution/dashboard',
      icon: LayoutDashboard,
      description: 'Overview of your institution'
    },
    {
      title: 'Institution Profile',
      href: '/institution/profile',
      icon: School,
      description: 'Manage your institution profile'
    },
    {
      title: 'Analytics',
      href: '/institution/analytics',
      icon: BarChart3,
      description: 'View performance analytics'
    },
    {
      title: 'Students',
      href: '/institution/students',
      icon: Users,
      description: 'Manage enrolled students'
    },
    {
      title: 'Courses',
      href: '/institution/courses',
      icon: BookOpen,
      badge: courses.length > 0 ? courses.length : undefined,
      description: 'Manage your courses'
    },
    {
      title: 'Question Templates',
      href: '/institution/question-templates',
      icon: FileText,
      description: 'Create and manage question templates'
    },
    {
      title: 'Question Banks',
      href: '/institution/question-banks',
      icon: Database,
      description: 'Manage question banks'
    },
    {
      title: 'Live Classes',
      href: '/institution/live-classes',
      icon: Video,
      description: 'Manage live classes and sessions'
    },
    {
      title: 'Shared Questions',
      href: '/institution/shared-questions',
      icon: Share2,
      description: 'Access shared question library'
    },
    {
      title: 'Collaboration',
      href: '/institution/collaboration',
      icon: Users,
      description: 'Collaborate with other institutions'
    },
    {
      title: 'Content Management',
      href: '/institution/content-management',
      icon: FileText,
      description: 'Manage learning content'
    },
    {
      title: 'Setup',
      href: '/institution/setup',
      icon: Settings,
      description: 'Complete or update institution profile'
    },
    {
      title: 'Teachers',
      href: '/institution/teachers',
      icon: GraduationCap,
      description: 'Manage teaching staff'
    },
    {
      title: 'Quizzes',
      href: '/institution/quizzes',
      icon: FileQuestion,
      description: 'Create and manage quizzes'
    },
    {
      title: 'Payments',
      href: '/institution/payments',
      icon: CreditCard,
      description: 'Manage payments and revenue'
    },
    {
      title: 'Settings',
      href: '/institution/settings',
      icon: Settings,
      description: 'Manage institution settings'
    },
    {
      title: 'Design Toolkit',
      href: '/admin/design-configs',
      icon: Palette,
      description: 'Customize promotional and advertising designs'
    }
  ];

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/institution/courses');
      if (!response.ok) throw new Error(`Failed to fetch courses - Context: if (!response.ok) throw new Error('Failed to fetch...`);
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to load courses. Please try again or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchCourses();
    }
  }, [session]);

  // Add event listener for module changes
  useEffect(() => {
    const handleModuleChange = () => {
      fetchCourses();
    };

    // Listen for custom event when modules are modified
    window.addEventListener('moduleChange', handleModuleChange);

    return () => {
      window.removeEventListener('moduleChange', handleModuleChange);
    };
  }, []);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleNavigation = (href: string) => {
    // Call the navigation callback if provided (for mobile)
    if (onNavigate) {
      onNavigate();
    }
  };

  const isActive = (path: string) => pathname === path;
  const isActiveCourse = (courseId: string) => pathname.startsWith(`/institution/courses/${courseId}`);

  // Show only the 3 most recently modified courses
  const recentCourses = courses.slice(0, 3);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:bg-gray-800 hover:text-gray-50 no-hover-underline',
                  isActive && 'bg-gray-800 text-gray-50'
                )}
                title={item.description}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                {item.badge && (
                  <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Course Management Section */}
        <div className="mt-6">
          <div className="mb-2 px-4">
            <h2 className="text-lg font-semibold tracking-tight text-gray-400">
              Course Management
            </h2>
          </div>

          {/* View All Courses Link */}
          <div className="mb-3 px-3">
            <Link
              href="/institution/courses"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800 hover:text-gray-50 hover:scale-105 no-hover-underline"
            >
              <BookOpen className="h-4 w-4" />
              View All Courses
              {courses.length > 0 && (
                <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                  {courses.length}
                </span>
              )}
            </Link>
          </div>

          {/* Quick Stats */}
          {courses.length > 0 && (
            <div className="mb-3 px-3">
              <div className="rounded-lg bg-gray-800/50 p-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Total Courses</span>
                  <span className="font-medium text-gray-50">{courses.length}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>Published</span>
                  <span className="font-medium text-green-400">
                    {courses.filter(c => c.status === 'PUBLISHED').length}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>Draft</span>
                  <span className="font-medium text-yellow-400">
                    {courses.filter(c => c.status === 'DRAFT').length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="px-3 py-2">
            <Link
              href="/institution/courses/new"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800 hover:text-gray-50 no-hover-underline"
            >
              <Plus className="h-4 w-4" />
              Create New Course
            </Link>
          </div>

          {/* Recent Courses */}
          <div className="mt-2 space-y-1">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-400">Loading courses...</div>
            ) : recentCourses.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">No courses found</div>
            ) : (
              recentCourses.map((course) => (
                <div key={course.id} className="border-l-2 border-gray-700">
                  <button
                    onClick={() => toggleCourse(course.id)}
                    className={cn(
                      'flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800 hover:text-gray-50',
                      isActiveCourse(course.id) && 'bg-gray-800 text-gray-50'
                    )}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span className="truncate flex-1 text-left">{course.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                        {course.modules.length} module{course.modules.length !== 1 ? 's' : ''}
                      </span>
                      {expandedCourses.includes(course.id) ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  {expandedCourses.includes(course.id) && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                      {/* Modules Overview Link */}
                      <Link
                        href={`/institution/courses/${course.id}/modules`}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800 hover:text-gray-50 no-hover-underline',
                          isActive(`/institution/courses/${course.id}/modules`) && 'bg-gray-800 text-gray-50'
                        )}
                      >
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Manage Modules</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center space-x-1">
                            <Play className="h-3 w-3 text-blue-400" />
                            <Headphones className="h-3 w-3 text-green-400" />
                            <FileImage className="h-3 w-3 text-purple-400" />
                            <FileQuestion className="h-3 w-3 text-orange-400" />
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {course.modules.length}
                          </span>
                        </div>
                      </Link>
                      
                      {/* Individual Modules */}
                      <div className="space-y-1">
                        {course.modules.slice(0, 3).map((module, index) => (
                          <Link
                            key={module.id}
                            href={`/institution/courses/${course.id}/modules/${module.id}/content`}
                            className={cn(
                              'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800 hover:text-gray-50 no-hover-underline',
                              isActive(`/institution/courses/${course.id}/modules/${module.id}/content`) && 'bg-gray-800 text-gray-50'
                            )}
                          >
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-gray-500 mr-2"></div>
                              <span className="truncate max-w-32">{module.title}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                            </div>
                          </Link>
                        ))}
                        
                        {/* View All Modules Link */}
                        {course.modules.length > 3 && (
                          <Link
                            href={`/institution/courses/${course.id}/modules`}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:bg-gray-800 hover:text-gray-50 no-hover-underline"
                          >
                            <div className="flex items-center">
                              <List className="h-3 w-3 mr-2" />
                              <span className="text-xs">View all {course.modules.length} modules</span>
                            </div>
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-400 hover:text-gray-50"
          onClick={async (event) => {
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
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
} 
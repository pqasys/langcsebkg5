'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  FileText,
  Video,
  Mic,
  Image,
  FileQuestion,
  Database,
  ClipboardList,
  Globe,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function InstitutionSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const isActive = (path: string) => pathname === path;
  const isActiveCourse = (courseId: string) => pathname.startsWith(`/institution/courses/${courseId}`);
  const isQuestionTemplatesPage = pathname.startsWith('/institution/question-templates');
  const isQuestionBanksPage = pathname.startsWith('/institution/question-banks');
  const isSharedQuestionsPage = pathname.startsWith('/institution/shared-questions');
  const isLiveClassesPage = pathname.startsWith('/institution/live-classes');

  const courses = [
    {
      id: '1',
      title: 'English for Beginners',
      modules: [
        { id: '1', title: 'Introduction to English' },
        { id: '2', title: 'Basic Grammar' },
        { id: '3', title: 'Essential Vocabulary' },
      ],
    },
    {
      id: '2',
      title: 'Business English',
      modules: [
        { id: '4', title: 'Business Communication' },
        { id: '5', title: 'Professional Writing' },
        { id: '6', title: 'Business Meetings' },
      ],
    },
  ];

  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Institution Dashboard
          </h2>
          <div className="space-y-1">
            <Link
              href="/institution/dashboard"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isActive('/institution/dashboard') && 'bg-accent'
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/institution/students"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isActive('/institution/students') && 'bg-accent'
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Students
            </Link>
            <Link
              href="/institution/courses"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isActive('/institution/courses') && 'bg-accent'
              )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Courses
            </Link>
            <Link
              href="/institution/settings"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isActive('/institution/settings') && 'bg-accent'
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/institution/live-classes"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isLiveClassesPage && 'bg-accent'
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Live Classes
            </Link>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Content Management
          </h2>
          <div className="space-y-1">
            <Link
              href="/institution/question-templates"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isQuestionTemplatesPage && 'bg-accent'
              )}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Question Templates
            </Link>
            <Link
              href="/institution/question-banks"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isQuestionBanksPage && 'bg-accent'
              )}
            >
              <Database className="mr-2 h-4 w-4" />
              Question Banks
            </Link>
            <Link
              href="/institution/shared-questions"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                isSharedQuestionsPage && 'bg-accent'
              )}
            >
              <Globe className="mr-2 h-4 w-4" />
              Shared Questions
            </Link>
            <Link
              href="/institution/collaboration"
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                pathname.startsWith('/institution/collaboration') && 'bg-accent'
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              Collaboration
            </Link>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Course Management
          </h2>
          <div className="space-y-1">
            {courses.map((course) => (
              <div key={course.id}>
                <button
                  onClick={() => toggleCourse(course.id)}
                  className={cn(
                    'flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    isActiveCourse(course.id) && 'bg-accent'
                  )}
                >
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {course.title}
                  {expandedCourses.includes(course.id) ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
                {expandedCourses.includes(course.id) && (
                  <div className="ml-6 mt-1 space-y-1">
                    <Link
                      href={`/institution/courses/${course.id}/modules`}
                      className={cn(
                        'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                        isActive(`/institution/courses/${course.id}/modules`) && 'bg-accent'
                      )}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Modules
                    </Link>
                    {course.modules.map((module) => (
                      <Link
                        key={module.id}
                        href={`/institution/courses/${course.id}/modules/${module.id}/content`}
                        className={cn(
                          'flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                          isActive(`/institution/courses/${course.id}/modules/${module.id}/content`) && 'bg-accent'
                        )}
                      >
                        <div className="ml-4 flex items-center space-x-2">
                          <Video className="h-3 w-3" />
                          <Mic className="h-3 w-3" />
                          <Image className="h-3 w-3" />
                          <FileQuestion className="h-3 w-3" />
                        </div>
                        <span className="ml-2">{module.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
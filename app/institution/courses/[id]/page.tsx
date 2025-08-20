'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowLeft, 
  Edit, 
  Settings, 
  BookOpen, 
  Users, 
  Calendar, 
  DollarSign,
  Tag,
  Clock,
  BarChart3,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDisplayLabel } from '@/lib/utils';

interface Course {
  id: string;
  title: string;
  description: string;
  base_price: number;
  duration: number;
  level: string;
  status: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  framework?: string;
  pricingPeriod?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    bookings: number;
  };
  courseTags?: {
    tag: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    }
  }[];
  modules?: {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
    level: string;
    estimated_duration: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
  }[];
  category?: {
    id: string;
    name: string;
    description: string | null;
  };
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = params.id as string;

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/institution/courses/${courseId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Course not found');
        } else {
          throw new Error(`Failed to fetch course - Context: throw new Error('Failed to fetch course');...`);
        }
        return;
      }

      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load course. Please try again or contact support if the problem persists.`);
      setError('Failed to load course details');
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <CheckCircle className="w-4 h-4" />;
      case 'DRAFT':
        return <AlertCircle className="w-4 h-4" />;
      case 'ARCHIVED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested course could not be found.'}</p>
          <Button onClick={() => router.push('/institution/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/institution/courses')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 text-lg">{course.description}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/institution/courses/${course.id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/institution/courses/${course.id}/modules`)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Modules
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/institution/courses/${course.id}/enrollments`)}
            >
              <Users className="w-4 h-4 mr-2" />
              View Enrollments
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Course Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${course.base_price}</div>
                  <div className="text-sm text-gray-600">Base Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{course.duration}</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{course.maxStudents}</div>
                  <div className="text-sm text-gray-600">Max Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{course._count?.bookings || 0}</div>
                  <div className="text-sm text-gray-600">Bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Modules ({course.modules?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{module.title}</h4>
                          <p className="text-sm text-gray-600">{module.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>Level: {module.level}</span>
                            <span>Duration: {module.estimated_duration} min</span>
                            <span className={`flex items-center gap-1 ${module.is_published ? 'text-green-600' : 'text-yellow-600'}`}>
                              {module.is_published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/institution/courses/${course.id}/modules/${module.id}/content`)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No modules created yet</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push(`/institution/courses/${course.id}/modules/new`)}
                  >
                    Create First Module
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Status */}
          <Card>
            <CardHeader>
              <CardTitle>Course Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={`${getStatusColor(course.status)}`}>
                  {getStatusIcon(course.status)}
                  <span className="ml-1">{course.status}</span>
                </Badge>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Updated: {new Date(course.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Start: {new Date(course.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>End: {new Date(course.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span>Level: {formatDisplayLabel(course.level)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span>Framework: {formatDisplayLabel(course.framework || 'CEFR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Duration: {course.duration} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>Pricing: {formatDisplayLabel(course.pricingPeriod || 'FULL_COURSE')}</span>
                </div>
                {course.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span>Category: {course.category.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {course.courseTags && course.courseTags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.courseTags.map((ct) => (
                    <Badge
                      key={ct.tag.id}
                      variant="secondary"
                      style={{
                        backgroundColor: ct.tag.color || '#6b7280',
                        color: '#ffffff'
                      }}
                    >
                      {ct.tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 
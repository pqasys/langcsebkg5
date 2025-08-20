'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, Eye, BookOpen, Users, Calendar, DollarSign } from 'lucide-react';
import { formatDisplayLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  status: string;
  base_price: number;
  duration: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  framework: string;
  pricingPeriod: string;
  institution: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  courseTags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  _count?: {
    enrollments: number;
    completions: number;
    courseTags: number;
  };
  modules: Module[];
}

interface Module {
  id: string;
  title: string;
  description?: string;
  level: string;
  order_index: number;
  estimated_duration: number;
  is_published: boolean;
  contentItems: Array<{
    id: string;
    title: string;
    type: string;
  }>;
  exercises: Array<{
    id: string;
    question: string;
    type: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    passing_score: number;
  }>;
  skills: string[];
}

export default function AdminCourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // // // // // // // // // // // // console.log('Fetching course data...');
      
      // Fetch course details
      const courseResponse = await fetch(`/api/admin/courses/${params.id}`);
      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course');
      }
      const courseData = await courseResponse.json();
      
      console.log('Course data received:', courseData);
      
      // Fetch modules for the course
      const modulesResponse = await fetch(`/api/admin/courses/${params.id}/modules`);
      if (!modulesResponse.ok) {
        throw new Error('Failed to fetch modules');
      }
      const modulesData = await modulesResponse.json();
      
      console.log('Modules data received:', modulesData);
      
      const finalCourseData = {
        ...courseData,
        modules: modulesData,
        _count: courseData._count || {
          enrollments: 0,
          completions: 0,
          courseTags: courseData.courseTags?.length || 0
        }
      };
      
      console.log('Final course data:', finalCourseData);
      
      setCourse(finalCourseData);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to load course. Please try again or contact support if the problem persists.`);
      setError('Failed to load course details. Please try again.');
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = () => {
    router.push(`/admin/courses?edit=${params.id}`);
  };

  const handleManageModules = () => {
    router.push(`/admin/courses/${params.id}/modules`);
  };

  const handleViewInstitution = () => {
    router.push(`/admin/institutions/${course?.institution.id}`);
  };

  const handleViewCategory = () => {
    router.push(`/admin/categories`);
  };

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground">
              Course Details • {course.institution.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEditCourse}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Course
          </Button>
          <Button onClick={handleManageModules}>
            <BookOpen className="w-4 h-4 mr-2" />
            Manage Modules
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{course.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Level</h3>
                  <Badge variant="secondary">{formatDisplayLabel(course.level)}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {course.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Framework</h3>
                  <Badge variant="outline">{formatDisplayLabel(course.framework)}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p className="text-muted-foreground">{course.duration} weeks</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Start Date</h3>
                  <p className="text-muted-foreground">
                    {new Date(course.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">End Date</h3>
                  <p className="text-muted-foreground">
                    {new Date(course.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {course.courseTags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.courseTags.map((courseTag) => (
                      <Badge
                        key={courseTag.tag.id}
                        variant="outline"
                        style={{ 
                          borderColor: courseTag.tag.color,
                          color: courseTag.tag.color 
                        }}
                      >
                        {courseTag.tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modules Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Modules Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {course.modules && course.modules.length > 0 ? (
                <div className="space-y-3">
                  {course.modules.map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-gray-500">
                          {module.contentItems.length} content items • 
                          {module.exercises.length} exercises • 
                          {module.quizzes.length} quizzes
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span>Level: {module.level}</span>
                          <span>•</span>
                          <span>Duration: {module.estimated_duration} mins</span>
                          <span>•</span>
                          <Badge variant={module.is_published ? 'default' : 'secondary'} className="text-xs">
                            {module.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/courses/${params.id}/modules/${module.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No modules created yet</p>
                  <Button onClick={handleManageModules}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Module
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course && course._count ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Enrollments</span>
                    </div>
                    <span className="font-semibold">{course._count.enrollments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Completions</span>
                    </div>
                    <span className="font-semibold">{course._count.completions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>Modules</span>
                    </div>
                    <span className="font-semibold">{course.modules?.length || 0}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <FaSpinner className="w-4 h-4 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Loading statistics...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Base Price</span>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold">{course.base_price}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Pricing Period</span>
                <Badge variant="outline">{formatDisplayLabel(course.pricingPeriod)}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Max Students</span>
                <span className="font-semibold">{course.maxStudents}</span>
              </div>
            </CardContent>
          </Card>

          {/* Related Information */}
          <Card>
            <CardHeader>
              <CardTitle>Related Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Institution</h4>
                <Button
                  variant="link"
                  className="p-0 h-auto text-left"
                  onClick={handleViewInstitution}
                >
                  {course.institution.name}
                </Button>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Category</h4>
                <Button
                  variant="link"
                  className="p-0 h-auto text-left"
                  onClick={handleViewCategory}
                >
                  {course.category.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
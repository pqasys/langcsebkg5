'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, LayoutGrid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import CategorySelect from '@/components/CategorySelect';
import { CourseTagManager } from '@/components/CourseTagManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getFrameworkLevels, getFrameworkInfo, type Framework, frameworkMappings } from '@/lib/framework-utils';
import { Label } from '@/components/ui/label';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  level: string;
  status: string;
  categoryId: string;
  subcategoryId: string | null;
  departmentId: string | null;
  startDate: string;
  endDate: string;
  maxStudents: number;
  _count: {
    bookings: number;
  };
  coursetag?: {
    tag: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    }
  }[];
}

interface Institution {
  id: string;
  name: string;
  courses: Course[];
}

interface Department {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function InstitutionCoursesPage() {
  const params = useParams();
  const router = useRouter();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: '0',
    duration: '',
    level: 'A1',
    framework: 'CEFR',
    status: 'draft',
    categoryId: '',
    startDate: '',
    endDate: '',
    maxStudents: '15',
    tags: []
  });

  useEffect(() => {
    fetchInstitution();
    fetchCategories();
  }, [params.id]);

  const fetchInstitution = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/institutions/${params.id}/courses`);
      if (!response.ok) {
        throw new Error('Failed to fetch institution courses');
      }
      const data = await response.json();
      setInstitution({
        id: data.id,
        name: data.name,
        courses: Array.isArray(data.courses) ? data.courses : []
      });
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load institution courses:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch institution courses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Calculate duration in weeks based on start and end dates
  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) return '';
    
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const weeksDiff = Math.ceil(daysDiff / 7);
    
    return weeksDiff.toString();
  };

  // Update form data with automatic duration calculation
  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Calculate duration if start or end date changed
      if (updates.startDate || updates.endDate) {
        const newStartDate = updates.startDate || prev.startDate;
        const newEndDate = updates.endDate || prev.endDate;
        newData.duration = calculateDuration(newStartDate, newEndDate);
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.base_price),
        duration: parseInt(formData.duration),
        maxStudents: parseInt(formData.maxStudents),
        tags: formData.tags.map(tag => ({
          id: tag.id,
          name: tag.name
        }))
      };

      const response = await fetch(
        `/api/admin/institutions/${params.id}/courses${editingCourse ? `/${editingCourse.id}` : ''}`,
        {
          method: editingCourse ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save course');
      }

      await fetchInstitution();
      setIsDialogOpen(false);
      setEditingCourse(null);
      setFormData({
        title: '',
        description: '',
        base_price: '0',
        duration: '',
        level: 'A1',
        framework: 'CEFR',
        status: 'draft',
        categoryId: '',
        startDate: '',
        endDate: '',
        maxStudents: '15',
        tags: []
      });
      toast.success(`Course ${editingCourse ? 'updated' : 'created'} successfully`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to saving course:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to save course');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      base_price: course.price.toString(),
      duration: course.duration.toString(),
      level: course.level,
      status: course.status,
      categoryId: course.categoryId,
      startDate: course.startDate,
      endDate: course.endDate,
      maxStudents: course.maxStudents.toString(),
      tags: course.coursetag?.map(ct => ({
        id: ct.tag.id,
        name: ct.tag.name
      })) || []
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      
      await fetchInstitution();
      toast.success('Course deleted successfully');
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to deleting course:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete course');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!institution) {
    return <div className="text-center py-8">Institution not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Courses for {institution.name}</h1>
          <p className="text-gray-500">Manage courses for this institution</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-10 w-10"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-10 w-10"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingCourse(null);
                setFormData({
                  title: '',
                  description: '',
                  base_price: '0',
                  duration: '',
                  level: 'A1',
                  framework: 'CEFR',
                  status: 'draft',
                  categoryId: '',
                  startDate: '',
                  endDate: '',
                  maxStudents: '15',
                  tags: []
                });
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Category</label>
                    <CategorySelect
                      value={formData.categoryId}
                      onChange={(value) => setFormData({ ...formData, categoryId: value })}
                      className="bg-white"
                      categories={categories}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Framework</label>
                    <Select
                      value={formData.framework}
                      onValueChange={(value) => {
                        const framework = value as Framework;
                        setFormData({ 
                          ...formData, 
                          framework,
                          level: getFrameworkLevels(framework)[0].value 
                        });
                      }}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {Object.entries(frameworkMappings).map(([value, info]) => (
                          <SelectItem key={value} value={value}>
                            {info.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {getFrameworkInfo(formData.framework).description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Level</label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {getFrameworkLevels(formData.framework).map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Price</label>
                    <Input
                      type="number"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      required
                      className="bg-white w-32"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Duration (weeks)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      placeholder="Calculated from start/end dates"
                      required
                      readOnly
                      className="bg-gray-50 cursor-not-allowed w-32"
                    />
                    <p className="text-xs text-gray-400 mt-1">Auto-calculated</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value.toUpperCase() })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">DRAFT</SelectItem>
                        <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                        <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateFormData({ startDate: e.target.value })}
                      required
                      className="bg-white w-34"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateFormData({ endDate: e.target.value })}
                      required
                      className="bg-white w-34"
                      min={formData.startDate}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-normal text-gray-600 mb-1">Max Students</label>
                    <Input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                      required
                      min="1"
                      className="bg-white w-24"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-normal text-gray-600 mb-1">Tags</label>
                  <CourseTagManager
                    courseId={editingCourse?.id.toString() || 'new'}
                    initialTags={formData.tags}
                    onTagsUpdate={(tags) => setFormData({ ...formData, tags })}
                  />
                </div>

                <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {institution.courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                    <div className="mt-2 flex gap-4 text-sm text-gray-500">
                      <span>${course.price}</span>
                      <span>{course.duration} weeks</span>
                      <span className="capitalize">{course.level}</span>
                      <span className="capitalize">{course.status}</span>
                      <span>{course._count.bookings} bookings</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {course.coursetag?.map((ct) => (
                        <Badge
                          key={ct.tag.id}
                          variant="secondary"
                          style={{
                            backgroundColor: ct.tag.color || undefined,
                            color: ct.tag.color ? '#fff' : undefined
                          }}
                        >
                          {ct.tag.icon && <span className="mr-1">{ct.tag.icon}</span>}
                          {ct.tag.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course)}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institution.courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium line-clamp-2">{course.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course)}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{course.description}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>${course.price}</span>
                  <span>{course.duration} weeks</span>
                  <span className="capitalize">{course.level}</span>
                  <span className="capitalize">{course.status}</span>
                  <span>{course._count.bookings} bookings</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {course.coursetag?.map((ct) => (
                    <Badge
                      key={ct.tag.id}
                      variant="secondary"
                      style={{
                        backgroundColor: ct.tag.color || undefined,
                        color: ct.tag.color ? '#fff' : undefined
                      }}
                    >
                      {ct.tag.icon && <span className="mr-1">{ct.tag.icon}</span>}
                      {ct.tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
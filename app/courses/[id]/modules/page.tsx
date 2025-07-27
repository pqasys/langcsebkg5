'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  BookOpen, 
  CheckCircle, 
  Lock,
  Calendar,
  Users,
  Target,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface Module {
  id: string
  title: string
  description: string
  duration: number
  order: number
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  progress?: number
  startDate?: string
  endDate?: string
  skills?: string[]
  prerequisites?: string[]
}

interface Course {
  id: string
  title: string
  description: string
  institution: {
    name: string
  }
}

export default function CourseModules({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${params.id}`)
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course details')
        }
        const courseData = await courseResponse.json()
        setCourse(courseData)

        // Fetch modules for this course
        const modulesResponse = await fetch(`/api/courses/${params.id}/modules`)
        if (!modulesResponse.ok) {
          // If modules endpoint doesn't exist, create sample modules
          console.log('Modules endpoint not found, using sample data')
          const sampleModules: Module[] = [
            {
              id: '1',
              title: 'Introduction to the Course',
              description: 'Welcome to the course! This module will introduce you to the learning objectives and course structure.',
              duration: 30,
              order: 1,
              status: 'NOT_STARTED'
            },
            {
              id: '2',
              title: 'Basic Concepts and Fundamentals',
              description: 'Learn the foundational concepts that will be essential for your learning journey.',
              duration: 45,
              order: 2,
              status: 'NOT_STARTED'
            },
            {
              id: '3',
              title: 'Practical Applications',
              description: 'Apply what you\'ve learned through hands-on exercises and real-world examples.',
              duration: 60,
              order: 3,
              status: 'NOT_STARTED'
            },
            {
              id: '4',
              title: 'Advanced Topics',
              description: 'Dive deeper into advanced concepts and techniques.',
              duration: 90,
              order: 4,
              status: 'NOT_STARTED'
            },
            {
              id: '5',
              title: 'Final Assessment and Review',
              description: 'Review all concepts and complete the final assessment to demonstrate your understanding.',
              duration: 45,
              order: 5,
              status: 'NOT_STARTED'
            }
          ]
          setModules(sampleModules)
        } else {
          const modulesData = await modulesResponse.json()
          setModules(modulesData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        toast.error('Failed to load course modules')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleStartModule = (moduleId: string) => {
    // For now, just show a toast message
    toast.success('Module started! This feature will be implemented soon.')
  }

  const handleBackToCourse = () => {
    router.push(`/courses/${params.id}`)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'IN_PROGRESS':
        return <Play className="w-5 h-5 text-blue-600" />
      default:
        return <Lock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'IN_PROGRESS':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      default:
        return <Badge variant="secondary">Not Started</Badge>
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course modules...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The course you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBackToCourse}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="mt-1 text-sm text-gray-500">
                  {course.institution?.name || 'Institution not available'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {modules.length} Modules
                </div>
                <div className="text-sm text-gray-500">
                  Total Duration: {formatDuration(modules.reduce((acc, module) => acc + module.duration, 0))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress Overview */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Course Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {modules.filter(m => m.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {modules.filter(m => m.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {modules.filter(m => m.status === 'NOT_STARTED').length}
              </div>
              <div className="text-sm text-gray-500">Not Started</div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
          
          {modules.map((module, index) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(module.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">
                          Module {module.order}: {module.title}
                        </CardTitle>
                        {getStatusBadge(module.status)}
                      </div>
                      <p className="text-gray-600 mb-3">{module.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDuration(module.duration)}
                        </div>
                        {module.skills && module.skills.length > 0 && (
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            {module.skills.length} skills
                          </div>
                        )}
                      </div>

                      {module.progress !== undefined && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Button
                      onClick={() => handleStartModule(module.id)}
                      disabled={module.status === 'COMPLETED'}
                      className="ml-4"
                    >
                      {module.status === 'COMPLETED' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : module.status === 'IN_PROGRESS' ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {modules.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Modules Available</h3>
            <p className="text-gray-600 mb-4">
              This course doesn't have any modules yet. Check back later for updates.
            </p>
            <Button onClick={handleBackToCourse}>
              Back to Course
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 
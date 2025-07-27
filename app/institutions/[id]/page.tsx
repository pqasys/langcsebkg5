'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FaMapMarkerAlt, FaGlobe, FaPhone, FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import { InstitutionHeroImage, InstitutionLogoImage, FacilityImage } from '@/components/ui/image-container'
import { toast } from 'sonner';

interface Institution {
  id: string
  name: string
  description: string
  country: string
  city: string
  logo?: string
  mainImage?: string
  website?: string
  phone?: string
  email?: string
  facilities?: string[]
  courses: {
    id: string
    title: string
    description: string
    base_price: number
    duration: number
    level: string
    status: string
  }[]
}

export default function InstitutionDetails() {
  const params = useParams()
  const router = useRouter()
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`/api/institutions/${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Institution not found')
          } else {
            throw new Error(`Failed to fetch institution details - Context: throw new Error('Failed to fetch institution detai...`)
          }
        } else {
          const data = await response.json()
          
          // Normalize facilities to ensure it's always an array
          const institutionData = {
            ...data,
            facilities: Array.isArray(data.facilities) ? data.facilities : []
          };
          
          setInstitution(institutionData)
        }
      } catch (error) {
        console.error('Error fetching institution:', error)
        setError('Failed to load institution details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchInstitution()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !institution) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Institution Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The institution you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/institutions')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaArrowLeft className="mr-2" />
              Back to Institutions
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/institutions')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <FaArrowLeft className="mr-2" />
            Back to Institutions
          </button>
        </div>

        {/* Hero Section with Main Image */}
        <div className="relative mb-8 rounded-lg overflow-hidden">
          <InstitutionHeroImage
            src={institution.mainImage || ''}
            alt={`${institution.name} hero image`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{institution.name}</h1>
            <div className="flex items-center text-white/90">
              <FaMapMarkerAlt className="mr-2" />
              <span>{institution.city}, {institution.country}</span>
            </div>
          </div>
        </div>

        {/* Institution Header */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24">
                <InstitutionLogoImage
                  src={institution.logo || ''}
                  alt={`${institution.name} logo`}
                />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">About</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <FaMapMarkerAlt className="mr-2" />
                <span>{institution.city}, {institution.country}</span>
              </div>
              {institution.website && mounted && (
                <div className="flex items-center text-gray-600 mb-2">
                  <FaGlobe className="mr-2" />
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {institution.website}
                  </a>
                </div>
              )}
              {institution.phone && mounted && (
                <div className="flex items-center text-gray-600 mb-2">
                  <FaPhone className="mr-2" />
                  <span>{institution.phone}</span>
                </div>
              )}
              {institution.email && mounted && (
                <div className="flex items-center text-gray-600 mb-2">
                  <FaEnvelope className="mr-2" />
                  <a
                    href={`mailto:${institution.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {institution.email}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{institution.description}</p>
          </div>
        </div>

        {/* Facilities Gallery */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Facilities</h2>
          {institution.facilities && institution.facilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {institution.facilities.map((facility, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <FacilityImage
                    src={facility}
                    alt={`${institution.name} facility ${index + 1}`}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">No facility images available</p>
              <p className="text-sm text-gray-400">Institution can add facility photos to showcase their campus</p>
            </div>
          )}
        </div>

        {/* Courses Section */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Courses ({institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').length || 0})
          </h2>
          
          {institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').length > 0 ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {institution.courses?.filter(course => course.status === 'ACTIVE' || course.status === 'PUBLISHED').map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {course.level}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{course.duration} weeks</span>
                    <span className="text-lg font-semibold text-blue-600">
                      ${course.base_price}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Course
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No courses available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'organization' | 'course' | 'institution' | 'breadcrumb' | 'faq' | 'website';
  data: unknown;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // Remove any existing structured data with the same type
    const existingScript = document.querySelector(`script[data-structured-data="${type}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-structured-data', type);
    script.textContent = JSON.stringify(data);

    // Add to head
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector(`script[data-structured-data="${type}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}

// Helper functions to generate structured data
export function generateOrganizationData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FluentShip',
    url: 'https://fluentship.com',
    logo: 'https://fluentship.com/images/fluentship-logo.png',
    description: 'Learn together. Speak with confidence. Join FluentShip\'s community-powered language learning journey.',
    sameAs: [
      'https://twitter.com/fluentship',
      'https://facebook.com/fluentship',
      'https://linkedin.com/company/fluentship',
      'https://instagram.com/fluentship'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      email: 'support@fluentship.com',
      availableLanguage: ['English', 'Spanish', 'French']
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressLocality: 'San Francisco',
      addressRegion: 'CA'
    },
    founder: [
      {
        '@type': 'Person',
        name: 'Dr. Sarah Chen',
        jobTitle: 'CEO & Co-Founder',
        description: 'Former linguistics professor with 15+ years in language education technology.'
      },
      {
        '@type': 'Person',
        name: 'Marcus Rodriguez',
        jobTitle: 'CTO & Co-Founder',
        description: 'Tech veteran with expertise in AI-powered learning platforms and edtech solutions.'
      }
    ],
    foundingDate: '2020',
    numberOfEmployees: '50-100',
    industry: 'Education Technology',
    knowsAbout: [
      'Language Learning',
      'Online Education',
      'AI-Powered Learning',
      'International Education',
      'Language Assessment',
      'Educational Technology',
      'Community Learning',
      'Language Friendship'
    ],
    award: [
      'Best Language Learning Platform - EdTech Digest 2024',
      'Top 10 EdTech Companies - Forbes 2023'
    ]
  };
}

export function generateCourseData(course: unknown) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.institution?.name || 'Fluentish',
      url: `https://fluentish.com/institutions/${course.institution?.id}`,
      sameAs: 'https://fluentish.com'
    },
    courseMode: 'online',
    educationalLevel: course.level,
    timeRequired: `PT${course.duration}H`,
    dateCreated: course.createdAt,
    dateModified: course.updatedAt,
    startDate: course.startDate,
    endDate: course.endDate,
    offers: {
      '@type': 'Offer',
      price: course.base_price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: course.startDate,
      validThrough: course.endDate,
      seller: {
        '@type': 'Organization',
        name: course.institution?.name || 'Fluentish'
      }
    },
    coursePrerequisites: course.prerequisites || 'No prerequisites required',
    educationalCredentialAwarded: course.certificate || 'Course Completion Certificate',
    teaches: course.language || 'Language Skills',
    inLanguage: course.language || 'English',
    audience: {
      '@type': 'Audience',
      audienceType: course.level === 'BEGINNER' ? 'Beginner Language Learners' : 
                   course.level === 'INTERMEDIATE' ? 'Intermediate Language Learners' : 
                   'Advanced Language Learners'
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      maximumAttendeeCapacity: course.maxStudents,
      startDate: course.startDate,
      endDate: course.endDate
    }
  };
}

export function generateInstitutionData(institution: unknown) {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: institution.name,
    description: institution.description,
    url: `https://fluentish.com/institutions/${institution.id}`,
    logo: institution.logo || 'https://fluentish.com/images/default-institution-logo.png',
    address: {
      '@type': 'PostalAddress',
      addressCountry: institution.country,
      addressLocality: institution.city,
      addressRegion: institution.state
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: institution.phone,
      email: institution.email,
      contactType: 'customer service'
    },
    sameAs: institution.website ? [institution.website] : [],
    foundingDate: institution.foundedYear,
    numberOfEmployees: institution.employeeCount,
    knowsAbout: [
      'Language Education',
      'International Education',
      'Language Assessment',
      'Cultural Exchange'
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Language Courses',
      itemListElement: institution.courses?.map((course: unknown) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: course.title,
          description: course.description
        }
      })) || []
    }
  };
}

export function generateBreadcrumbData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
}

export function generateWebsiteData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Fluentish',
    url: 'https://fluentish.com',
    description: 'Transform your language learning journey with Fluentish. Access comprehensive courses, native speakers, and personalized learning paths.',
    publisher: {
      '@type': 'Organization',
      name: 'Fluentish',
      url: 'https://fluentish.com'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://fluentish.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: ['en', 'es', 'fr'],
    isAccessibleForFree: true,
    hasPart: [
      {
        '@type': 'WebPage',
        name: 'Courses',
        url: 'https://fluentish.com/courses',
        description: 'Browse and enroll in language courses from top institutions'
      },
      {
        '@type': 'WebPage',
        name: 'Institutions',
        url: 'https://fluentish.com/institutions',
        description: 'Partner with language institutions worldwide'
      },
      {
        '@type': 'WebPage',
        name: 'About',
        url: 'https://fluentish.com/about',
        description: 'Learn about Fluentish and our mission'
      }
    ]
  };
}

export function generateFAQData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
} 
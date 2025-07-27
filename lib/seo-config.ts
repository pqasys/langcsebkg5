import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    type: string;
    url: string;
    siteName: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    locale: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator: string;
    site: string;
  };
  robots: {
    index: boolean;
    follow: boolean;
    googleBot: {
      index: boolean;
      follow: boolean;
      'max-video-preview': string;
      'max-image-preview': string;
      'max-snippet': string;
    };
  };
  alternates: {
    canonical: string;
    languages: Record<string, string>;
  };
  verification: {
    google: string;
    yandex: string;
    bing: string;
  };
  other: Record<string, string>;
}

// Base SEO configuration
const baseConfig: Partial<SEOConfig> = {
  openGraph: {
    siteName: 'Fluentish',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/fluentish-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fluentish - Language Learning Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@fluentish',
    site: '@fluentish'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': '-1',
      'max-image-preview': 'large',
      'max-snippet': '-1'
    }
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code'
  }
};

// Page-specific SEO configurations
export const seoConfigs: Record<string, SEOConfig> = {
  home: {
    title: 'FluentShip - Where fluency meets friendship',
    description: 'Learn together. Speak with confidence. Join FluentShip\'s community-powered language learning journey with native speakers and personalized learning paths.',
    keywords: [
      'language learning',
      'online courses',
      'interactive learning',
      'native speakers',
      'language platform',
      'fluentship',
      'learn languages online',
      'language courses',
      'speaking practice',
      'language education',
      'community learning',
      'language friendship'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'FluentShip - Where fluency meets friendship',
      description: 'Learn together. Speak with confidence. Join FluentShip\'s community-powered language learning journey.',
      url: 'https://fluentship.com',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'FluentShip - Where fluency meets friendship',
      description: 'Learn together. Speak with confidence. Join FluentShip\'s community-powered language learning journey.',
      images: ['/images/fluentship-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentship.com',
      languages: {
        'en': 'https://fluentship.com',
        'es': 'https://fluentship.com/es',
        'fr': 'https://fluentship.com/fr'
      }
    },
    other: {
      'application-name': 'FluentShip',
      'apple-mobile-web-app-title': 'FluentShip',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-TileColor': '#0077b6',
      'theme-color': '#0077b6'
    }
  },

  courses: {
    title: 'Language Courses - Browse & Enroll in Interactive Learning Programs | Fluentish',
    description: 'Discover hundreds of language courses from top institutions. Filter by level, language, price, and more. Find your perfect learning path with Fluentish.',
    keywords: [
      'language courses',
      'online language learning',
      'language classes',
      'foreign language courses',
      'language education',
      'interactive courses',
      'language learning programs',
      'course enrollment',
      'language schools',
      'learning platforms'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'Language Courses - Browse & Enroll in Interactive Learning Programs',
      description: 'Discover hundreds of language courses from top institutions. Filter by level, language, price, and more.',
      url: 'https://fluentish.com/courses',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'Language Courses - Browse & Enroll in Interactive Learning Programs',
      description: 'Discover hundreds of language courses from top institutions. Filter by level, language, price, and more.',
      images: ['/images/courses-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentish.com/courses',
      languages: {}
    },
    other: {}
  },

  institutions: {
    title: 'Language Schools & Institutions - Partner with Fluentish',
    description: 'Join Fluentish as a language institution. Reach global students, manage courses efficiently, and grow your language teaching business with our comprehensive platform.',
    keywords: [
      'language schools',
      'language institutions',
      'teaching platform',
      'language education partners',
      'institution registration',
      'language teaching business',
      'course management',
      'student enrollment',
      'language education platform',
      'teaching partnerships'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'Language Schools & Institutions - Partner with Fluentish',
      description: 'Join Fluentish as a language institution. Reach global students, manage courses efficiently, and grow your language teaching business.',
      url: 'https://fluentish.com/institutions',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'Language Schools & Institutions - Partner with Fluentish',
      description: 'Join Fluentish as a language institution. Reach global students, manage courses efficiently, and grow your language teaching business.',
      images: ['/images/institutions-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentish.com/institutions',
      languages: {}
    },
    other: {}
  },

  about: {
    title: 'About Fluentish - Our Mission to Transform Language Learning',
    description: 'Learn about Fluentish\'s mission to make language learning accessible, interactive, and effective. Discover our story, values, and commitment to global education.',
    keywords: [
      'about fluentish',
      'language learning mission',
      'education technology',
      'global learning',
      'language education platform',
      'interactive learning',
      'educational innovation',
      'language learning technology',
      'online education',
      'learning platform'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'About Fluentish - Our Mission to Transform Language Learning',
      description: 'Learn about Fluentish\'s mission to make language learning accessible, interactive, and effective.',
      url: 'https://fluentish.com/about',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'About Fluentish - Our Mission to Transform Language Learning',
      description: 'Learn about Fluentish\'s mission to make language learning accessible, interactive, and effective.',
      images: ['/images/about-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentish.com/about',
      languages: {}
    },
    other: {}
  },

  features: {
    title: 'Fluentish Features - Advanced Language Learning Tools & Capabilities',
    description: 'Explore Fluentish\'s powerful features: interactive lessons, AI-powered feedback, progress tracking, native speaker connections, and comprehensive learning analytics.',
    keywords: [
      'language learning features',
      'interactive lessons',
      'AI language learning',
      'progress tracking',
      'native speakers',
      'learning analytics',
      'language tools',
      'speaking practice',
      'learning technology',
      'educational features'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'Fluentish Features - Advanced Language Learning Tools & Capabilities',
      description: 'Explore Fluentish\'s powerful features: interactive lessons, AI-powered feedback, progress tracking, and more.',
      url: 'https://fluentish.com/features',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'Fluentish Features - Advanced Language Learning Tools & Capabilities',
      description: 'Explore Fluentish\'s powerful features: interactive lessons, AI-powered feedback, progress tracking, and more.',
      images: ['/images/features-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentish.com/features',
      languages: {}
    },
    other: {}
  },

  pricing: {
    title: 'Fluentish Pricing - Affordable Language Learning Plans & Packages',
    description: 'Choose from flexible pricing plans designed for students and institutions. Transparent pricing with no hidden fees. Start learning today with our competitive rates.',
    keywords: [
      'language learning pricing',
      'course pricing',
      'learning plans',
      'affordable education',
      'pricing packages',
      'subscription plans',
      'course costs',
      'educational pricing',
      'learning investment',
      'value for money'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'Fluentish Pricing - Affordable Language Learning Plans & Packages',
      description: 'Choose from flexible pricing plans designed for students and institutions. Transparent pricing with no hidden fees.',
      url: 'https://fluentish.com/pricing',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'Fluentish Pricing - Affordable Language Learning Plans & Packages',
      description: 'Choose from flexible pricing plans designed for students and institutions. Transparent pricing with no hidden fees.',
      images: ['/images/pricing-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentish.com/pricing',
      languages: {}
    },
    other: {}
  },

  contact: {
    title: 'Contact Fluentish - Get Support & Connect With Our Team',
    description: 'Get in touch with the Fluentish team. We\'re here to help with your language learning journey, technical support, partnerships, and any questions you may have.',
    keywords: [
      'contact fluentish',
      'language learning support',
      'customer service',
      'technical support',
      'help desk',
      'contact information',
      'support team',
      'customer care',
      'inquiry',
      'assistance'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'Contact Fluentish - Get Support & Connect With Our Team',
      description: 'Get in touch with the Fluentish team. We\'re here to help with your language learning journey and any questions.',
      url: 'https://fluentish.com/contact',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'Contact Fluentish - Get Support & Connect With Our Team',
      description: 'Get in touch with the Fluentish team. We\'re here to help with your language learning journey and any questions.',
      images: ['/images/contact-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentish.com/contact',
      languages: {}
    },
    other: {}
  },

  search: {
    title: 'Advanced Course Search - Find Your Perfect Language Learning Path | Fluentish',
    description: 'Use our advanced search to find the perfect language course. Filter by language, level, price, duration, and more. Discover courses that match your learning goals.',
    keywords: [
      'course search',
      'language course finder',
      'advanced search',
      'course filtering',
      'language learning search',
      'course discovery',
      'search courses',
      'find language courses',
      'course matching',
      'learning path finder'
    ],
    openGraph: {
      ...baseConfig.openGraph!,
      title: 'Advanced Course Search - Find Your Perfect Language Learning Path',
      description: 'Use our advanced search to find the perfect language course. Filter by language, level, price, duration, and more.',
      url: 'https://fluentish.com/search',
      type: 'website'
    },
    twitter: {
      ...baseConfig.twitter!,
      title: 'Advanced Course Search - Find Your Perfect Language Learning Path',
      description: 'Use our advanced search to find the perfect language course. Filter by language, level, price, duration, and more.',
      images: ['/images/search-og-image.jpg']
    },
    alternates: {
      canonical: 'https://fluentish.com/search',
      languages: {}
    },
    other: {}
  }
};

// Function to generate metadata from SEO config
export function generateMetadata(config: SEOConfig, pathname: string = ''): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fluentish.com';
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    authors: [{ name: 'Fluentish Team' }],
    creator: 'Fluentish',
    publisher: 'Fluentish',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: config.alternates.canonical,
      languages: config.alternates.languages,
    },
    openGraph: {
      title: config.openGraph.title,
      description: config.openGraph.description,
      url: config.openGraph.url,
      siteName: config.openGraph.siteName,
      images: config.openGraph.images,
      locale: config.openGraph.locale,
      type: config.openGraph.type,
    },
    twitter: {
      card: config.twitter.card,
      title: config.twitter.title,
      description: config.twitter.description,
      images: config.twitter.images,
      creator: config.twitter.creator,
      site: config.twitter.site,
    },
    robots: config.robots,
    verification: config.verification,
    other: config.other,
  };
}

// Function to get SEO config by page name
export function getSEOConfig(pageName: string): SEOConfig {
  return seoConfigs[pageName] || seoConfigs.home;
}

// Function to generate structured data for courses
export function generateCourseStructuredData(course: unknown) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.institution?.name || 'Fluentish',
      sameAs: 'https://fluentish.com'
    },
    courseMode: 'online',
    educationalLevel: course.level,
    timeRequired: `PT${course.duration}H`,
    offers: {
      '@type': 'Offer',
      price: course.base_price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    startDate: course.startDate,
    endDate: course.endDate
  };
}

// Function to generate structured data for organization
export function generateOrganizationStructuredData() {
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
      'https://linkedin.com/company/fluentship'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      email: 'support@fluentship.com'
    }
  };
} 
import { Metadata } from 'next';
import { Suspense } from 'react';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import CoursesPageClient from '@/components/CoursesPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('courses'));

export default function CoursesPage() {
  return (
    <Suspense fallback={<div>Loading courses...</div>}>
      <CoursesPageClient />
    </Suspense>
  );
}
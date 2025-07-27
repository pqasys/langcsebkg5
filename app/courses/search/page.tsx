import { Metadata } from 'next';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import SearchPageClient from '@/components/SearchPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('courses-search'));

export default function CoursesSearchPage() {
  return <SearchPageClient />;
} 
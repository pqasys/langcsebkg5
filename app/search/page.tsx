import { Metadata } from 'next';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import SearchPageClient from '@/components/SearchPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('search'));

export default function SearchPage() {
  return <SearchPageClient />;
} 
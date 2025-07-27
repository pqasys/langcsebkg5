import { Metadata } from 'next';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import AboutPageClient from '@/components/AboutPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('about'));

export default function AboutPage() {
  return <AboutPageClient />;
} 
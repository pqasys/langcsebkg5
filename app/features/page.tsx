import { Metadata } from 'next';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import FeaturesPageClient from '@/components/FeaturesPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('features'));

export default function FeaturesPage() {
  return <FeaturesPageClient />;
} 
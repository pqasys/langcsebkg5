import { Metadata } from 'next';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import InstitutionsPageClient from '@/components/InstitutionsPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('institutions'));

export default function InstitutionsPage() {
  return <InstitutionsPageClient />;
} 
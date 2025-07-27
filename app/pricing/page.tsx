import { Metadata } from 'next';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import PricingPageClient from '@/components/PricingPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('pricing'));

export default function PricingPage() {
  return <PricingPageClient />;
} 
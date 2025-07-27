import { Metadata } from 'next';
import { getSEOConfig, generateMetadata } from '@/lib/seo-config';
import ContactPageClient from '@/components/ContactPageClient';

export const metadata: Metadata = generateMetadata(getSEOConfig('contact'));

export default function ContactPage() {
  return <ContactPageClient />;
} 
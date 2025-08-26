import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';

// This is a simplified version - you might want to use a proper location database or API
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  // Add more countries as needed
];

const statesByCountry: Record<string, { code: string; name: string }[]> = {
  US: [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    // Add more states
  ],
  GB: [
    { code: 'ENG', name: 'England' },
    { code: 'SCT', name: 'Scotland' },
    { code: 'WLS', name: 'Wales' },
    { code: 'NIR', name: 'Northern Ireland' },
  ],
  // Add more countries and their states
};

const citiesByState: Record<string, { code: string; name: string }[]> = {
  'US-CA': [
    { code: 'SF', name: 'San Francisco' },
    { code: 'LA', name: 'Los Angeles' },
    { code: 'SD', name: 'San Diego' },
  ],
  'US-NY': [
    { code: 'NYC', name: 'New York City' },
    { code: 'BUF', name: 'Buffalo' },
    { code: 'ALB', name: 'Albany' },
  ],
  // Add more states and their cities
};

export async function GET(request: Request) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const countryCode = searchParams.get('countryCode');
    const stateCode = searchParams.get('stateCode');

    switch (type) {
      case 'countries':
        return NextResponse.json(countries);
      
      case 'states':
        if (!countryCode) {
          return NextResponse.json({ error: 'Country code is required' }, { status: 400 });
        }
        return NextResponse.json(statesByCountry[countryCode] || []);
      
      case 'cities':
        if (!countryCode || !stateCode) {
          return NextResponse.json({ error: 'Country code and state code are required' }, { status: 400 });
        }
        const key = `${countryCode}-${stateCode}`;
        return NextResponse.json(citiesByState[key] || []);
      
      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching location data:');
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 
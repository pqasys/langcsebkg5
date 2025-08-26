import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isBuildTime } from '@/lib/build-time';

export const dynamic = 'force-dynamic';

// Diversity categories for balanced selection
interface DiversityCategory {
  id: string;
  name: string;
  avatar: string;
  location: string;
  languages: string[];
  level: string;
  interests: string[];
  diversityScore: number;
}

// GET /api/community/members?limit=4&refresh=true
export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '4', 10), 10);
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Fetch a larger pool of active students for diversity selection
    const poolSize = Math.max(limit * 3, 20); // Get 3x the needed amount for better diversity
    const allMembers = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        status: 'ACTIVE',
        // Note: We'll need to add a field for profile visibility later
        // For now, we'll show all active students
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        // We'll add more fields as they become available in the database
      },
      orderBy: {
        updatedAt: 'desc', // Show recently active users first
      },
      take: poolSize,
    });

    // Apply diversity-based selection algorithm
    const selectedMembers = selectDiverseMembers(allMembers, limit, forceRefresh);

    // Transform the data to match the expected format
    const transformedMembers = selectedMembers.map((member, index) => ({
      id: member.id,
      name: member.name || 'Anonymous User',
      avatar: member.image || '',
      location: getPlaceholderLocation(index), // Placeholder until we have real location data
      languages: getPlaceholderLanguages(index), // Placeholder until we have real language data
      level: getPlaceholderLevel(index), // Placeholder until we have real level data
      interests: getPlaceholderInterests(index), // Placeholder until we have real interest data
      isOnline: Math.random() > 0.5, // Random online status for now
      lastActive: getPlaceholderLastActive(member.updatedAt),
      mutualConnections: Math.floor(Math.random() * 8) + 1, // Random connection count
      achievements: Math.floor(Math.random() * 20) + 1, // Random achievement count
      isRealUser: true, // Flag to indicate this is a real user
    }));

    return NextResponse.json(transformedMembers);
  } catch (error) {
    console.error('Error fetching community members:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// Diversity-based selection algorithm
function selectDiverseMembers(members: any[], limit: number, forceRefresh: boolean): any[] {
  if (members.length <= limit) {
    return members;
  }

  // Create diversity categories based on placeholder diversity
  const diversityCategories = createDiversityCategories();
  
  // Get rotation state from a simple cache (in production, use Redis or database)
  const rotationState = getRotationState();
  
  // Assign diversity scores to members with rotation consideration
  const membersWithScores = members.map((member, index) => {
    const categoryIndex = (index + rotationState.offset) % diversityCategories.length;
    const category = diversityCategories[categoryIndex];
    
    return {
      ...member,
      diversityScore: category.diversityScore,
      assignedCategory: categoryIndex,
      // Add some randomness to prevent always selecting the same users
      randomFactor: Math.random(),
      // Consider recency for better engagement
      recencyScore: calculateRecencyScore(member.updatedAt),
      // Add rotation factor to ensure variety
      rotationFactor: (index + rotationState.offset) % members.length,
    };
  });

  // Sort by diversity score, recency, rotation factor, and random factor
  membersWithScores.sort((a, b) => {
    // Primary: Diversity score (higher is better)
    if (a.diversityScore !== b.diversityScore) {
      return b.diversityScore - a.diversityScore;
    }
    // Secondary: Recency score (more recent is better)
    if (a.recencyScore !== b.recencyScore) {
      return b.recencyScore - a.recencyScore;
    }
    // Tertiary: Rotation factor for variety
    if (a.rotationFactor !== b.rotationFactor) {
      return a.rotationFactor - b.rotationFactor;
    }
    // Quaternary: Random factor for final variety
    return b.randomFactor - a.randomFactor;
  });

  // Update rotation state for next selection
  if (forceRefresh) {
    updateRotationState(members.length, limit);
  }

  // Select the top members
  const selectedMembers = membersWithScores.slice(0, limit);

  return selectedMembers;
}

// Simple rotation state management (in production, use Redis or database)
let rotationState = {
  offset: 0,
  lastUpdate: Date.now(),
  memberCount: 0
};

function getRotationState() {
  return rotationState;
}

function updateRotationState(totalMembers: number, selectedLimit: number) {
  // Rotate through the member pool
  rotationState.offset = (rotationState.offset + selectedLimit) % Math.max(totalMembers, 1);
  rotationState.lastUpdate = Date.now();
  rotationState.memberCount = totalMembers;
}

// Create diversity categories matching placeholder diversity
function createDiversityCategories(): DiversityCategory[] {
  return [
    {
      id: 'category-1',
      name: 'Sarah Chen',
      avatar: '',
      location: 'Toronto, Canada',
      languages: ['English', 'Mandarin', 'Spanish'],
      level: 'B2',
      interests: ['Travel', 'Cooking', 'Photography'],
      diversityScore: 95 // High diversity: Asian-Canadian, multiple languages
    },
    {
      id: 'category-2',
      name: 'Miguel Rodriguez',
      avatar: '',
      location: 'Madrid, Spain',
      languages: ['Spanish', 'English', 'French'],
      level: 'C1',
      interests: ['Music', 'Sports', 'Technology'],
      diversityScore: 90 // High diversity: European, multiple Romance languages
    },
    {
      id: 'category-3',
      name: 'Emma Thompson',
      avatar: '',
      location: 'London, UK',
      languages: ['English', 'German', 'Italian'],
      level: 'B1',
      interests: ['Reading', 'Hiking', 'Art'],
      diversityScore: 85 // Good diversity: European, Germanic + Romance languages
    },
    {
      id: 'category-4',
      name: 'Yuki Tanaka',
      avatar: '',
      location: 'Tokyo, Japan',
      languages: ['Japanese', 'English', 'Korean'],
      level: 'A2',
      interests: ['Anime', 'Gaming', 'Cooking'],
      diversityScore: 92 // High diversity: Asian, East Asian languages
    },
    {
      id: 'category-5',
      name: 'Hans Mueller',
      avatar: '',
      location: 'Berlin, Germany',
      languages: ['German', 'English', 'French'],
      level: 'C1',
      interests: ['Photography', 'Travel', 'Languages'],
      diversityScore: 88 // Good diversity: European, Germanic + Romance
    },
    {
      id: 'category-6',
      name: 'Sophie Dubois',
      avatar: '',
      location: 'Paris, France',
      languages: ['French', 'English', 'Spanish'],
      level: 'B2',
      interests: ['Cooking', 'Music', 'Dance'],
      diversityScore: 87 // Good diversity: European, Romance languages
    },
    {
      id: 'category-7',
      name: 'Ahmed Hassan',
      avatar: '',
      location: 'Cairo, Egypt',
      languages: ['Arabic', 'English', 'French'],
      level: 'B1',
      interests: ['Sports', 'Technology', 'Reading'],
      diversityScore: 94 // High diversity: Middle Eastern, Arabic + European
    },
    {
      id: 'category-8',
      name: 'Maria Silva',
      avatar: '',
      location: 'São Paulo, Brazil',
      languages: ['Portuguese', 'English', 'Spanish'],
      level: 'B2',
      interests: ['Art', 'Photography', 'Travel'],
      diversityScore: 89 // Good diversity: South American, Romance languages
    },
    {
      id: 'category-9',
      name: 'Priya Patel',
      avatar: '',
      location: 'Mumbai, India',
      languages: ['Hindi', 'English', 'French'],
      level: 'C1',
      interests: ['Reading', 'Writing', 'Poetry'],
      diversityScore: 93 // High diversity: South Asian, Indic + European
    },
    {
      id: 'category-10',
      name: 'Alex Johnson',
      avatar: '',
      location: 'Sydney, Australia',
      languages: ['English', 'Chinese', 'Japanese'],
      level: 'B1',
      interests: ['Gaming', 'Anime', 'Technology'],
      diversityScore: 86 // Good diversity: Oceanic, English + Asian languages
    }
  ];
}

// Calculate recency score based on last activity
function calculateRecencyScore(updatedAt: Date): number {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60));
  
  // Higher score for more recent activity
  if (diffInHours < 1) return 100; // Just now
  if (diffInHours < 24) return 90; // Today
  if (diffInHours < 168) return 80; // This week
  if (diffInHours < 720) return 70; // This month
  if (diffInHours < 2160) return 60; // Last 3 months
  return 50; // Older
}

// Helper functions to generate placeholder data
function getPlaceholderLocation(index: number): string {
  const locations = [
    'Toronto, Canada',
    'Madrid, Spain',
    'London, UK',
    'Tokyo, Japan',
    'Berlin, Germany',
    'Paris, France',
    'Sydney, Australia',
    'New York, USA',
    'São Paulo, Brazil',
    'Mumbai, India'
  ];
  return locations[index % locations.length];
}

function getPlaceholderLanguages(index: number): string[] {
  const languageSets = [
    ['English', 'Mandarin', 'Spanish'],
    ['Spanish', 'English', 'French'],
    ['English', 'German', 'Italian'],
    ['Japanese', 'English', 'Korean'],
    ['German', 'English', 'French'],
    ['French', 'English', 'Spanish'],
    ['English', 'Chinese', 'Japanese'],
    ['English', 'Spanish', 'Portuguese'],
    ['Portuguese', 'English', 'Spanish'],
    ['Hindi', 'English', 'French']
  ];
  return languageSets[index % languageSets.length];
}

function getPlaceholderLevel(index: number): string {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  return levels[index % levels.length];
}

function getPlaceholderInterests(index: number): string[] {
  const interestSets = [
    ['Travel', 'Cooking', 'Photography'],
    ['Music', 'Sports', 'Technology'],
    ['Reading', 'Hiking', 'Art'],
    ['Anime', 'Gaming', 'Cooking'],
    ['Photography', 'Travel', 'Languages'],
    ['Cooking', 'Music', 'Dance'],
    ['Sports', 'Technology', 'Reading'],
    ['Art', 'Photography', 'Travel'],
    ['Gaming', 'Anime', 'Technology'],
    ['Reading', 'Writing', 'Poetry']
  ];
  return interestSets[index % interestSets.length];
}

function getPlaceholderLastActive(updatedAt: Date): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
}

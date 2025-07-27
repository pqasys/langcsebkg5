import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

const tags = [
  // Language Levels
  { name: 'Beginner', description: 'For students with no prior knowledge of the language' },
  { name: 'Elementary', description: 'For students with basic knowledge of the language' },
  { name: 'Intermediate', description: 'For students with moderate language proficiency' },
  { name: 'Upper Intermediate', description: 'For students with good language proficiency' },
  { name: 'Advanced', description: 'For students with high language proficiency' },
  { name: 'Mastery', description: 'For students with near-native language proficiency' },

  // Course Types
  { name: 'General', description: 'General language courses covering all aspects' },
  { name: 'Conversation', description: 'Focus on speaking and listening skills' },
  { name: 'Business', description: 'Business and professional language courses' },
  { name: 'Academic', description: 'Academic and research-oriented language courses' },
  { name: 'Exam Preparation', description: 'Courses preparing for language proficiency exams' },
  { name: 'Intensive', description: 'Fast-paced language learning programs' },
  { name: 'Extensive', description: 'Longer-term language learning programs' },

  // Delivery Methods
  { name: 'Online', description: 'Virtual language learning programs' },
  { name: 'In-Person', description: 'Traditional classroom-based learning' },
  { name: 'Hybrid', description: 'Combination of online and in-person learning' },
  { name: 'One-to-One', description: 'Individual private lessons' },
  { name: 'Group', description: 'Group learning environment' },

  // Schedule Types
  { name: 'Morning', description: 'Morning classes' },
  { name: 'Afternoon', description: 'Afternoon classes' },
  { name: 'Evening', description: 'Evening classes' },
  { name: 'Weekend', description: 'Weekend classes' },
  { name: 'Weekday', description: 'Weekday classes' },
  { name: 'Flexible', description: 'Flexible scheduling options' },

  // Learning Styles
  { name: 'Self-Paced', description: 'Learn at your own pace' },
  { name: 'Instructor-Led', description: 'Guided learning with an instructor' },
  { name: 'Project-Based', description: 'Learning through practical projects' },
  { name: 'Task-Based', description: 'Learning through specific tasks and activities' },
  { name: 'Communicative', description: 'Focus on real communication skills' },

  // Special Features
  { name: 'Cultural Immersion', description: 'Includes cultural activities and experiences' },
  { name: 'Study Abroad', description: 'Opportunity to study in a foreign country' },
  { name: 'Certification', description: 'Provides official certification upon completion' },
  { name: 'Job Placement', description: 'Includes job placement assistance' },
  { name: 'Internship', description: 'Includes internship opportunities' },

  // Age Groups
  { name: 'Children', description: 'Courses designed for young learners' },
  { name: 'Teenagers', description: 'Courses designed for teenagers' },
  { name: 'Adults', description: 'Courses designed for adult learners' },
  { name: 'Seniors', description: 'Courses designed for senior learners' },

  // Specializations
  { name: 'Medical', description: 'Language courses for medical professionals' },
  { name: 'Legal', description: 'Language courses for legal professionals' },
  { name: 'Technical', description: 'Technical language courses' },
  { name: 'Tourism', description: 'Language courses for tourism industry' },
  { name: 'Aviation', description: 'Language courses for aviation industry' }
];

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const results = {
      created: 0,
      skipped: 0,
      errors: 0,
      details: [] as { name: string; status: 'created' | 'skipped' | 'error'; message?: string }[]
    };

    for (const tag of tags) {
      try {
        const existingTag = await prisma.tag.findFirst({
          where: { name: tag.name }
        });

        if (!existingTag) {
          await prisma.tag.create({
            data: {
              id: uuidv4(),
              name: tag.name,
              slug: generateSlug(tag.name),
              description: tag.description,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          results.created++;
          results.details.push({ name: tag.name, status: 'created' });
        } else {
          results.skipped++;
          results.details.push({ name: tag.name, status: 'skipped' });
        }
      } catch (error) {
        console.error(`Error processing tag ${tag.name}:`, error);
        results.errors++;
        results.details.push({ 
          name: tag.name, 
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: 'Tag seeding completed',
      results,
      summary: {
        total: tags.length,
        created: results.created,
        skipped: results.skipped,
        errors: results.errors
      }
    });
  } catch (error) {
    console.error('Error seeding tags:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 
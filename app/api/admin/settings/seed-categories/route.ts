import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const categories = [
  {
    name: 'General Language',
    description: 'Comprehensive language courses covering all aspects of the target language',
    slug: 'general-language'
  },
  {
    name: 'Business Language',
    description: 'Language courses focused on business communication and professional contexts',
    slug: 'business-language'
  },
  {
    name: 'Academic Language',
    description: 'Language courses designed for academic study and research',
    slug: 'academic-language'
  },
  {
    name: 'Exam Preparation',
    description: 'Courses preparing students for language proficiency exams (IELTS, TOEFL, Cambridge, DELF, DELE, etc.)',
    slug: 'exam-preparation'
  },
  {
    name: 'Conversation',
    description: 'Focus on speaking and listening skills for everyday communication',
    slug: 'conversation'
  },
  {
    name: 'Grammar',
    description: 'In-depth study of language grammar rules and structures',
    slug: 'grammar'
  },
  {
    name: 'Pronunciation',
    description: 'Courses focusing on correct pronunciation and accent reduction',
    slug: 'pronunciation'
  },
  {
    name: 'Writing Skills',
    description: 'Development of writing skills for various purposes and contexts',
    slug: 'writing-skills'
  },
  {
    name: 'Reading Comprehension',
    description: 'Improving reading skills and comprehension strategies',
    slug: 'reading-comprehension'
  },
  {
    name: 'Listening Skills',
    description: 'Enhancing listening comprehension and note-taking abilities',
    slug: 'listening-skills'
  },
  {
    name: 'Vocabulary Building',
    description: 'Expanding vocabulary knowledge and usage',
    slug: 'vocabulary-building'
  },
  {
    name: 'Young Learners',
    description: 'Language courses designed specifically for children and teenagers',
    slug: 'young-learners'
  },
  {
    name: 'One-to-One',
    description: 'Personalized individual language lessons',
    slug: 'one-to-one'
  },
  {
    name: 'Group Classes',
    description: 'Language courses taught in small group settings',
    slug: 'group-classes'
  },
  {
    name: 'Intensive Courses',
    description: 'Fast-paced language courses for rapid progress',
    slug: 'intensive-courses'
  },
  {
    name: 'Summer Courses',
    description: 'Seasonal language courses with cultural activities',
    slug: 'summer-courses'
  },
  {
    name: 'Online Courses',
    description: 'Virtual language learning programs',
    slug: 'online-courses'
  },
  {
    name: 'Specialized Language',
    description: 'Language courses for specific industries or purposes',
    slug: 'specialized-language'
  }
];

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const createdCategories = [];

    for (const category of categories) {
      try {
        const existingCategory = await prisma.category.findUnique({
          where: { slug: category.slug }
        });

        if (!existingCategory) {
          const newCategory = await prisma.category.create({
            data: {
              id: uuidv4(),
              name: category.name,
              description: category.description,
              slug: category.slug,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          createdCategories.push(newCategory);
        }
      } catch (error) {
        console.error(`Error creating category ${category.name}:`, error);
      }
    }

    return NextResponse.json({
      message: 'Categories seeded successfully',
      created: createdCategories.length,
      categories: createdCategories
    });

  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { error: 'Failed to seed categories' },
      { status: 500 }
    );
  }
} 
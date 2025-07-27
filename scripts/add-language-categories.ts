import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

// Generic language learning categories suitable for all languages
const languageCategories = [
  {
    name: 'Beginner Level',
    description: 'Foundation courses for complete beginners with no prior knowledge of the language',
    slug: 'beginner-level'
  },
  {
    name: 'Elementary Level',
    description: 'Basic language skills for everyday communication and simple interactions',
    slug: 'elementary-level'
  },
  {
    name: 'Intermediate Level',
    description: 'Intermediate courses for learners with basic knowledge seeking to improve fluency',
    slug: 'intermediate-level'
  },
  {
    name: 'Advanced Level',
    description: 'Advanced courses for proficient speakers aiming for native-like fluency',
    slug: 'advanced-level'
  },
  {
    name: 'Conversation & Speaking',
    description: 'Focus on oral communication, pronunciation, and conversational skills',
    slug: 'conversation-speaking'
  },
  {
    name: 'Grammar & Structure',
    description: 'In-depth study of language grammar, syntax, and sentence structure',
    slug: 'grammar-structure'
  },
  {
    name: 'Vocabulary & Expressions',
    description: 'Expanding vocabulary knowledge, idioms, and common expressions',
    slug: 'vocabulary-expressions'
  },
  {
    name: 'Reading & Comprehension',
    description: 'Improving reading skills, text analysis, and comprehension strategies',
    slug: 'reading-comprehension'
  },
  {
    name: 'Writing & Composition',
    description: 'Developing writing skills for various purposes and contexts',
    slug: 'writing-composition'
  },
  {
    name: 'Listening & Understanding',
    description: 'Enhancing listening comprehension and audio processing skills',
    slug: 'listening-understanding'
  },
  {
    name: 'Pronunciation & Accent',
    description: 'Perfecting pronunciation, intonation, and accent reduction',
    slug: 'pronunciation-accent'
  },
  {
    name: 'Business & Professional',
    description: 'Language skills for professional environments and business communication',
    slug: 'business-professional'
  },
  {
    name: 'Academic & Research',
    description: 'Language skills for academic study, research, and scholarly writing',
    slug: 'academic-research'
  },
  {
    name: 'Travel & Cultural',
    description: 'Practical language skills for travel and cultural immersion',
    slug: 'travel-cultural'
  },
  {
    name: 'Test Preparation',
    description: 'Preparation courses for language proficiency exams and certifications',
    slug: 'test-preparation'
  },
  {
    name: 'Young Learners',
    description: 'Specialized courses designed for children and teenagers',
    slug: 'young-learners'
  },
  {
    name: 'Adult Learners',
    description: 'Courses tailored for adult learners with specific goals and schedules',
    slug: 'adult-learners'
  },
  {
    name: 'One-to-One Tutoring',
    description: 'Personalized individual lessons with customized learning plans',
    slug: 'one-to-one-tutoring'
  },
  {
    name: 'Group Classes',
    description: 'Interactive group learning environments for collaborative practice',
    slug: 'group-classes'
  },
  {
    name: 'Intensive Courses',
    description: 'Fast-paced, immersive courses for rapid language acquisition',
    slug: 'intensive-courses'
  },
  {
    name: 'Online & Virtual',
    description: 'Digital learning programs with flexible scheduling and remote access',
    slug: 'online-virtual'
  },
  {
    name: 'Blended Learning',
    description: 'Combined online and in-person learning experiences',
    slug: 'blended-learning'
  },
  {
    name: 'Specialized Skills',
    description: 'Focused courses for specific language skills or purposes',
    slug: 'specialized-skills'
  },
  {
    name: 'Cultural Immersion',
    description: 'Language learning through cultural activities and real-world practice',
    slug: 'cultural-immersion'
  },
  {
    name: 'Literature & Media',
    description: 'Language learning through literature, films, and media content',
    slug: 'literature-media'
  },
  {
    name: 'Technical & Scientific',
    description: 'Language skills for technical, scientific, and specialized fields',
    slug: 'technical-scientific'
  },
  {
    name: 'Medical & Healthcare',
    description: 'Language skills for healthcare professionals and medical contexts',
    slug: 'medical-healthcare'
  },
  {
    name: 'Legal & Government',
    description: 'Language skills for legal, governmental, and official contexts',
    slug: 'legal-government'
  },
  {
    name: 'Tourism & Hospitality',
    description: 'Language skills for tourism, hospitality, and service industries',
    slug: 'tourism-hospitality'
  },
  {
    name: 'Education & Teaching',
    description: 'Language skills for educators and teaching professionals',
    slug: 'education-teaching'
  },
  {
    name: 'Creative & Arts',
    description: 'Language learning through creative expression and artistic activities',
    slug: 'creative-arts'
  },
  {
    name: 'Sports & Recreation',
    description: 'Language skills for sports, fitness, and recreational activities',
    slug: 'sports-recreation'
  },
  {
    name: 'Technology & Digital',
    description: 'Language skills for technology, digital communication, and online platforms',
    slug: 'technology-digital'
  },
  {
    name: 'Social Media & Communication',
    description: 'Language skills for social media, digital communication, and online interaction',
    slug: 'social-media-communication'
  },
  {
    name: 'Emergency & Safety',
    description: 'Essential language skills for emergency situations and safety communication',
    slug: 'emergency-safety'
  },
  {
    name: 'Family & Relationships',
    description: 'Language skills for family communication and personal relationships',
    slug: 'family-relationships'
  },
  {
    name: 'Food & Culinary',
    description: 'Language learning through food culture, cooking, and culinary experiences',
    slug: 'food-culinary'
  },
  {
    name: 'Music & Entertainment',
    description: 'Language learning through music, entertainment, and popular culture',
    slug: 'music-entertainment'
  },
  {
    name: 'Fashion & Lifestyle',
    description: 'Language skills for fashion, lifestyle, and personal expression',
    slug: 'fashion-lifestyle'
  },
  {
    name: 'Environment & Sustainability',
    description: 'Language skills for environmental topics and sustainability discussions',
    slug: 'environment-sustainability'
  },
  {
    name: 'Current Events & News',
    description: 'Language skills for understanding and discussing current events and news',
    slug: 'current-events-news'
  }
];

async function addLanguageCategories() {
  try {
    console.log('Starting to add language learning categories...');
    console.log(`Found ${languageCategories.length} categories to add`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const category of languageCategories) {
      try {
        // Check if category already exists
        const existingCategory = await prisma.category.findUnique({
          where: { slug: category.slug }
        });

        if (!existingCategory) {
          await prisma.category.create({
            data: {
              id: uuidv4(),
              name: category.name,
              description: category.description,
              slug: category.slug,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          console.log(` Added category: ${category.name}`);
          addedCount++;
        } else {
          console.log(`⏭️  Skipped existing category: ${category.name}`);
          skippedCount++;
        }
      } catch (error) {
        logger.error('❌ Error processing category ${category.name}:');
      }
    }

    console.log('\n📊 Summary:');
    console.log(`- Added: ${addedCount} new categories`);
    console.log(`- Skipped: ${skippedCount} existing categories`);
    console.log(`- Total processed: ${languageCategories.length}`);

    // Show current categories
    const allCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    console.log('\n📋 Current categories in database:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.slug})`);
    });

    console.log('\n✅ Language categories addition completed!');
    console.log('💡 Note: Existing English-specific categories have been preserved.');
    console.log('   You can manually remove them later when they are no longer assigned to courses.');

  } catch (error) {
    logger.error('❌ Error in addLanguageCategories:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addLanguageCategories()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(() => {
    logger.error('Script failed:');
    process.exit(1);
  }); 
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function createLiveClassCourses() {
  try {
    console.log('🔍 Checking database structure...');

    // Check existing institutions
    const institutions = await prisma.institution.findMany({
      select: { id: true, name: true, status: true }
    });
    console.log(`📚 Found ${institutions.length} institutions:`, institutions.map(i => `${i.name} (${i.status})`));

    // Check existing categories
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });
    console.log(`📂 Found ${categories.length} categories:`, categories.map(c => c.name));

    // Check existing users (instructors)
    const instructors = await prisma.user.findMany({
      where: { role: { in: ['INSTRUCTOR', 'INSTITUTION_STAFF'] } },
      select: { id: true, name: true, email: true, role: true, institutionId: true }
    });
    console.log(`👨‍🏫 Found ${instructors.length} instructors:`, instructors.map(i => `${i.name} (${i.role})`));

    // Check existing courses
    const existingCourses = await prisma.course.findMany({
      select: { id: true, title: true, hasLiveClasses: true, isPlatformCourse: true }
    });
    console.log(`📖 Found ${existingCourses.length} existing courses`);

    // Find an active institution
    const activeInstitution = institutions.find(i => i.status === 'APPROVED');
    if (!activeInstitution) {
      console.log('❌ No active institution found. Creating a test institution...');
      const testInstitution = await prisma.institution.create({
        data: {
          id: uuidv4(),
          name: 'Test Language Institute',
          email: 'test@languageinstitute.com',
          description: 'A test institution for live class courses',
          status: 'APPROVED',
          isApproved: true,
          country: 'United States',
          city: 'New York',
          address: '123 Test Street',
          telephone: '+1-555-0123',
          contactName: 'Test Contact',
          contactJobTitle: 'Director',
          contactPhone: '+1-555-0124',
          contactEmail: 'contact@languageinstitute.com'
        }
      });
      console.log(`✅ Created test institution: ${testInstitution.name}`);
    }

    // Find or create a language category
    let languageCategory = categories.find(c => c.name.toLowerCase().includes('language'));
    if (!languageCategory) {
      console.log('❌ No language category found. Creating one...');
      languageCategory = await prisma.category.create({
        data: {
          id: uuidv4(),
          name: 'Language Learning',
          description: 'Courses focused on language acquisition and proficiency',
          icon: '🌍',
          color: '#3B82F6'
        }
      });
      console.log(`✅ Created language category: ${languageCategory.name}`);
    }

    // Find or create an instructor
    let instructor = instructors.find(i => i.role === 'INSTRUCTOR' || i.role === 'INSTITUTION_STAFF');
    if (!instructor) {
      console.log('❌ No instructor found. Creating a test instructor...');
      instructor = await prisma.user.create({
        data: {
          id: uuidv4(),
          name: 'Dr. Maria Rodriguez',
          email: 'maria.rodriguez@languageinstitute.com',
          role: 'INSTRUCTOR',
          institutionId: activeInstitution?.id || institutions[0]?.id,
          emailVerified: new Date(),
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      });
      console.log(`✅ Created test instructor: ${instructor.name}`);
    }

    console.log('\n🚀 Creating live class courses...');

    // 1. Create Institution Live Class Course
    console.log('\n📚 Creating Institution Live Class Course...');
    const institutionLiveCourse = await prisma.course.create({
      data: {
        id: uuidv4(),
        title: 'Advanced Spanish Conversation - Live Classes',
        description: 'Master Spanish conversation through interactive live sessions with native speakers. This intensive course features real-time practice, immediate feedback, and cultural immersion.',
        base_price: 299.99,
        pricingPeriod: 'WEEKLY',
        institutionId: activeInstitution?.id || institutions[0]?.id,
        categoryId: languageCategory.id,
        level: 'ADVANCED',
        duration: 12, // 12 weeks
        status: 'ACTIVE',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-30'),
        maxStudents: 15,
        framework: 'CEFR',
        
        // Live class specific fields
        courseType: 'LIVE_ONLY',
        deliveryMode: 'LIVE_INTERACTIVE',
        enrollmentType: 'COURSE_BASED',
        hasLiveClasses: true,
        liveClassType: 'CONVERSATION',
        liveClassFrequency: 'WEEKLY',
        liveClassSchedule: {
          dayOfWeek: 'Wednesday',
          time: '19:00',
          timezone: 'UTC-5',
          duration: 90
        },
        requiresSubscription: false,
        subscriptionTier: null,
        isPlatformCourse: false
      }
    });

    console.log(`✅ Created institution live course: ${institutionLiveCourse.title}`);

    // 2. Create Platform-Wide Live Class Course
    console.log('\n🌐 Creating Platform-Wide Live Class Course...');
    const platformLiveCourse = await prisma.course.create({
      data: {
        id: uuidv4(),
        title: 'Global English Mastery - Live Platform Course',
        description: 'Join learners worldwide in this comprehensive English course featuring live interactive sessions, peer practice, and expert instruction. Perfect for international students.',
        base_price: 0, // Free for platform courses (subscription-based)
        pricingPeriod: 'MONTHLY',
        institutionId: null, // Platform-wide course
        categoryId: languageCategory.id,
        level: 'INTERMEDIATE',
        duration: 8, // 8 weeks
        status: 'ACTIVE',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-31'),
        maxStudents: 25,
        framework: 'CEFR',
        
        // Live class specific fields
        courseType: 'LIVE_ONLY',
        deliveryMode: 'LIVE_INTERACTIVE',
        enrollmentType: 'SUBSCRIPTION_BASED',
        hasLiveClasses: true,
        liveClassType: 'COMPREHENSIVE',
        liveClassFrequency: 'BIWEEKLY',
        liveClassSchedule: {
          dayOfWeek: 'Saturday',
          time: '14:00',
          timezone: 'UTC',
          duration: 120
        },
        requiresSubscription: true,
        subscriptionTier: 'PREMIUM',
        isPlatformCourse: true
      }
    });

    console.log(`✅ Created platform live course: ${platformLiveCourse.title}`);

    // 3. Create associated live class sessions for the institution course
    console.log('\n📅 Creating live class sessions for institution course...');
    const institutionSessions = [];
    for (let week = 1; week <= 12; week++) {
      const sessionDate = new Date('2024-02-07'); // First Wednesday
      sessionDate.setDate(sessionDate.getDate() + (week - 1) * 7);
      
      const session = await prisma.videoSession.create({
        data: {
          id: uuidv4(),
          title: `Week ${week}: Spanish Conversation Practice`,
          description: `Live Spanish conversation session covering week ${week} topics and vocabulary.`,
          sessionType: 'LIVE_CLASS',
          language: 'Spanish',
          level: 'ADVANCED',
          maxParticipants: 15,
          startTime: new Date(sessionDate.getTime() + 19 * 60 * 60 * 1000), // 7 PM
          endTime: new Date(sessionDate.getTime() + 20.5 * 60 * 60 * 1000), // 8:30 PM
          duration: 90,
          price: 0, // Included in course price
          currency: 'USD',
          isPublic: false,
          isRecorded: true,
          allowChat: true,
          allowScreenShare: true,
          allowRecording: false,
          instructorId: instructor.id,
          institutionId: activeInstitution?.id || institutions[0]?.id,
          courseId: institutionLiveCourse.id,
          status: 'SCHEDULED'
        }
      });
      institutionSessions.push(session);
    }
    console.log(`✅ Created ${institutionSessions.length} live sessions for institution course`);

    // 4. Create associated live class sessions for the platform course
    console.log('\n📅 Creating live class sessions for platform course...');
    const platformSessions = [];
    for (let week = 1; week <= 8; week++) {
      const sessionDate = new Date('2024-02-03'); // First Saturday
      sessionDate.setDate(sessionDate.getDate() + (week - 1) * 14); // Bi-weekly
      
      const session = await prisma.videoSession.create({
        data: {
          id: uuidv4(),
          title: `Week ${week}: Global English Mastery`,
          description: `Live English learning session with international participants.`,
          sessionType: 'LIVE_CLASS',
          language: 'English',
          level: 'INTERMEDIATE',
          maxParticipants: 25,
          startTime: new Date(sessionDate.getTime() + 14 * 60 * 60 * 1000), // 2 PM UTC
          endTime: new Date(sessionDate.getTime() + 16 * 60 * 60 * 1000), // 4 PM UTC
          duration: 120,
          price: 0, // Free with subscription
          currency: 'USD',
          isPublic: true,
          isRecorded: true,
          allowChat: true,
          allowScreenShare: true,
          allowRecording: false,
          instructorId: instructor.id,
          institutionId: null, // Platform course
          courseId: platformLiveCourse.id,
          status: 'SCHEDULED'
        }
      });
      platformSessions.push(session);
    }
    console.log(`✅ Created ${platformSessions.length} live sessions for platform course`);

    // 5. Display summary
    console.log('\n🎉 Live Class Courses Created Successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • Institution Live Course: ${institutionLiveCourse.title}`);
    console.log(`     - ${institutionSessions.length} live sessions scheduled`);
    console.log(`     - Price: $${institutionLiveCourse.base_price} per week`);
    console.log(`     - Max students: ${institutionLiveCourse.maxStudents}`);
    console.log(`     - Live class frequency: ${institutionLiveCourse.liveClassFrequency}`);
    
    console.log(`\n   • Platform Live Course: ${platformLiveCourse.title}`);
    console.log(`     - ${platformSessions.length} live sessions scheduled`);
    console.log(`     - Subscription-based (${platformLiveCourse.subscriptionTier} tier)`);
    console.log(`     - Max students: ${platformLiveCourse.maxStudents}`);
    console.log(`     - Live class frequency: ${platformLiveCourse.liveClassFrequency}`);
    console.log(`     - Global timezone: ${platformLiveCourse.liveClassSchedule?.timezone}`);

    console.log('\n🔗 Course URLs:');
    console.log(`   • Institution: /admin/courses/${institutionLiveCourse.id}`);
    console.log(`   • Platform: /admin/courses/${platformLiveCourse.id}`);

  } catch (error) {
    console.error('❌ Error creating live class courses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createLiveClassCourses();

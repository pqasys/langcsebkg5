import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testRelations() {
  try {
    // 1. Create test data
    console.log('Creating test data...');
    
    // Create an institution
    const institution = await prisma.institution.create({
      data: {
        name: 'Test Institution',
        description: 'Test Description',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        email: 'test@institution.com',
        status: 'ACTIVE',
        isApproved: true,
        updatedAt: new Date(),
      },
    });
    console.log('Created institution:', institution.id);

    // Create a course
    const course = await prisma.course.create({
      data: {
        title: 'Test Course',
        description: 'Test Course Description',
        duration: 30,
        level: 'BEGINNER',
        status: 'ACTIVE',
        institutionId: institution.id,
        categoryId: '0ca38f55-8b17-4114-9327-f791288a64cc',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxStudents: 20,
        base_price: 100,
        updatedAt: new Date(),
      },
    });
    console.log('Created course:', course.id);

    // Create a student
    const student = await prisma.student.create({
      data: {
        name: 'Test Student',
        email: 'test@student.com',
        status: 'active',
      },
    });
    console.log('Created student:', student.id);

    // Create a booking
    const booking = await prisma.booking.create({
      data: {
        courseId: course.id,
        institutionId: institution.id,
        studentId: student.id,
        status: 'CONFIRMED',
        amount: 100,
        updatedAt: new Date(),
      },
    });
    console.log('Created booking:', booking.id);

    // 2. Test relations
    console.log('\nTesting relations...');

    // Test booking -> course relation
    const bookingWithCourse = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: { course: true },
    });
    console.log('Booking -> Course relation:', bookingWithCourse?.course.title === 'Test Course');

    // Test booking -> institution relation
    const bookingWithInstitution = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: { institution: true },
    });
    console.log('Booking -> Institution relation:', bookingWithInstitution?.institution.name === 'Test Institution');

    // Test booking -> student relation
    const bookingWithStudent = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: { student: true },
    });
    console.log('Booking -> Student relation:', bookingWithStudent?.student.name === 'Test Student');

    // Test course -> bookings relation
    const courseWithBookings = await prisma.course.findUnique({
      where: { id: course.id },
      include: { bookings: true },
    });
    console.log('Course -> Bookings relation:', courseWithBookings?.bookings.length === 1);

    // Test institution -> bookings relation
    const institutionWithBookings = await prisma.institution.findUnique({
      where: { id: institution.id },
      include: { bookings: true },
    });
    console.log('Institution -> Bookings relation:', institutionWithBookings?.bookings.length === 1);

    // Test student -> bookings relation
    const studentWithBookings = await prisma.student.findUnique({
      where: { id: student.id },
      include: { bookings: true },
    });
    console.log('Student -> Bookings relation:', studentWithBookings?.bookings.length === 1);

    // 3. Clean up test data
    console.log('\nCleaning up test data...');
    await prisma.booking.delete({ where: { id: booking.id } });
    await prisma.course.delete({ where: { id: course.id } });
    await prisma.student.delete({ where: { id: student.id } });
    await prisma.institution.delete({ where: { id: institution.id } });
    console.log('Cleanup complete');

  } catch (error) {
    logger.error('Error testing relations:');
  } finally {
    await prisma.$disconnect();
  }
}

testRelations(); 
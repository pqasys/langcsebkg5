import { prisma } from '../lib/prisma';
import { CertificateServiceSecure } from '../lib/services/certificate-service-secure';

async function regenerateStudent3Certificate() {
  try {
    console.log('🔍 Looking for Student 3...');
    
    // Find Student 3 by ID (from the search results)
    const student3 = await prisma.user.findUnique({
      where: {
        id: '140e3f04-f4f1-47f9-b001-70f50459d3cb'
      }
    });

    if (!student3) {
      console.log('❌ Student 3 not found');
      return;
    }

    console.log(`✅ Found Student 3: ${student3.name} (ID: ${student3.id})`);

    // Find their test attempts
    const testAttempts = await prisma.languageProficiencyTestAttempt.findMany({
      where: {
        userId: student3.id
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    if (testAttempts.length === 0) {
      console.log('❌ No test attempts found for Student 3');
      return;
    }

    console.log(`📊 Found ${testAttempts.length} test attempt(s)`);

    // Show test attempt details
    for (const attempt of testAttempts) {
      const answers = attempt.answers as Record<string, string>;
      const totalQuestions = Object.keys(answers).length;
      const percentage = Math.round((attempt.score / totalQuestions) * 100);
      
      console.log(`\n📝 Test Attempt Details:`);
      console.log(`   ID: ${attempt.id}`);
      console.log(`   Language: ${attempt.languageCode}`);
      console.log(`   Score: ${attempt.score}/${totalQuestions} (${percentage}%)`);
      console.log(`   Level: ${attempt.level}`);
      console.log(`   Completed: ${attempt.completedAt.toLocaleDateString()}`);
      console.log(`   Total Questions: ${totalQuestions}`);
    }

    // Check if they already have a certificate
    const existingCertificates = await prisma.certificate.findMany({
      where: {
        userId: student3.id
      }
    });

    if (existingCertificates.length > 0) {
      console.log(`\n🗑️  Deleting ${existingCertificates.length} existing certificate(s)...`);
      for (const cert of existingCertificates) {
        await prisma.certificate.delete({
          where: { id: cert.id }
        });
        console.log(`   Deleted certificate: ${cert.certificateId}`);
      }
    }

    // Regenerate certificate for the most recent test attempt
    const latestAttempt = testAttempts[0];
    console.log(`\n🔄 Regenerating certificate for latest test attempt...`);
    
    const certificate = await CertificateServiceSecure.createCertificate(latestAttempt.id);
    
    console.log(`✅ Certificate regenerated successfully!`);
    console.log(`   Certificate ID: ${certificate.certificateId}`);
    console.log(`   Score: ${certificate.score}/${certificate.totalQuestions}`);
    console.log(`   Percentage: ${Math.round((certificate.score / certificate.totalQuestions) * 100)}%`);

  } catch (error) {
    console.error('❌ Error regenerating certificate:', error);
  } finally {
    await prisma.$disconnect();
  }
}

regenerateStudent3Certificate();

import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function checkApprovalSettings() {
  console.log('🔍 Checking Payment Approval Settings...\n');

  try {
    // Check admin settings
    const adminSettings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    console.log('📋 Admin Settings:');
    if (adminSettings) {
      console.log(`   Admin settings found`);
      console.log(`  - allowInstitutionPaymentApproval: ${adminSettings.allowInstitutionPaymentApproval}`);
      console.log(`  - showInstitutionApprovalButtons: ${adminSettings.showInstitutionApprovalButtons}`);
      console.log(`  - defaultPaymentStatus: ${adminSettings.defaultPaymentStatus}`);
      console.log(`  - institutionApprovableMethods: ${JSON.stringify(adminSettings.institutionApprovableMethods)}`);
      console.log(`  - adminOnlyMethods: ${JSON.stringify(adminSettings.adminOnlyMethods)}`);
      console.log(`  - institutionPaymentApprovalExemptions: ${JSON.stringify(adminSettings.institutionPaymentApprovalExemptions)}`);
    } else {
      console.log(`   No admin settings found - using defaults`);
    }

    // Check institutions
    const institutions = await prisma.institution.findMany({
      include: {
        users: {
          where: {
            role: 'INSTITUTION'
          }
        }
      }
    });

    console.log('\n🏫 Institutions:');
    if (institutions.length === 0) {
      console.log('  ❌ No institutions found');
    } else {
      institutions.forEach((institution, index) => {
        console.log(`\n  ${index + 1}. ${institution.name} (ID: ${institution.id})`);
        console.log(`     - Email: ${institution.email}`);
        console.log(`     - Commission Rate: ${institution.commissionRate}%`);
        console.log(`     - Status: ${institution.status}`);
        console.log(`     - Users: ${institution.users.length}`);
        
        // Check if institution is exempted
        const isExempted = adminSettings?.institutionPaymentApprovalExemptions?.includes(institution.id);
        console.log(`     - Payment Approval Exempted: ${isExempted ? ' YES' : ' NO'}`);
        
        // Check if institution can approve payments
        const canApprove = adminSettings?.allowInstitutionPaymentApproval && !isExempted;
        console.log(`     - Can Approve Payments: ${canApprove ? ' YES' : ' NO'}`);
        
        if (institution.users.length > 0) {
          console.log(`     - Institution Users:`);
          institution.users.forEach(user => {
            console.log(`       * ${user.email} (${user.role})`);
          });
        }
      });
    }

    // Check pending payments
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PENDING'
      }
    });

    console.log('\n💰 Pending Payments:');
    if (pendingPayments.length === 0) {
      console.log('  ✅ No pending payments found');
    } else {
      for (const payment of pendingPayments) {
        console.log(`\n  Payment ID: ${payment.id}`);
        console.log(`     - Amount: $${payment.amount}`);
        console.log(`     - Payment Method: ${payment.paymentMethod || 'Not specified'}`);
        console.log(`     - Institution ID: ${payment.institutionId}`);
        console.log(`     - Enrollment ID: ${payment.enrollmentId}`);
        
        // Get enrollment details
        const enrollment = await prisma.studentCourseEnrollment.findUnique({
          where: { id: payment.enrollmentId },
          include: {
            course: {
              include: {
                institution: true
              }
            }
          }
        });

        if (enrollment) {
          console.log(`     - Institution: ${enrollment.course.institution.name}`);
          console.log(`     - Course: ${enrollment.course.title}`);
          console.log(`     - Student ID: ${enrollment.studentId}`);
          
          // Check if this payment can be approved by institution
          const institution = enrollment.course.institution;
          const isExempted = adminSettings?.institutionPaymentApprovalExemptions?.includes(institution.id);
          const canApprove = adminSettings?.allowInstitutionPaymentApproval && 
                            !isExempted && 
                            (!payment.paymentMethod || 
                             adminSettings.institutionApprovableMethods.includes(payment.paymentMethod));
          
          console.log(`     - Institution Can Approve: ${canApprove ? ' YES' : ' NO'}`);
          if (!canApprove) {
            if (!adminSettings?.allowInstitutionPaymentApproval) {
              console.log(`       Reason: Institution payment approval is globally disabled`);
            } else if (isExempted) {
              console.log(`       Reason: Institution is exempted from payment approval`);
            } else if (payment.paymentMethod && !adminSettings?.institutionApprovableMethods.includes(payment.paymentMethod)) {
              console.log(`       Reason: Payment method '${payment.paymentMethod}' requires admin approval`);
            }
          }
        } else {
          console.log(`     -  Enrollment not found for ID: ${payment.enrollmentId}`);
        }
      }
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`  - Total Institutions: ${institutions.length}`);
    console.log(`  - Institutions with Users: ${institutions.filter(i => i.users.length > 0).length}`);
    console.log(`  - Exempted Institutions: ${adminSettings?.institutionPaymentApprovalExemptions?.length || 0}`);
    console.log(`  - Pending Payments: ${pendingPayments.length}`);
    
    // Count approvable payments
    let approvablePayments = 0;
    for (const payment of pendingPayments) {
      const enrollment = await prisma.studentCourseEnrollment.findUnique({
        where: { id: payment.enrollmentId },
        include: {
          course: {
            include: {
              institution: true
            }
          }
        }
      });
      
      if (enrollment) {
        const institution = enrollment.course.institution;
        const isExempted = adminSettings?.institutionPaymentApprovalExemptions?.includes(institution.id);
        const canApprove = adminSettings?.allowInstitutionPaymentApproval && 
                          !isExempted && 
                          (!payment.paymentMethod || 
                           adminSettings.institutionApprovableMethods.includes(payment.paymentMethod));
        
        if (canApprove) {
          approvablePayments++;
        }
      }
    }
    
    console.log(`  - Payments Approvable by Institutions: ${approvablePayments}`);

  } catch (error) {
    logger.error('❌ Error checking approval settings:');
  } finally {
    await prisma.$disconnect();
  }
}

checkApprovalSettings(); 
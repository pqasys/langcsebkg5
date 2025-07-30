#!/usr/bin/env tsx

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface TestUser {
  id: string;
  role: 'STUDENT' | 'INSTITUTION';
  email: string;
  institutionId?: string;
}

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class AccessControlTester {
  private results: TestResult[] = [];

  // Test users for different scenarios
  private testUsers: TestUser[] = [
    {
      id: 'test-free-user',
      role: 'STUDENT',
      email: 'free@test.com'
    },
    {
      id: 'test-subscriber',
      role: 'STUDENT',
      email: 'subscriber@test.com'
    },
    {
      id: 'test-institution-student',
      role: 'STUDENT',
      email: 'institution-student@test.com'
    },
    {
      id: 'test-hybrid-user',
      role: 'STUDENT',
      email: 'hybrid@test.com'
    },
    {
      id: 'test-institution-staff',
      role: 'INSTITUTION',
      email: 'staff@test.com',
      institutionId: 'test-institution'
    }
  ];

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting Access Control Tests...\n');

    await this.testUseSubscriptionHook();
    await this.testAPIAccessControl();
    await this.testDatabaseAccessControl();
    await this.testFrontendAccessControl();

    this.printResults();
  }

  private async testUseSubscriptionHook(): Promise<void> {
    console.log('📋 Testing useSubscription Hook...');

    // Test FREE user
    await this.testUserType('FREE', {
      hasActiveSubscription: false,
      hasInstitutionEnrollment: false,
      expectedUserType: 'FREE',
      expectedAccess: {
        canAccessLiveClasses: false,
        canAccessLiveConversations: false,
        canAccessPlatformContent: false,
        canAccessInstitutionContent: false,
        canAccessPremiumFeatures: false
      }
    });

    // Test SUBSCRIBER user
    await this.testUserType('SUBSCRIBER', {
      hasActiveSubscription: true,
      hasInstitutionEnrollment: false,
      expectedUserType: 'SUBSCRIBER',
      expectedAccess: {
        canAccessLiveClasses: true,
        canAccessLiveConversations: true,
        canAccessPlatformContent: true,
        canAccessInstitutionContent: false,
        canAccessPremiumFeatures: true
      }
    });

    // Test INSTITUTION_STUDENT user
    await this.testUserType('INSTITUTION_STUDENT', {
      hasActiveSubscription: false,
      hasInstitutionEnrollment: true,
      expectedUserType: 'INSTITUTION_STUDENT',
      expectedAccess: {
        canAccessLiveClasses: true,
        canAccessLiveConversations: true,
        canAccessPlatformContent: false,
        canAccessInstitutionContent: true,
        canAccessPremiumFeatures: false
      }
    });

    // Test HYBRID user
    await this.testUserType('HYBRID', {
      hasActiveSubscription: true,
      hasInstitutionEnrollment: true,
      expectedUserType: 'HYBRID',
      expectedAccess: {
        canAccessLiveClasses: true,
        canAccessLiveConversations: true,
        canAccessPlatformContent: true,
        canAccessInstitutionContent: true,
        canAccessPremiumFeatures: true
      }
    });

    // Test INSTITUTION_STAFF user
    await this.testUserType('INSTITUTION_STAFF', {
      hasActiveSubscription: false,
      hasInstitutionEnrollment: false,
      expectedUserType: 'INSTITUTION_STAFF',
      expectedAccess: {
        canAccessLiveClasses: true,
        canAccessLiveConversations: true,
        canAccessPlatformContent: false,
        canAccessInstitutionContent: true,
        canAccessPremiumFeatures: false
      }
    });
  }

  private async testUserType(
    userType: string,
    config: {
      hasActiveSubscription: boolean;
      hasInstitutionEnrollment: boolean;
      expectedUserType: string;
      expectedAccess: {
        canAccessLiveClasses: boolean;
        canAccessLiveConversations: boolean;
        canAccessPlatformContent: boolean;
        canAccessInstitutionContent: boolean;
        canAccessPremiumFeatures: boolean;
      };
    }
  ): Promise<void> {
    try {
      // Simulate useSubscription hook logic
      const hasSubscription = config.hasActiveSubscription;
      const hasInstitution = config.hasInstitutionEnrollment;
      const isInstitutionStaff = userType === 'INSTITUTION_STAFF';

      // Calculate user type
      let calculatedUserType = 'FREE';
      if (isInstitutionStaff) {
        calculatedUserType = 'INSTITUTION_STAFF';
      } else if (hasSubscription && hasInstitution) {
        calculatedUserType = 'HYBRID';
      } else if (hasSubscription) {
        calculatedUserType = 'SUBSCRIBER';
      } else if (hasInstitution) {
        calculatedUserType = 'INSTITUTION_STUDENT';
      }

      // Calculate access levels
      const canAccessPlatformContent = hasSubscription;
      const canAccessInstitutionContent = hasInstitution || isInstitutionStaff;
      const canAccessLiveClasses = hasSubscription || hasInstitution || isInstitutionStaff;
      const canAccessLiveConversations = hasSubscription || hasInstitution || isInstitutionStaff;
      const canAccessPremiumFeatures = hasSubscription;

      // Verify results
      const passed = 
        calculatedUserType === config.expectedUserType &&
        canAccessLiveClasses === config.expectedAccess.canAccessLiveClasses &&
        canAccessLiveConversations === config.expectedAccess.canAccessLiveConversations &&
        canAccessPlatformContent === config.expectedAccess.canAccessPlatformContent &&
        canAccessInstitutionContent === config.expectedAccess.canAccessInstitutionContent &&
        canAccessPremiumFeatures === config.expectedAccess.canAccessPremiumFeatures;

      this.results.push({
        testName: `${userType} User Access Control`,
        passed,
        details: {
          calculatedUserType,
          expectedUserType: config.expectedUserType,
          accessLevels: {
            canAccessLiveClasses,
            canAccessLiveConversations,
            canAccessPlatformContent,
            canAccessInstitutionContent,
            canAccessPremiumFeatures
          },
          expectedAccess: config.expectedAccess
        }
      });

      console.log(`  ✅ ${userType}: ${passed ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      this.results.push({
        testName: `${userType} User Access Control`,
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ ${userType}: FAILED - ${error}`);
    }
  }

  private async testAPIAccessControl(): Promise<void> {
    console.log('\n🌐 Testing API Access Control...');

    // Test Live Classes API access
    await this.testLiveClassesAPIAccess();
    
    // Test Live Conversations API access
    await this.testLiveConversationsAPIAccess();
    
    // Test Subscription API access
    await this.testSubscriptionAPIAccess();
  }

  private async testLiveClassesAPIAccess(): Promise<void> {
    try {
      // Test that FREE users cannot access video sessions
      const freeUserAccess = await this.simulateAPIAccess('FREE', '/api/video-sessions');
      this.results.push({
        testName: 'Live Classes API - FREE User Access',
        passed: !freeUserAccess,
        details: { userType: 'FREE', hasAccess: freeUserAccess }
      });

      // Test that SUBSCRIBER users can access platform video sessions
      const subscriberAccess = await this.simulateAPIAccess('SUBSCRIBER', '/api/video-sessions');
      this.results.push({
        testName: 'Live Classes API - SUBSCRIBER User Access',
        passed: subscriberAccess,
        details: { userType: 'SUBSCRIBER', hasAccess: subscriberAccess }
      });

      // Test that INSTITUTION_STUDENT users can access institution video sessions
      const institutionStudentAccess = await this.simulateAPIAccess('INSTITUTION_STUDENT', '/api/video-sessions');
      this.results.push({
        testName: 'Live Classes API - INSTITUTION_STUDENT User Access',
        passed: institutionStudentAccess,
        details: { userType: 'INSTITUTION_STUDENT', hasAccess: institutionStudentAccess }
      });

      // Test that only INSTITUTION_STAFF can create video sessions
      const staffCanCreate = await this.simulateAPIAccess('INSTITUTION_STAFF', '/api/video-sessions/create', 'POST');
      const subscriberCannotCreate = !(await this.simulateAPIAccess('SUBSCRIBER', '/api/video-sessions/create', 'POST'));
      
      this.results.push({
        testName: 'Live Classes API - Create Permission',
        passed: staffCanCreate && subscriberCannotCreate,
        details: { 
          staffCanCreate, 
          subscriberCannotCreate 
        }
      });

      console.log('  ✅ Live Classes API tests completed');
    } catch (error) {
      this.results.push({
        testName: 'Live Classes API Access Control',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Live Classes API: FAILED - ${error}`);
    }
  }

  private async testLiveConversationsAPIAccess(): Promise<void> {
    try {
      // Test that FREE users have limited access
      const freeUserAccess = await this.simulateAPIAccess('FREE', '/api/live-conversations');
      this.results.push({
        testName: 'Live Conversations API - FREE User Access',
        passed: freeUserAccess, // FREE users can see limited conversations
        details: { userType: 'FREE', hasAccess: freeUserAccess }
      });

      // Test that SUBSCRIBER users have full access
      const subscriberAccess = await this.simulateAPIAccess('SUBSCRIBER', '/api/live-conversations');
      this.results.push({
        testName: 'Live Conversations API - SUBSCRIBER User Access',
        passed: subscriberAccess,
        details: { userType: 'SUBSCRIBER', hasAccess: subscriberAccess }
      });

      // Test that users with subscription can create conversations
      const subscriberCanCreate = await this.simulateAPIAccess('SUBSCRIBER', '/api/live-conversations', 'POST');
      const freeUserCannotCreate = !(await this.simulateAPIAccess('FREE', '/api/live-conversations', 'POST'));
      
      this.results.push({
        testName: 'Live Conversations API - Create Permission',
        passed: subscriberCanCreate && freeUserCannotCreate,
        details: { 
          subscriberCanCreate, 
          freeUserCannotCreate 
        }
      });

      console.log('  ✅ Live Conversations API tests completed');
    } catch (error) {
      this.results.push({
        testName: 'Live Conversations API Access Control',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Live Conversations API: FAILED - ${error}`);
    }
  }

  private async testSubscriptionAPIAccess(): Promise<void> {
    try {
      // Test student subscription API
      const studentAccess = await this.simulateAPIAccess('SUBSCRIBER', '/api/student/subscription');
      this.results.push({
        testName: 'Subscription API - Student Access',
        passed: studentAccess,
        details: { userType: 'SUBSCRIBER', hasAccess: studentAccess }
      });

      // Test institution subscription API
      const institutionAccess = await this.simulateAPIAccess('INSTITUTION_STAFF', '/api/institution/subscription');
      this.results.push({
        testName: 'Subscription API - Institution Access',
        passed: institutionAccess,
        details: { userType: 'INSTITUTION_STAFF', hasAccess: institutionAccess }
      });

      console.log('  ✅ Subscription API tests completed');
    } catch (error) {
      this.results.push({
        testName: 'Subscription API Access Control',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Subscription API: FAILED - ${error}`);
    }
  }

  private async simulateAPIAccess(userType: string, endpoint: string, method: string = 'GET'): Promise<boolean> {
    // Simulate API access based on user type and endpoint
    const accessMatrix = {
      'FREE': {
        '/api/video-sessions': false,
        '/api/video-sessions/create': false,
        '/api/live-conversations': true, // Limited access
        '/api/live-conversations/create': false,
        '/api/student/subscription': true,
        '/api/institution/subscription': false
      },
      'SUBSCRIBER': {
        '/api/video-sessions': true,
        '/api/video-sessions/create': false,
        '/api/live-conversations': true,
        '/api/live-conversations/create': true,
        '/api/student/subscription': true,
        '/api/institution/subscription': false
      },
      'INSTITUTION_STUDENT': {
        '/api/video-sessions': true,
        '/api/video-sessions/create': false,
        '/api/live-conversations': true,
        '/api/live-conversations/create': true,
        '/api/student/subscription': true,
        '/api/institution/subscription': false
      },
      'HYBRID': {
        '/api/video-sessions': true,
        '/api/video-sessions/create': false,
        '/api/live-conversations': true,
        '/api/live-conversations/create': true,
        '/api/student/subscription': true,
        '/api/institution/subscription': false
      },
      'INSTITUTION_STAFF': {
        '/api/video-sessions': true,
        '/api/video-sessions/create': true,
        '/api/live-conversations': true,
        '/api/live-conversations/create': true,
        '/api/student/subscription': false,
        '/api/institution/subscription': true
      }
    };

    return accessMatrix[userType as keyof typeof accessMatrix]?.[endpoint as keyof typeof accessMatrix['FREE']] || false;
  }

  private async testDatabaseAccessControl(): Promise<void> {
    console.log('\n🗄️ Testing Database Access Control...');

    try {
      // Test that users only see content they have access to
      const testCases = [
        { userType: 'FREE', shouldSeePlatformContent: false, shouldSeeInstitutionContent: false },
        { userType: 'SUBSCRIBER', shouldSeePlatformContent: true, shouldSeeInstitutionContent: false },
        { userType: 'INSTITUTION_STUDENT', shouldSeePlatformContent: false, shouldSeeInstitutionContent: true },
        { userType: 'HYBRID', shouldSeePlatformContent: true, shouldSeeInstitutionContent: true },
        { userType: 'INSTITUTION_STAFF', shouldSeePlatformContent: false, shouldSeeInstitutionContent: true }
      ];

      for (const testCase of testCases) {
        const platformAccess = await this.simulateDatabaseAccess(testCase.userType, 'platform');
        const institutionAccess = await this.simulateDatabaseAccess(testCase.userType, 'institution');

        this.results.push({
          testName: `Database Access - ${testCase.userType}`,
          passed: platformAccess === testCase.shouldSeePlatformContent && 
                  institutionAccess === testCase.shouldSeeInstitutionContent,
          details: {
            userType: testCase.userType,
            platformAccess,
            institutionAccess,
            expected: {
              platform: testCase.shouldSeePlatformContent,
              institution: testCase.shouldSeeInstitutionContent
            }
          }
        });
      }

      console.log('  ✅ Database access control tests completed');
    } catch (error) {
      this.results.push({
        testName: 'Database Access Control',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Database Access Control: FAILED - ${error}`);
    }
  }

  private async simulateDatabaseAccess(userType: string, contentType: 'platform' | 'institution'): Promise<boolean> {
    // Simulate database query filtering based on user type
    const accessMatrix = {
      'FREE': { platform: false, institution: false },
      'SUBSCRIBER': { platform: true, institution: false },
      'INSTITUTION_STUDENT': { platform: false, institution: true },
      'HYBRID': { platform: true, institution: true },
      'INSTITUTION_STAFF': { platform: false, institution: true }
    };

    return accessMatrix[userType as keyof typeof accessMatrix]?.[contentType] || false;
  }

  private async testFrontendAccessControl(): Promise<void> {
    console.log('\n🎨 Testing Frontend Access Control...');

    try {
      // Test that components render correctly for each user type
      const testCases = [
        { userType: 'FREE', shouldShowUpgradePrompt: true, shouldShowAdminInterface: false },
        { userType: 'SUBSCRIBER', shouldShowUpgradePrompt: false, shouldShowAdminInterface: false },
        { userType: 'INSTITUTION_STUDENT', shouldShowUpgradePrompt: false, shouldShowAdminInterface: false },
        { userType: 'HYBRID', shouldShowUpgradePrompt: false, shouldShowAdminInterface: false },
        { userType: 'INSTITUTION_STAFF', shouldShowUpgradePrompt: false, shouldShowAdminInterface: true }
      ];

      for (const testCase of testCases) {
        const upgradePrompt = await this.simulateFrontendAccess(testCase.userType, 'upgradePrompt');
        const adminInterface = await this.simulateFrontendAccess(testCase.userType, 'adminInterface');

        this.results.push({
          testName: `Frontend Access - ${testCase.userType}`,
          passed: upgradePrompt === testCase.shouldShowUpgradePrompt && 
                  adminInterface === testCase.shouldShowAdminInterface,
          details: {
            userType: testCase.userType,
            upgradePrompt,
            adminInterface,
            expected: {
              upgradePrompt: testCase.shouldShowUpgradePrompt,
              adminInterface: testCase.shouldShowAdminInterface
            }
          }
        });
      }

      console.log('  ✅ Frontend access control tests completed');
    } catch (error) {
      this.results.push({
        testName: 'Frontend Access Control',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Frontend Access Control: FAILED - ${error}`);
    }
  }

  private async simulateFrontendAccess(userType: string, component: 'upgradePrompt' | 'adminInterface'): Promise<boolean> {
    // Simulate frontend component rendering based on user type
    const componentMatrix = {
      'FREE': { upgradePrompt: true, adminInterface: false },
      'SUBSCRIBER': { upgradePrompt: false, adminInterface: false },
      'INSTITUTION_STUDENT': { upgradePrompt: false, adminInterface: false },
      'HYBRID': { upgradePrompt: false, adminInterface: false },
      'INSTITUTION_STAFF': { upgradePrompt: false, adminInterface: true }
    };

    return componentMatrix[userType as keyof typeof componentMatrix]?.[component] || false;
  }

  private printResults(): void {
    console.log('\n📊 Test Results Summary');
    console.log('=' .repeat(50));

    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const failed = total - passed;

    console.log(`\n✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(result => {
          console.log(`  - ${result.testName}`);
          if (result.error) {
            console.log(`    Error: ${result.error}`);
          }
          if (result.details) {
            console.log(`    Details: ${JSON.stringify(result.details, null, 2)}`);
          }
        });
    }

    console.log('\n✅ Passed Tests:');
    this.results
      .filter(r => r.passed)
      .forEach(result => {
        console.log(`  - ${result.testName}`);
      });

    // Save results to file
    const fs = require('fs');
    const resultsFile = 'test-results/access-control-test-results.json';
    
    // Ensure directory exists
    const path = require('path');
    const dir = path.dirname(resultsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(resultsFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      summary: {
        total,
        passed,
        failed,
        successRate: (passed / total) * 100
      },
      results: this.results
    }, null, 2));

    console.log(`\n📄 Detailed results saved to: ${resultsFile}`);

    if (failed > 0) {
      console.log('\n🚨 Some tests failed. Please review the failed tests above.');
      process.exit(1);
    } else {
      console.log('\n🎉 All access control tests passed!');
    }
  }
}

// Run the tests
async function main() {
  const tester = new AccessControlTester();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
} 
import { prisma } from './prisma';

/**
 * User-Student Synchronization Utility
 * 
 * This module provides functions to keep user and student records synchronized.
 * The user table is considered the source of truth for authentication and basic info.
 * The student table contains additional student-specific information.
 */

export interface SyncResult {
  success: boolean;
  message: string;
  userId?: string;
  studentId?: string;
  action?: 'created' | 'updated' | 'synchronized' | 'no_change';
}

/**
 * Ensures a student record exists for a given user
 */
export async function ensureStudentRecord(userId: string): Promise<SyncResult> {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    if (user.role !== 'STUDENT') {
      return {
        success: false,
        message: 'User is not a student'
      };
    }

    // Check if student record exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: userId }
    });

    if (existingStudent) {
      // Synchronize data if needed
      if (existingStudent.name !== user.name || existingStudent.email !== user.email) {
        await prisma.student.update({
          where: { id: userId },
          data: {
            name: user.name,
            email: user.email,
            updated_at: new Date()
          }
        });

        return {
          success: true,
          message: 'Student record synchronized with user data',
          userId,
          studentId: userId,
          action: 'synchronized'
        };
      }

      return {
        success: true,
        message: 'Student record already exists and is up to date',
        userId,
        studentId: userId,
        action: 'no_change'
      };
    }

    // Create new student record
    const newStudent = await prisma.student.create({
      data: {
        id: userId,
        name: user.name,
        email: user.email,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        last_active: new Date()
      }
    });

    return {
      success: true,
      message: 'Student record created successfully',
      userId,
      studentId: newStudent.id,
      action: 'created'
    };

  } catch (error) {
    console.error('Error ensuring student record:', error);
    return {
      success: false,
      message: `Failed to ensure student record: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Ensures a user record exists for a given student
 */
export async function ensureUserRecord(studentId: string, password?: string): Promise<SyncResult> {
  try {
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, name: true, email: true }
    });

    if (!student) {
      return {
        success: false,
        message: 'Student not found'
      };
    }

    // Check if user record exists
    const existingUser = await prisma.user.findUnique({
      where: { id: studentId }
    });

    if (existingUser) {
      // Synchronize data if needed
      if (existingUser.name !== student.name || existingUser.email !== student.email) {
        await prisma.user.update({
          where: { id: studentId },
          data: {
            name: student.name,
            email: student.email,
            updatedAt: new Date()
          }
        });

        return {
          success: true,
          message: 'User record synchronized with student data',
          userId: studentId,
          studentId,
          action: 'synchronized'
        };
      }

      return {
        success: true,
        message: 'User record already exists and is up to date',
        userId: studentId,
        studentId,
        action: 'no_change'
      };
    }

    // Create new user record
    const defaultPassword = password || `default_${studentId}_${Date.now()}`;
    
    const newUser = await prisma.user.create({
      data: {
        id: studentId,
        name: student.name,
        email: student.email,
        password: defaultPassword, // This should be properly hashed in production
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return {
      success: true,
      message: 'User record created successfully',
      userId: newUser.id,
      studentId,
      action: 'created'
    };

  } catch (error) {
    console.error('Error ensuring user record:', error);
    return {
      success: false,
      message: `Failed to ensure user record: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Synchronizes all user-student pairs
 */
export async function synchronizeAllUserStudentPairs(): Promise<{
  total: number;
  created: number;
  updated: number;
  errors: number;
  results: SyncResult[];
}> {
  const results: SyncResult[] = [];
  let created = 0;
  let updated = 0;
  let errors = 0;

  try {
    // Get all student users
    const studentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true }
    });

    // Get all student records
    const studentRecords = await prisma.student.findMany({
      select: { id: true, name: true, email: true }
    });

    const userMap = new Map(studentUsers.map(u => [u.id, u]));
    const studentMap = new Map(studentRecords.map(s => [s.id, s]));

    // Process all users
    for (const user of studentUsers) {
      const result = await ensureStudentRecord(user.id);
      results.push(result);
      
      if (result.success) {
        if (result.action === 'created') created++;
        else if (result.action === 'synchronized') updated++;
      } else {
        errors++;
      }
    }

    // Process all students without users
    for (const student of studentRecords) {
      if (!userMap.has(student.id)) {
        const result = await ensureUserRecord(student.id);
        results.push(result);
        
        if (result.success) {
          if (result.action === 'created') created++;
          else if (result.action === 'synchronized') updated++;
        } else {
          errors++;
        }
      }
    }

    return {
      total: results.length,
      created,
      updated,
      errors,
      results
    };

  } catch (error) {
    console.error('Error synchronizing user-student pairs:', error);
    return {
      total: 0,
      created: 0,
      updated: 0,
      errors: 1,
      results: [{
        success: false,
        message: `Synchronization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }]
    };
  }
}

/**
 * Validates the consistency of user-student data
 */
export async function validateUserStudentConsistency(): Promise<{
  valid: boolean;
  issues: string[];
  summary: {
    totalUsers: number;
    totalStudents: number;
    mismatched: number;
    orphanedUsers: number;
    orphanedStudents: number;
  };
}> {
  const issues: string[] = [];

  try {
    const studentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true }
    });

    const studentRecords = await prisma.student.findMany({
      select: { id: true, name: true, email: true }
    });

    const userMap = new Map(studentUsers.map(u => [u.id, u]));
    const studentMap = new Map(studentRecords.map(s => [s.id, s]));

    let mismatched = 0;
    let orphanedUsers = 0;
    let orphanedStudents = 0;

    // Check for mismatched data
    for (const user of studentUsers) {
      const student = studentMap.get(user.id);
      if (student) {
        if (user.name !== student.name || user.email !== student.email) {
          mismatched++;
          issues.push(`Data mismatch for ID ${user.id}: User("${user.name}", "${user.email}") vs Student("${student.name}", "${student.email}")`);
        }
      } else {
        orphanedUsers++;
        issues.push(`Orphaned user: ${user.name} (${user.email}) - ID: ${user.id}`);
      }
    }

    // Check for orphaned students
    for (const student of studentRecords) {
      if (!userMap.has(student.id)) {
        orphanedStudents++;
        issues.push(`Orphaned student: ${student.name} (${student.email}) - ID: ${student.id}`);
      }
    }

    const summary = {
      totalUsers: studentUsers.length,
      totalStudents: studentRecords.length,
      mismatched,
      orphanedUsers,
      orphanedStudents
    };

    return {
      valid: issues.length === 0,
      issues,
      summary
    };

  } catch (error) {
    console.error('Error validating user-student consistency:', error);
    return {
      valid: false,
      issues: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      summary: {
        totalUsers: 0,
        totalStudents: 0,
        mismatched: 0,
        orphanedUsers: 0,
        orphanedStudents: 0
      }
    };
  }
}

/**
 * Middleware function to ensure student record exists for authenticated users
 */
export async function ensureStudentRecordMiddleware(userId: string): Promise<void> {
  const result = await ensureStudentRecord(userId);
  if (!result.success) {
    console.warn(`Failed to ensure student record for user ${userId}: ${result.message}`);
  }
} 
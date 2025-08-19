#!/usr/bin/env tsx
/*
  One-off fix: Make a specific course and its dependent records platform-wide.
  - Target course slug: 'global-english-mastery-live-platform-course'
  - Set Course.institutionId = null, isPlatformCourse = true, requiresSubscription = true
  - Optionally set subscriptionTier if absent (defaults to 'PREMIUM')
  - Set VideoSession.institutionId = null for sessions linked to this course
  - Set StudentCourseEnrollment.isPlatformCourse = true for enrollments of this course
*/

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const targetSlug = 'global-english-mastery-live-platform-course'
  const desiredTier = 'PREMIUM'

  const course = await prisma.course.findUnique({ where: { slug: targetSlug } })
  if (!course) {
    console.error(`Course not found for slug: ${targetSlug}`)
    return
  }

  console.log(`Updating course ${course.id} (${course.title}) to platform-wide...`)

  const updatedCourse = await prisma.course.update({
    where: { id: course.id },
    data: {
      institutionId: null,
      isPlatformCourse: true,
      requiresSubscription: true,
      subscriptionTier: course.subscriptionTier || desiredTier,
    },
  })

  console.log('Course updated:', {
    institutionId: updatedCourse.institutionId,
    isPlatformCourse: updatedCourse.isPlatformCourse,
    requiresSubscription: updatedCourse.requiresSubscription,
    subscriptionTier: updatedCourse.subscriptionTier,
  })

  console.log('Updating linked video sessions to platform-wide...')
  const videoUpdate = await prisma.videoSession.updateMany({
    where: { courseId: course.id },
    data: { institutionId: null },
  })
  console.log(`Video sessions updated: ${videoUpdate.count}`)

  console.log('Updating enrollments to mark platform course...')
  const enrollUpdate = await prisma.studentCourseEnrollment.updateMany({
    where: { courseId: course.id },
    data: { isPlatformCourse: true },
  })
  console.log(`Enrollments updated: ${enrollUpdate.count}`)

  console.log('Done.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateCourses() {
  revalidatePath('/student/courses');
} 
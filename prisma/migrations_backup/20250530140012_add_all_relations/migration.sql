-- Add foreign key constraints for StudentInstitution
ALTER TABLE `student_institutions` ADD CONSTRAINT `student_institutions_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `student_institutions` ADD CONSTRAINT `student_institutions_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `institution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints for StudentCourseEnrollment
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints for StudentCourseCompletion
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `student_course_completions` ADD CONSTRAINT `student_course_completions_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints for CourseTag
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_course_id_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `coursetag` ADD CONSTRAINT `coursetag_tag_id_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add foreign key constraints for tag
ALTER TABLE `tag` ADD CONSTRAINT `tag_category_id_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add foreign key constraints for booking
ALTER TABLE `booking` ADD CONSTRAINT `booking_user_id_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `booking` ADD CONSTRAINT `booking_course_id_fkey` FOREIGN KEY (`courseId`) REFERENCES `course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `booking` ADD CONSTRAINT `booking_institution_id_fkey` FOREIGN KEY (`institutionId`) REFERENCES `institution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `booking` ADD CONSTRAINT `booking_student_id_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE; 
-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_course_enrollments` ADD CONSTRAINT `student_course_enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

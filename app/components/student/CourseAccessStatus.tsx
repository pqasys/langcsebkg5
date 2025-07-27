'use client';

import { Badge } from '@/components/ui/badge';
import { StudentCourseEnrollment } from '@prisma/client';

interface CourseAccessStatusProps {
  enrollment: StudentCourseEnrollment;
}

export default function CourseAccessStatus({ enrollment }: CourseAccessStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'PENDING_PAYMENT':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-blue-500';
      case 'EXPIRED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className={getStatusColor(enrollment.status)}>
        {enrollment.status.replace('_', ' ')}
      </Badge>
      {enrollment.progress !== null && (
        <span className="text-sm text-muted-foreground">
          {enrollment.progress}%
        </span>
      )}
    </div>
  );
} 
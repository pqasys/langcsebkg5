import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from '@/components/ui/rating';
import { Clock, BookOpen, CheckCircle, XCircle, Star, MessageSquare, Play, ArrowRight } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface ModuleProgressCardProps {
  module: {
    id: string;
    title: string;
    description: string;
    level: string;
    estimated_duration: number;
  };
  progress: {
    contentCompleted: boolean;
    exercisesCompleted: boolean;
    quizCompleted: boolean;
    timeSpent: number;
    quizScore?: number;
    notes?: string;
    difficultyRating?: number;
    feedback?: string;
    lastAccessedAt?: Date;
  };
  onUpdateProgress: (data: unknown) => Promise<void>;
  courseId?: string; // Add courseId prop for navigation
}

export function ModuleProgressCard({ module, progress, onUpdateProgress, courseId }: ModuleProgressCardProps) {
  const router = useRouter();
  const [notes, setNotes] = React.useState(progress.notes || '');
  const [difficultyRating, setDifficultyRating] = React.useState(progress.difficultyRating || 0);
  const [feedback, setFeedback] = React.useState(progress.feedback || '');
  const [isEditing, setIsEditing] = React.useState(false);

  const totalProgress = [
    progress.contentCompleted,
    progress.exercisesCompleted,
    progress.quizCompleted,
  ].filter(Boolean).length / 3 * 100;

  const handleSave = async () => {
    await onUpdateProgress({
      notes,
      difficultyRating,
      feedback,
    });
    setIsEditing(false);
  };

  const handleAccessModule = () => {
    if (courseId) {
      router.push(`/student/courses/${courseId}/modules/${module.id}`);
    }
  };

  const getModuleStatus = () => {
    if (totalProgress === 100) return 'completed';
    if (totalProgress > 0) return 'in_progress';
    return 'not_started';
  };

  const getButtonText = () => {
    const status = getModuleStatus();
    switch (status) {
      case 'completed':
        return 'Review Module';
      case 'in_progress':
        return 'Continue Learning';
      default:
        return 'Start Learning';
    }
  };

  const getButtonVariant = () => {
    const status = getModuleStatus();
    switch (status) {
      case 'completed':
        return 'outline' as const;
      case 'in_progress':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{module.title}</span>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {formatDuration(progress.timeSpent)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} />
          </div>

          {/* Completion Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Content</span>
              {progress.contentCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Exercises</span>
              {progress.exercisesCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm">Quiz</span>
              {progress.quizCompleted ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>

          {/* Quiz Score */}
          {progress.quizScore !== undefined && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="text-sm">Quiz Score: {progress.quizScore}%</span>
            </div>
          )}

          {/* Navigation Button */}
          {courseId && (
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleAccessModule}
                variant={getButtonVariant()}
                className="w-full sm:w-auto"
              >
                <Play className="h-4 w-4 mr-2" />
                {getButtonText()}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Notes and Feedback */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Personal Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty Rating</label>
                <Rating
                  value={difficultyRating}
                  onChange={setDifficultyRating}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Feedback</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your feedback..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {notes && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-1" />
                  <p className="text-sm">{notes}</p>
                </div>
              )}
              {difficultyRating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">Difficulty: {difficultyRating}/5</span>
                </div>
              )}
              {feedback && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-1" />
                  <p className="text-sm">{feedback}</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="mt-2"
              >
                {notes || feedback ? 'Edit Notes & Feedback' : 'Add Notes & Feedback'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
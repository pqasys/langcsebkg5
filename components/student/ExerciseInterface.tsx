'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Exercise {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'FILL_IN_BLANK' | 'MATCHING' | 'SHORT_ANSWER';
  question: string;
  options: unknown;
  answer: string;
  order_index: number;
}

interface ExerciseInterfaceProps {
  exercise: Exercise;
  onComplete?: (exerciseId: string, isCorrect: boolean, userAnswer: string) => void;
  showAnswers?: boolean;
}

export default function ExerciseInterface({ 
  exercise, 
  onComplete, 
  showAnswers = false 
}: ExerciseInterfaceProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [matchingAnswers, setMatchingAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (exercise.type === 'MATCHING' && exercise.options) {
      setMatchingAnswers(new Array(exercise.options.length).fill(''));
    }
  }, [exercise]);

  const handleSubmit = () => {
    let currentAnswer = '';
    let correct = false;

    switch (exercise.type) {
      case 'MULTIPLE_CHOICE':
        currentAnswer = selectedOption;
        correct = selectedOption === exercise.answer;
        break;
      
      case 'FILL_IN_BLANK':
        currentAnswer = userAnswer.trim();
        correct = currentAnswer.toLowerCase() === exercise.answer.toLowerCase();
        break;
      
      case 'SHORT_ANSWER':
        currentAnswer = userAnswer.trim();
        const expectedAnswers = exercise.answer.toLowerCase().split(',').map(a => a.trim());
        correct = expectedAnswers.some(expected => 
          currentAnswer.toLowerCase().includes(expected)
        );
        break;
      
      case 'MATCHING':
        currentAnswer = matchingAnswers.join('|');
        const correctMatches = exercise.options.map((pair: unknown, index: number) => 
          matchingAnswers[index] === pair.right
        );
        correct = correctMatches.every(match => match);
        break;
    }

    setIsSubmitted(true);
    setIsCorrect(correct);
    setFeedback(correct ? 'Correct! Well done!' : `Incorrect. The correct answer is: ${exercise.answer}`);

    if (onComplete) {
      onComplete(exercise.id, correct, currentAnswer);
    }

    if (correct) {
      toast.success('Correct answer!');
    } else {
      toast.error('Incorrect answer. Try again!');
    }
  };

  const handleMatchingChange = (index: number, value: string) => {
    const newAnswers = [...matchingAnswers];
    newAnswers[index] = value;
    setMatchingAnswers(newAnswers);
  };

  const renderExerciseContent = () => {
    switch (exercise.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {exercise.options.map((option: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="multiple-choice"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  disabled={isSubmitted}
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm md:text-base leading-relaxed">
                  {option}
                </Label>
                {isSubmitted && showAnswers && (
                  <Badge variant={option === exercise.answer ? "default" : "secondary"} className="flex-shrink-0">
                    {option === exercise.answer ? "Correct" : "Incorrect"}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        );

      case 'FILL_IN_BLANK':
        return (
          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm md:text-base leading-relaxed">
                {exercise.question.split('_').map((part, index, array) => (
                  <span key={index}>
                    {part}
                    {index < array.length - 1 && (
                      <Input
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Your answer"
                        disabled={isSubmitted}
                        className="inline-block w-24 md:w-32 mx-1 h-8 md:h-10 text-sm"
                      />
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        );

      case 'MATCHING':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">{exercise.answer}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="font-semibold text-sm">Left Column</Label>
                {exercise.options.map((pair: unknown, index: number) => (
                  <div key={index} className="p-3 bg-muted rounded text-sm">
                    {pair.left}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <Label className="font-semibold text-sm">Your Answers</Label>
                {exercise.options.map((pair: unknown, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={matchingAnswers[index] || ''}
                      onChange={(e) => handleMatchingChange(index, e.target.value)}
                      placeholder="Match with..."
                      disabled={isSubmitted}
                      className="h-10 text-sm"
                    />
                    {isSubmitted && showAnswers && (
                      <Badge variant={matchingAnswers[index] === pair.right ? "default" : "secondary"} className="flex-shrink-0">
                        {matchingAnswers[index] === pair.right ? "✓" : "✗"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'SHORT_ANSWER':
        return (
          <div className="space-y-3">
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer..."
              rows={4}
              disabled={isSubmitted}
              className="text-sm md:text-base"
            />
            {isSubmitted && showAnswers && (
              <div className="p-3 bg-muted rounded">
                <Label className="font-semibold text-sm">Expected Answer:</Label>
                <p className="text-sm mt-1">{exercise.answer}</p>
              </div>
            )}
          </div>
        );

      default:
        return <p>Unsupported exercise type</p>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-base md:text-lg">Exercise {exercise.order_index}</CardTitle>
          <Badge variant="outline" className="self-start sm:self-auto text-xs">
            {exercise.type.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose max-w-none">
          <p className="text-sm md:text-base leading-relaxed">{exercise.question}</p>
        </div>

        {renderExerciseContent()}

        {isSubmitted && (
          <div className={`p-4 rounded-lg flex items-start space-x-3 ${
            isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <span className="font-medium text-sm">{feedback}</span>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          {!isSubmitted ? (
            <Button 
              onClick={handleSubmit}
              disabled={
                (exercise.type === 'MULTIPLE_CHOICE' && !selectedOption) ||
                (exercise.type === 'FILL_IN_BLANK' && !userAnswer.trim()) ||
                (exercise.type === 'SHORT_ANSWER' && !userAnswer.trim()) ||
                (exercise.type === 'MATCHING' && matchingAnswers.some(answer => !answer.trim()))
              }
              className="h-10 px-6 text-sm"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSubmitted(false);
                setUserAnswer('');
                setSelectedOption('');
                setMatchingAnswers(new Array(exercise.options?.length || 0).fill(''));
                setIsCorrect(false);
                setFeedback('');
              }}
              className="h-10 px-6 text-sm"
            >
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
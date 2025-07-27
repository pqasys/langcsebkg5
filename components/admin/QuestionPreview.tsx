'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Target,
  Move,
  AlignLeft,
  CheckSquare,
  FileText
} from 'lucide-react';

interface QuestionOption {
  id?: string;
  option_type: string;
  content: string;
  media_url?: string;
  order_index: number;
  is_correct: boolean;
  points: number;
  metadata?: unknown;
}

interface QuestionPreviewProps {
  question: {
    id: string;
    type: string;
    question: string;
    options?: string | string[];
    correct_answer?: string;
    points: number;
    explanation?: string;
    hints?: string;
    order_index: number;
    difficulty?: string;
    category?: string;
    question_config?: unknown;
    media_url?: string;
    media_type?: string;
    questionOptions?: QuestionOption[];
  };
  onClose: () => void;
}

export function QuestionPreview({ question, onClose }: QuestionPreviewProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [dragItems, setDragItems] = useState<string[]>([]);
  const [dropZones, setDropZones] = useState<string[]>([]);
  const [hotspotCoords, setHotspotCoords] = useState<{ x: number; y: number } | null>(null);
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);

  React.useEffect(() => {
    initializeQuestionState();
  }, [question]);

  const initializeQuestionState = () => {
    switch (question.type) {
      case 'DRAG_DROP':
        if (question.question_config?.dragItems) {
          setDragItems([...question.question_config.dragItems]);
        }
        if (question.question_config?.dropZones) {
          setDropZones([...question.question_config.dropZones]);
        }
        break;
      case 'ORDERING':
        if (question.question_config?.orderItems) {
          setOrderItems([...question.question_config.orderItems]);
        }
        break;
      case 'HOTSPOT':
        setHotspotCoords(null);
        break;
      case 'MULTIPLE_ANSWER':
        setMultipleAnswers([]);
        break;
    }
  };

  const handleAnswerChange = (answer: unknown) => {
    setSelectedAnswers({ [question.id]: answer });
  };

  const handleMultipleAnswerChange = (option: string, checked: boolean) => {
    setMultipleAnswers(prev => 
      checked 
        ? [...prev, option]
        : prev.filter(item => item !== option)
    );
  };

  const handleDragDrop = (dragItem: string, dropZone: string) => {
    setSelectedAnswers({ [question.id]: { dragItem, dropZone } });
  };

  const handleHotspotClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setHotspotCoords({ x, y });
    setSelectedAnswers({ [question.id]: { x, y } });
  };

  const handleOrderChange = (fromIndex: number, toIndex: number) => {
    const newOrder = [...orderItems];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setOrderItems(newOrder);
    setSelectedAnswers({ [question.id]: newOrder });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const renderMedia = () => {
    if (!question.media_url) return null;

    switch (question.media_type) {
      case 'image':
        return (
          <div className="mb-4">
            <img 
              src={question.media_url} 
              alt="Question media" 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'video':
        return (
          <div className="mb-4">
            <video 
              src={question.media_url} 
              controls 
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        );
      case 'audio':
        return (
          <div className="mb-4">
            <audio 
              src={question.media_url} 
              controls 
              className="w-full"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {question.questionOptions?.map((option, index) => (
              <label key={option.id || index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.content}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option.content}</span>
                {showResults && option.is_correct && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {showResults && !option.is_correct && selectedAnswers[question.id] === option.content && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </label>
            ))}
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-3">
            {['True', 'False'].map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
                {showResults && option === question.correct_answer && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {showResults && option !== question.correct_answer && selectedAnswers[question.id] === option && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </label>
            ))}
          </div>
        );

      case 'MULTIPLE_ANSWER':
        return (
          <div className="space-y-3">
            {question.questionOptions?.map((option, index) => (
              <label key={option.id || index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={multipleAnswers.includes(option.content)}
                  onChange={(e) => handleMultipleAnswerChange(option.content, e.target.checked)}
                  className="w-4 h-4"
                />
                <span>{option.content}</span>
                {showResults && option.is_correct && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {showResults && !option.is_correct && multipleAnswers.includes(option.content) && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </label>
            ))}
          </div>
        );

      case 'SHORT_ANSWER':
        return (
          <div className="space-y-3">
            <textarea
              className="w-full p-3 border rounded-lg"
              placeholder="Enter your answer..."
              rows={3}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>
        );

      case 'ESSAY':
        return (
          <div className="space-y-3">
            <textarea
              className="w-full p-3 border rounded-lg"
              placeholder="Write your essay..."
              rows={6}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>
        );

      case 'FILL_IN_BLANK':
        return (
          <div className="space-y-3">
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Fill in the blank..."
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          </div>
        );

      case 'MATCHING':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Match the items on the left with those on the right</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {question.question_config?.leftItems?.map((item: string, index: number) => (
                  <div key={index} className="p-2 bg-gray-100 rounded">
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {question.question_config?.rightItems?.map((item: string, index: number) => (
                  <div key={index} className="p-2 bg-gray-100 rounded">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'DRAG_DROP':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {dragItems.map((item, index) => (
                <div
                  key={index}
                  className="p-2 bg-blue-100 border-2 border-dashed border-blue-300 rounded cursor-move"
                  draggable
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {dropZones.map((zone, index) => (
                <div
                  key={index}
                  className="p-4 border-2 border-dashed border-gray-300 rounded min-h-[60px] flex items-center justify-center"
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragItem = e.dataTransfer.getData('text');
                    handleDragDrop(dragItem, zone);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {zone}
                </div>
              ))}
            </div>
          </div>
        );

      case 'HOTSPOT':
        return (
          <div className="space-y-4">
            <canvas
              width={400}
              height={300}
              className="border rounded-lg cursor-crosshair"
              onClick={handleHotspotClick}
              style={{ backgroundImage: `url(${question.media_url})`, backgroundSize: 'cover' }}
            />
            {hotspotCoords && (
              <div className="text-sm text-muted-foreground">
                Clicked at: ({hotspotCoords.x.toFixed(1)}%, {hotspotCoords.y.toFixed(1)}%)
              </div>
            )}
          </div>
        );

      case 'ORDERING':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Arrange the items in the correct order</p>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-100 rounded flex items-center justify-between"
                >
                  <span>{item}</span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => index > 0 && handleOrderChange(index, index - 1)}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => index < orderItems.length - 1 && handleOrderChange(index, index + 1)}
                      disabled={index === orderItems.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            Question type not supported in preview
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Question Preview</span>
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{question.type}</Badge>
            <Badge variant="outline">{question.points} points</Badge>
            {question.difficulty && (
              <Badge variant="outline">{question.difficulty}</Badge>
            )}
            {question.category && (
              <Badge variant="outline">{question.category}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderMedia()}
          
          <div>
            <h3 className="text-lg font-medium mb-4">{question.question}</h3>
            {renderQuestionContent()}
          </div>

          {question.hints && (
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                <strong>Hint:</strong> {question.hints}
              </AlertDescription>
            </Alert>
          )}

          {showResults && question.explanation && (
            <Alert>
              <AlignLeft className="h-4 w-4" />
              <AlertDescription>
                <strong>Explanation:</strong> {question.explanation}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            {!showResults ? (
              <Button onClick={handleSubmit}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={onClose}>
                Close Preview
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
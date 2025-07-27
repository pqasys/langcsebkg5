'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Plus, Trash2, CheckSquare, FileText, AlignLeft, Move, Target } from 'lucide-react';
import { toast } from 'sonner';

interface Quiz {
  id: string;
  title: string;
}

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: CheckSquare },
  { value: 'TRUE_FALSE', label: 'True/False', icon: CheckSquare },
  { value: 'SHORT_ANSWER', label: 'Short Answer', icon: FileText },
  { value: 'ESSAY', label: 'Essay', icon: AlignLeft },
  { value: 'FILL_IN_BLANK', label: 'Fill in the Blank', icon: FileText },
  { value: 'MATCHING', label: 'Matching', icon: Move },
  { value: 'DRAG_DROP', label: 'Drag & Drop', icon: Move },
  { value: 'HOTSPOT', label: 'Hotspot', icon: Target },
  { value: 'ORDERING', label: 'Ordering', icon: Move },
  { value: 'MULTIPLE_ANSWER', label: 'Multiple Answer', icon: CheckSquare },
];

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export default function AddQuestionPage({ params }: { params: { id: string; moduleId: string; quizId: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questionData, setQuestionData] = useState({
    type: 'MULTIPLE_CHOICE',
    question: '',
    points: 1,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    difficulty: 'MEDIUM',
    category: '',
    hints: '',
    question_config: {},
    media_url: '',
    media_type: ''
  });

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz - Context: throw new Error('Failed to fetch quiz');...`);
      }
      
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load quiz. Please try again or contact support if the problem persists.`);
      setError('Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [params.quizId]);

  const handleSave = async () => {
    if (!questionData.question.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (questionData.type === 'MULTIPLE_CHOICE' && !questionData.correct_answer) {
      toast.error('Please select a correct answer');
      return;
    }

    if (questionData.type === 'TRUE_FALSE' && !questionData.correct_answer) {
      toast.error('Please select a correct answer');
      return;
    }

    // Ensure options exist for question types that need them
    if (['MULTIPLE_CHOICE', 'MULTIPLE_ANSWER'].includes(questionData.type)) {
      const options = questionData.options || [];
      if (options.length < 2 || options.some(opt => !opt.trim())) {
        toast.error('Multiple choice questions require at least 2 valid options');
        return;
      }
    }

    // Validate drag and drop questions
    if (questionData.type === 'DRAG_DROP') {
      const dragItems = questionData.question_config?.dragItems || [];
      const dropZones = questionData.question_config?.dropZones || [];
      const correctMapping = questionData.correct_answer || '';
      
      if (dragItems.length === 0) {
        toast.error('Drag and drop questions require drag items');
        return;
      }
      
      if (dropZones.length === 0) {
        toast.error('Drag and drop questions require drop zones');
        return;
      }
      
      if (!correctMapping.trim()) {
        toast.error('Drag and drop questions require correct answer mapping');
        return;
      }
      
      // Validate mapping format
      const mappings = correctMapping.split('\n').filter(line => line.trim());
      if (mappings.length === 0) {
        toast.error('Please provide at least one correct answer mapping');
        return;
      }
      
      for (const mapping of mappings) {
        if (!mapping.includes(':')) {
          toast.error('Each mapping must be in format: dragItem:dropZone');
          return;
        }
      }
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add question - Context: body: JSON.stringify(questionData),...`);
      }

      toast.success('Question added successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to adding question. Please try again or contact support if the problem persists.`);
      toast.error('Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
  };

  const updateQuestionField = (field: string, value: unknown) => {
    if (field === 'type') {
      // Clear options and correct_answer when changing to non-option question types
      const optionTypes = ['MULTIPLE_CHOICE', 'MULTIPLE_ANSWER', 'TRUE_FALSE'];
      if (!optionTypes.includes(value)) {
        setQuestionData({ 
          ...questionData, 
          [field]: value,
          options: [],
          correct_answer: ''
        });
      } else {
        setQuestionData({ ...questionData, [field]: value });
      }
    } else {
      setQuestionData({ ...questionData, [field]: value });
    }
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = questionData.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const addOption = () => {
    // Initialize options array if it doesn't exist
    const currentOptions = questionData.options || [];
    setQuestionData({
      ...questionData,
      options: [...currentOptions, '']
    });
  };

  const removeOption = (index: number) => {
    const currentOptions = questionData.options || [];
    if (currentOptions.length <= 2) {
      toast.error('At least 2 options are required');
      return;
    }
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setQuestionData({
      ...questionData,
      options: newOptions,
      correct_answer: questionData.correct_answer === currentOptions[index] ? '' : questionData.correct_answer
    });
  };

  const renderQuestionTypeSpecificFields = () => {
    switch (questionData.type) {
      case 'MULTIPLE_CHOICE':
      case 'MULTIPLE_ANSWER':
        // Ensure options array exists
        const options = questionData.options || ['', ''];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={options.length >= 6}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type={questionData.type === 'MULTIPLE_ANSWER' ? 'checkbox' : 'radio'}
                    name="correct_answer"
                    value={option}
                    checked={questionData.type === 'MULTIPLE_ANSWER' 
                      ? questionData.correct_answer.includes(option)
                      : questionData.correct_answer === option}
                    onChange={(e) => {
                      if (questionData.type === 'MULTIPLE_ANSWER') {
                        const currentAnswers = questionData.correct_answer ? questionData.correct_answer.split(',').filter(a => a.trim()) : [];
                        if (e.target.checked) {
                          updateQuestionField('correct_answer', [...currentAnswers, option].join(','));
                        } else {
                          updateQuestionField('correct_answer', currentAnswers.filter(a => a !== option).join(','));
                        }
                      } else {
                        updateQuestionField('correct_answer', e.target.value);
                      }
                    }}
                    className="rounded"
                  />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={questionData.correct_answer === 'true' ? 'default' : 'outline'}
                  onClick={() => updateQuestionField('correct_answer', 'true')}
                >
                  True
                </Button>
                <Button
                  type="button"
                  variant={questionData.correct_answer === 'false' ? 'default' : 'outline'}
                  onClick={() => updateQuestionField('correct_answer', 'false')}
                >
                  False
                </Button>
              </div>
            </div>
          </div>
        );

      case 'SHORT_ANSWER':
      case 'ESSAY':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Expected Answer (Optional)</Label>
              <Textarea
                value={questionData.correct_answer}
                onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                placeholder="Provide a sample correct answer or key points..."
                rows={3}
              />
            </div>
          </div>
        );

      case 'FILL_IN_BLANK':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Input
                value={questionData.correct_answer}
                onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                placeholder="Enter the correct answer"
              />
            </div>
            <div className="space-y-2">
              <Label>Alternative Answers (comma-separated)</Label>
              <Textarea
                value={questionData.hints}
                onChange={(e) => updateQuestionField('hints', e.target.value)}
                placeholder="Enter alternative acceptable answers..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'MATCHING':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Left Items</Label>
              <Textarea
                value={questionData.question_config?.leftItems?.join('\n') || ''}
                onChange={(e) => {
                  const leftItems = e.target.value.split('\n').filter(item => item.trim());
                  setQuestionData({
                    ...questionData,
                    question_config: {
                      ...questionData.question_config,
                      leftItems
                    }
                  });
                }}
                placeholder="Left item 1&#10;Left item 2&#10;Left item 3"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Right Items</Label>
              <Textarea
                value={questionData.question_config?.rightItems?.join('\n') || ''}
                onChange={(e) => {
                  const rightItems = e.target.value.split('\n').filter(item => item.trim());
                  setQuestionData({
                    ...questionData,
                    question_config: {
                      ...questionData.question_config,
                      rightItems
                    }
                  });
                }}
                placeholder="Right item 1&#10;Right item 2&#10;Right item 3"
                rows={3}
              />
            </div>
          </div>
        );

      case 'DRAG_DROP':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Drag Items</Label>
              <Textarea
                value={questionData.question_config?.dragItems?.join('\n') || ''}
                onChange={(e) => {
                  const dragItems = e.target.value.split('\n').filter(item => item.trim());
                  setQuestionData({
                    ...questionData,
                    question_config: {
                      ...questionData.question_config,
                      dragItems
                    }
                  });
                }}
                placeholder="Drag item 1&#10;Drag item 2&#10;Drag item 3"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Drop Zones</Label>
              <Textarea
                value={questionData.question_config?.dropZones?.join('\n') || ''}
                onChange={(e) => {
                  const dropZones = e.target.value.split('\n').filter(item => item.trim());
                  setQuestionData({
                    ...questionData,
                    question_config: {
                      ...questionData.question_config,
                      dropZones
                    }
                  });
                }}
                placeholder="Drop zone 1&#10;Drop zone 2&#10;Drop zone 3"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Correct Answer Mapping</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Specify which drag item should be dropped in which zone (dragItem:dropZone format, one per line)
              </div>
              <Textarea
                value={questionData.correct_answer || ''}
                onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                placeholder="Apple:Red fruit&#10;Banana:Yellow fruit&#10;Orange:Orange fruit"
                rows={3}
              />
              <div className="text-xs text-muted-foreground">
                Format: dragItem:dropZone (one mapping per line)
              </div>
            </div>
          </div>
        );

      case 'HOTSPOT':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // Handle file upload logic here
                    toast.info('Image upload functionality will be implemented');
                  }}
                  className="hidden"
                  id="hotspot-image"
                />
                <label htmlFor="hotspot-image" className="cursor-pointer">
                  <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload image for hotspot question</p>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hotspot Coordinates (x,y format)</Label>
              <Input
                value={questionData.correct_answer}
                onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                placeholder="e.g., 100,150"
              />
            </div>
          </div>
        );

      case 'ORDERING':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Items to Order</Label>
              <Textarea
                value={questionData.question_config?.orderItems?.join('\n') || ''}
                onChange={(e) => {
                  const orderItems = e.target.value.split('\n').filter(item => item.trim());
                  setQuestionData({
                    ...questionData,
                    question_config: {
                      ...questionData.question_config,
                      orderItems
                    }
                  });
                }}
                placeholder="Item 1&#10;Item 2&#10;Item 3&#10;Item 4"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add Question</h1>
            <p className="text-muted-foreground">
              Add a new question to "{quiz.title}"
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Question'}
        </Button>
      </div>

      {/* Question Form */}
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Question Type</Label>
              <Select value={questionData.type} onValueChange={(value) => updateQuestionField('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={questionData.difficulty} onValueChange={(value) => updateQuestionField('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={questionData.points}
                onChange={(e) => updateQuestionField('points', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question Text</Label>
            <Textarea
              id="question"
              value={questionData.question}
              onChange={(e) => updateQuestionField('question', e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
            />
          </div>

          {/* Question Type Specific Fields */}
          {renderQuestionTypeSpecificFields()}

          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              value={questionData.category}
              onChange={(e) => updateQuestionField('category', e.target.value)}
              placeholder="e.g., Vocabulary, Grammar, Reading"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              value={questionData.explanation}
              onChange={(e) => updateQuestionField('explanation', e.target.value)}
              placeholder="Explain why this answer is correct..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
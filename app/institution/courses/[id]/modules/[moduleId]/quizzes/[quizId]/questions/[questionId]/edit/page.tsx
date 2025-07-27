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

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correct_answer?: string;
  points: number;
  explanation?: string;
  difficulty?: string;
  category?: string;
  hints?: string;
  question_config?: unknown;
  media_url?: string;
  media_type?: string;
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

export default function EditQuestionPage({
  params
}: {
  params: { id: string; moduleId: string; quizId: string; questionId: string };
}) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizResponse = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
        if (!quizResponse.ok) {
          throw new Error(`Failed to fetch quiz - Context: throw new Error('Failed to fetch quiz');...`);
        }
        const quizData = await quizResponse.json();
        setQuiz(quizData);

        // Fetch question details
        const questionResponse = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/${params.questionId}`);
        if (!questionResponse.ok) {
          throw new Error('Failed to fetch question');
        }
        const questionData = await questionResponse.json();
        setQuestion(questionData);

        // Parse options if they exist
        let options = ['', '', '', ''];
        if (questionData.options) {
          try {
            const parsedOptions = JSON.parse(questionData.options);
            if (Array.isArray(parsedOptions)) {
              options = parsedOptions;
            }
          } catch (e) {
            // // // // // // console.warn('Failed to parse options:', e);
          }
        }

        // Parse question_config if it exists
        let questionConfig = {};
        if (questionData.question_config) {
          try {
            const parsedConfig = JSON.parse(questionData.question_config);
            if (typeof parsedConfig === 'object') {
              questionConfig = parsedConfig;
            }
          } catch (e) {
            console.warn('Failed to parse question_config:', e);
          }
        }

        setFormData({
          type: questionData.type || 'MULTIPLE_CHOICE',
          question: questionData.question || '',
          points: questionData.points || 1,
          options: options,
          correct_answer: questionData.correct_answer || '',
          explanation: questionData.explanation || '',
          difficulty: questionData.difficulty || 'MEDIUM',
          category: questionData.category || '',
          hints: questionData.hints || '',
          question_config: questionConfig,
          media_url: questionData.media_url || '',
          media_type: questionData.media_type || ''
        });
      } catch (error) {
        console.error('Error occurred:', error);
        toast.error(`Failed to load data. Please try again or contact support if the problem persists.`);
        toast.error('Failed to load question data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.moduleId, params.quizId, params.questionId]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) {
      toast.error('At least 2 options are required');
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions,
      correct_answer: formData.correct_answer === formData.options[index] ? '' : formData.correct_answer
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (formData.type === 'MULTIPLE_CHOICE' && !formData.correct_answer) {
      toast.error('Please select a correct answer');
      return;
    }

    if (formData.type === 'TRUE_FALSE' && !formData.correct_answer) {
      toast.error('Please select a correct answer');
      return;
    }

    // Validate drag and drop questions
    if (formData.type === 'DRAG_DROP') {
      const dragItems = formData.question_config?.dragItems || [];
      const dropZones = formData.question_config?.dropZones || [];
      const correctMapping = formData.correct_answer || '';
      
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

    setSaving(true);
    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/${params.questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('Question updated successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating question. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/${params.questionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('Question deleted successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting question. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to delete question');
    } finally {
      setSaving(false);
    }
  };

  const renderQuestionTypeSpecificFields = () => {
    switch (formData.type) {
      case 'MULTIPLE_CHOICE':
      case 'MULTIPLE_ANSWER':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={formData.options.length >= 6}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type={formData.type === 'MULTIPLE_ANSWER' ? 'checkbox' : 'radio'}
                    name="correct_answer"
                    value={option}
                    checked={formData.type === 'MULTIPLE_ANSWER' 
                      ? formData.correct_answer.includes(option)
                      : formData.correct_answer === option}
                    onChange={(e) => {
                      if (formData.type === 'MULTIPLE_ANSWER') {
                        const currentAnswers = formData.correct_answer ? formData.correct_answer.split(',').filter(a => a.trim()) : [];
                        if (e.target.checked) {
                          setFormData({ ...formData, correct_answer: [...currentAnswers, option].join(',') });
                        } else {
                          setFormData({ ...formData, correct_answer: currentAnswers.filter(a => a !== option).join(',') });
                        }
                      } else {
                        setFormData({ ...formData, correct_answer: e.target.value });
                      }
                    }}
                    className="rounded"
                  />
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.options.length > 2 && (
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
                  variant={formData.correct_answer === 'true' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, correct_answer: 'true' })}
                >
                  True
                </Button>
                <Button
                  type="button"
                  variant={formData.correct_answer === 'false' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, correct_answer: 'false' })}
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
                value={formData.correct_answer}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
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
                value={formData.correct_answer}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                placeholder="Enter the correct answer"
              />
            </div>
            <div className="space-y-2">
              <Label>Alternative Answers (comma-separated)</Label>
              <Textarea
                value={formData.hints}
                onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
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
                value={formData.question_config?.leftItems?.join('\n') || ''}
                onChange={(e) => {
                  const leftItems = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
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
                value={formData.question_config?.rightItems?.join('\n') || ''}
                onChange={(e) => {
                  const rightItems = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
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
                value={formData.question_config?.dragItems?.join('\n') || ''}
                onChange={(e) => {
                  const dragItems = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
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
                value={formData.question_config?.dropZones?.join('\n') || ''}
                onChange={(e) => {
                  const dropZones = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
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
                value={formData.correct_answer || ''}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
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
                value={formData.correct_answer}
                onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
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
                value={formData.question_config?.orderItems?.join('\n') || ''}
                onChange={(e) => {
                  const orderItems = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
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
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !question) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Question not found</p>
          <Button
            onClick={() => router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`)}
            className="mt-4"
          >
            Back to Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Quiz
        </Button>
        <h1 className="text-3xl font-bold">Edit Question</h1>
        <p className="text-muted-foreground mt-2">
          Quiz: {quiz.title}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                  max="100"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter your question here..."
                rows={3}
                required
              />
            </div>

            {/* Question Type Specific Fields */}
            {renderQuestionTypeSpecificFields()}

            <div className="space-y-2">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Vocabulary, Grammar, Reading"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Explanation (Optional)</Label>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Explain why this answer is correct..."
                rows={2}
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete Question
              </Button>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 